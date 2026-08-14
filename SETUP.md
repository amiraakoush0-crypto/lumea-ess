# Luméa Essentials — Setup & Run Guide

This is a Next.js 15 (App Router) + Tailwind CSS v4 + Supabase e-commerce project.
Everything below works whether you're using **Antigravity, VS Code, Cursor, or a plain terminal** —
it's all standard Next.js, no special IDE setup required.

---

## 1. Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

(This project uses `npm`. If you prefer `pnpm` or `yarn`, delete `package-lock.json`
if present and use your tool of choice instead — no other changes needed.)

---

## 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine).
2. Once it's created, go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key
3. In this project, copy `.env.local.example` to a new file named `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

4. Paste your values into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

> The site and admin panel work in a limited "demo mode" without these keys (using
> placeholder products), but you need them connected for orders, product management,
> and the admin dashboard to actually save data.

---

## 3. Set up the database

1. In your Supabase project, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this project, copy the entire contents, paste it
   into the SQL editor, and click **Run**.

This creates:
- `products` table (with 6 starter products already seeded)
- `orders` and `order_items` tables
- Row-Level-Security policies so:
  - anyone can browse products and place an order
  - only a **signed-in admin** can add/edit/delete products or view/update orders

---

## 4. Create your admin login

1. In Supabase, go to **Authentication → Users → Add user**.
2. Create a user with your email + a password (this is what you'll use to log into `/admin`).
3. That's it — no extra roles or tables needed. Any confirmed Supabase Auth user can sign in to the admin panel.

---

## 5. Run the project

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

- Storefront: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin/login`

---

## 6. What to test

| Feature | Where |
|---|---|
| Browse products, filter by category | Homepage → "Shop best sellers" |
| Product detail page | Click any product card |
| Add to cart | "Quick add" on a card, or "Add to bag" on a product page |
| Cart drawer | Bag icon in the header |
| Direct checkout | Cart drawer → "Checkout" → fill form → "Place order" |
| WhatsApp ordering | Cart drawer or product page → "Order via WhatsApp" (opens WhatsApp with your order pre-filled, sent to **+961 71 183 481**) |
| Admin login | `/admin/login` with the Supabase user you created |
| Admin dashboard stats | `/admin` |
| Add/edit/delete products | `/admin/products` |
| View & update order status | `/admin/orders` — place a test order via checkout first, then find it here |

Every product you add/edit/delete in `/admin/products` appears on the storefront immediately.

---

## Notes on a few specific requests

- **Free shipping banners/text**: removed from the announcement bar and cart drawer.
- **WhatsApp number**: `+961 71 183 481` is hard-coded in `lib/whatsapp.ts` (`WHATSAPP_NUMBER`).
  Change it there if it's ever different.
- **Hero & banner videos**: included — `public/hero-loop.mp4` (serum droplet) plays in
  the hero, and `public/banner-loop.mp4` (applying cream) plays in the bundle/offer
  banner. Both autoplay muted and loop, with an extracted poster frame
  (`hero-loop-poster.png` / `banner-loop-poster.png`) shown instantly before the video
  loads. To swap either clip, just replace the `.mp4` file in `/public` (keep the same
  filename) or update the `src` in `components/hero.tsx` / `components/offers.tsx`.
- **Product images for new admin-added products**: you can paste any image URL
  (including ones hosted elsewhere) — `next.config.mjs` is configured to allow external
  image domains.

---

## Deploying

This project deploys cleanly to **Vercel** (a `vercel.json` is already included):

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the same two environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy.
