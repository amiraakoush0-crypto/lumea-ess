export type Product = {
  id: string
  name: string
  tagline: string
  description?: string | null
  price: number
  compareAt?: number | null
  image: string
  category: string
  badge?: string | null
  rating: number
  reviews: number
  stock?: number
  ingredients?: string | null
  benefits?: string | null
  how_to_use?: string | null
  skin_type?: string | null
  size?: string | null
  featured?: boolean
  bestseller?: boolean
  images?: string[]
}

export type Bundle = {
  id: string
  name: string
  description: string
  price: number
  compareAt: number
  image: string
  saves: number
}

/**
 * Demo/fallback catalog. Used only when Supabase env vars are missing so the
 * storefront still renders during first-time setup. Once Supabase is
 * connected, real products come from the `products` table (see lib/data.ts)
 * and are managed from /admin/products.
 */
export const demoProducts: Product[] = [
  {
    id: "radiance-serum",
    name: "Radiance Renewal Serum",
    tagline: "Vitamin C + Botanical Ferment",
    price: 84,
    compareAt: 98,
    image: "/products/radiance-serum.png",
    category: "Serums",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 1284,
  },
  {
    id: "hydra-cream",
    name: "Hydra Veil Moisturizer",
    tagline: "72-Hour Ceramide Hydration",
    price: 68,
    image: "/products/hydra-cream.png",
    category: "Moisturizers",
    badge: "New",
    rating: 4.8,
    reviews: 942,
  },
  {
    id: "gentle-cleanser",
    name: "Cloud Milk Cleanser",
    tagline: "pH-Balanced Gentle Cleanse",
    price: 42,
    image: "/products/gentle-cleanser.png",
    category: "Cleansers",
    rating: 4.7,
    reviews: 613,
  },
  {
    id: "night-oil",
    name: "Midnight Restore Oil",
    tagline: "Bakuchiol + Squalane",
    price: 92,
    compareAt: 110,
    image: "/products/night-oil.png",
    category: "Treatments",
    badge: "Limited",
    rating: 5.0,
    reviews: 458,
  },
  {
    id: "dew-mist",
    name: "Morning Dew Essence Mist",
    tagline: "Rosewater + Hyaluronic",
    price: 38,
    image: "/products/dew-mist.png",
    category: "Essences",
    rating: 4.6,
    reviews: 377,
  },
  {
    id: "eye-elixir",
    name: "Lumière Eye Elixir",
    tagline: "Peptide Depuffing Complex",
    price: 58,
    compareAt: 72,
    image: "/products/eye-elixir.png",
    category: "Treatments",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 821,
  },
]

export const demoBundle: Bundle = {
  id: "ritual-set",
  name: "The Complete Glow Ritual",
  description: "Serum, moisturizer & night oil — the full 3-step luminous routine.",
  price: 199,
  compareAt: 244,
  image: "/bundle-ritual.png",
  saves: 45,
}

export const categories = ["All", "Serums", "Moisturizers", "Treatments", "Cleansers", "Essences"]
