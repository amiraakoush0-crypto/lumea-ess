-- Luméa Essentials — Complete Production Supabase Schema
-- Run this in your Supabase project's SQL Editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Categories Table
-- ─────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed starter categories
insert into public.categories (name, slug) values
  ('Serums', 'serums'),
  ('Moisturizers', 'moisturizers'),
  ('Cleansers', 'cleansers'),
  ('Treatments', 'treatments'),
  ('Essences', 'essences')
on conflict (name) do nothing;

-- ─────────────────────────────────────────────
-- Products Table (Updated with full parameters)
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  tagline text not null default '',
  description text,
  short_description text,
  price numeric(10, 2) not null,
  compare_at numeric(10, 2),
  stock integer not null default 15,
  currency text not null default 'USD',
  image text not null default '/placeholder.svg',
  images text[] default array[]::text[],
  category text not null default 'Serums',
  category_id uuid references public.categories(id) on delete set null,
  badge text,
  featured boolean not null default false,
  bestseller boolean not null default false,
  ingredients text,
  benefits text,
  how_to_use text,
  skin_type text default 'All skin types',
  size text default '50ml',
  rating numeric(2, 1) not null default 4.8,
  reviews integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

drop policy if exists "Authenticated admins can manage products" on public.products;
create policy "Authenticated admins can manage products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Customers Table
-- ─────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null unique,
  address text,
  city text,
  country text,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;

drop policy if exists "Anyone can insert customers" on public.customers;
create policy "Anyone can insert customers"
  on public.customers for insert
  with check (true);

drop policy if exists "Admins can read customers" on public.customers;
create policy "Admins can read customers"
  on public.customers for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can update customers" on public.customers;
create policy "Admins can update customers"
  on public.customers for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Orders Table
-- ─────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  email text,
  phone text not null,
  address text not null,
  city text,
  country text,
  notes text,
  subtotal numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Anyone can create an order" on public.orders;
create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Order Items Table
-- ─────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric(10, 2) not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items"
  on public.order_items for insert
  with check (true);

drop policy if exists "Admins can read order items" on public.order_items;
create policy "Admins can read order items"
  on public.order_items for select
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Videos Table (For editorial control over videos)
-- ─────────────────────────────────────────────
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  video_url text not null,
  poster_url text,
  placement text not null check (placement in ('hero', 'editorial_1', 'editorial_2')),
  display_order integer not null default 0,
  is_active boolean not null default true,
  cta_text text,
  cta_link text,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;

drop policy if exists "Public can read videos" on public.videos;
create policy "Public can read videos"
  on public.videos for select
  using (true);

drop policy if exists "Admins can manage videos" on public.videos;
create policy "Admins can manage videos"
  on public.videos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed starter videos references
insert into public.videos (title, description, video_url, poster_url, placement, display_order, is_active, cta_text, cta_link)
values
  ('Skin that glows, rituals that last.', 'Luméa Essentials blends high-performance actives with soothing botanicals for a luminous, healthy complexion — thoughtfully formulated, beautifully simple.', '/hero-loop.mp4', '/hero-loop-poster.png', 'hero', 0, true, 'Shop Best Sellers', '#shop'),
  ('The Hydration Ritual', 'A lightweight, ceramide-rich daily cream that locks in moisture for a full 72 hours, repairing your skin barrier while restoring organic botanical suppleness.', '/banner-loop.mp4', '/banner-loop-poster.png', 'editorial_1', 0, true, 'Shop Hydra Veil', '#shop'),
  ('Botanical Alchemy & Science', 'Every droplet of Luméa is cold-pressed and dermatologically tested, ensuring active bio-nutrients are delivered in their purest state directly to your skin.', '/storytelling-loop.mp4', '', 'editorial_2', 0, true, 'Our Clean Science', '#ritual')
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Seed starter products (safe to re-run, with full details)
-- ─────────────────────────────────────────────
insert into public.products (name, slug, tagline, description, short_description, price, compare_at, stock, image, category, badge, rating, reviews, ingredients, benefits, how_to_use, skin_type, size, featured, bestseller)
values
  (
    'Radiance Renewal Serum',
    'radiance-renewal-serum',
    'Vitamin C + Botanical Ferment',
    'A brightening daily serum that fades dullness and evens tone with a stabilized vitamin C complex and botanical ferment extracts.',
    'Brightens, evens tone, and revitalizes tired skin with active Vitamin C and wild rose ferment.',
    84.00,
    98.00,
    25,
    '/products/radiance-serum.png',
    'Serums',
    'Best Seller',
    4.9,
    1284,
    'Aqua, 15% Vitamin C Complex (3-O-Ethyl Ascorbic Acid), Lactobacillus Ferment, Wild Rose Extract, Hyaluronic Acid, Ferulic Acid, Green Tea Extract, Glycerin, Propanediol.',
    '• Fades dark spots and discoloration\n• Brightens dull, tired-looking complexions\n• Stimulates natural collagen synthesis\n• Powerful antioxidant protection',
    'Apply 3-4 drops onto clean, damp face and neck in the morning. Pat gently until absorbed. Follow with moisturizer and sun protection.',
    'All skin types, especially dull or uneven skin.',
    '30ml',
    true,
    true
  ),
  (
    'Hydra Veil Moisturizer',
    'hydra-veil-moisturizer',
    '72-Hour Ceramide Hydration',
    'A lightweight, ceramide-rich cream that locks in moisture for a full 72 hours without ever feeling heavy or greasy.',
    'Deeply hydrates and restores skin barrier with essential ceramides and absolute rosewater.',
    68.00,
    null,
    40,
    '/products/hydra-cream.png',
    'Moisturizers',
    'New',
    4.8,
    942,
    'Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Rose Centifolia Flower Water, Squalane, Shea Butter, Sodium Hyaluronate, Centella Asiatica Extract, Tocopherol.',
    '• 72-hour continuous locking hydration\n• Strengthens compromised skin barriers\n• Calms irritation and redness instantly\n• Leaves a velvet, dewy finish',
    'Smooth over clean face and neck morning and night after serums. Massage upward in gentle circular motions until fully absorbed.',
    'Dry, sensitive, and normal skin types.',
    '50ml',
    true,
    true
  ),
  (
    'Cloud Milk Cleanser',
    'cloud-milk-cleanser',
    'pH-Balanced Gentle Cleanse',
    'A creamy, pH-balanced cleanser that lifts away makeup and impurities while fully respecting the skin barrier.',
    'Lifts makeup and purifies pores gently with oat lipids and soothing chamomile.',
    42.00,
    null,
    55,
    '/products/gentle-cleanser.png',
    'Cleansers',
    null,
    4.7,
    613,
    'Aqua, Oat Kernel Extract, Chamomile Flower Water, Aloe Vera Juice, Coco-Glucoside, Decyl Glucoside, Glycerin, Sweet Almond Oil, Panthenol, Xanthan Gum.',
    '• Dissolves makeup, sunscreen, and daily pollutants\n• pH-balanced (5.5) to keep skin comfortable\n• Non-stripping, hydrating cream texture\n• Soothes and reduces redness',
    'Massage 2-3 pumps onto dry or damp skin. Rinse thoroughly with lukewarm water, or sweep off with a damp cloth. Suitable morning and night.',
    'All skin types, including highly reactive and sensitive skin.',
    '150ml',
    false,
    false
  ),
  (
    'Midnight Restore Oil',
    'midnight-restore-oil',
    'Bakuchiol + Squalane',
    'A nourishing overnight oil blending bakuchiol and squalane to renew and resurface skin while you sleep.',
    'Overnight botanical lipid oil that resurfaces, smooths, and plumps fine lines.',
    92.00,
    110.00,
    18,
    '/products/night-oil.png',
    'Treatments',
    'Limited',
    5.0,
    458,
    'Squalane, Bakuchiol (1%), Evening Primrose Oil, Rosehip Seed Oil, Jojoba Seed Oil, Coenzyme Q10, Neroli Essential Oil, Tocopheryl Acetate.',
    '• Gentle natural alternative to retinol (non-irritating)\n• Fades fine lines and improves elasticity overnight\n• Restores deep cellular lipids\n• Imparts a radiant morning glow',
    'Warm 2-3 drops between palms and gently press onto clean skin as the final step of your evening ritual. Can be used alone or mixed into moisturizer.',
    'Dry, mature, and combination skin.',
    '30ml',
    true,
    true
  ),
  (
    'Morning Dew Essence Mist',
    'morning-dew-essence-mist',
    'Rosewater + Hyaluronic',
    'A featherlight hydrating mist with rosewater and hyaluronic acid for an instant, dewy refresh any time of day.',
    'Instant hydrating botanical mist with active hyaluronic molecules.',
    38.00,
    null,
    30,
    '/products/dew-mist.png',
    'Essences',
    null,
    4.6,
    377,
    'Rosa Damascena Flower Water, Sodium Hyaluronate, Glycerin, Witch Hazel Extract, Cucumber Extract, Aloe Barbadensis Leaf Juice, Allantoin, Phenoxyethanol.',
    '• Instant cooling and moisture boost\n• Preps skin for serums and creams\n• Sets makeup with a natural dewy glow\n• Soothes skin under stress or environmental dry air',
    'Mist generously over face and neck before applying serums, or spray throughout the day whenever skin feels tight or dry.',
    'All skin types, great for mid-day hydration.',
    '100ml',
    false,
    false
  ),
  (
    'Lumière Eye Elixir',
    'lumiere-eye-elixir',
    'Peptide Depuffing Complex',
    'A cooling peptide eye treatment that visibly depuffs and smooths fine lines around the delicate eye area.',
    'Advanced peptide and caffeine complex to depuff, smooth, and brighten dark circles.',
    58.00,
    72.00,
    22,
    '/products/eye-elixir.png',
    'Treatments',
    'Best Seller',
    4.8,
    821,
    'Aqua, Acetyl Tetrapeptide-5, Caffeine, Green Tea Extract, Squalane, Niacinamide, Avocado Oil, Shea Butter, Sodium Hyaluronate, Panthenol.',
    '• Visibly reduces under-eye puffiness and bags\n• Minimizes the appearance of dark circles\n• Plumps and smooths fine lines ("crow''s feet")\n• Cooling texture refreshes tired eyes',
    'Gently tap a tiny amount around the entire orbital bone using your ring finger. Use morning and night. Avoid direct contact with eyes.',
    'All skin types.',
    '15ml',
    false,
    true
  )
on conflict (slug) do nothing;

-- Connect product category relationships
update public.products p
set category_id = c.id
from public.categories c
where p.category = c.name;

-- ─────────────────────────────────────────────
-- Storage: media bucket for product images & videos
-- Public read (storefront needs to display assets), admin-only write.
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Authenticated admins can upload media" on storage.objects;
create policy "Authenticated admins can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can update media" on storage.objects;
create policy "Authenticated admins can update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can delete media" on storage.objects;
create policy "Authenticated admins can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
