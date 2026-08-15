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
    id: "jelly-gloss",
    name: "Luméa Jelly Gloss",
    tagline: "High-Shine Jelly Lip Gloss",
    price: 12,
    image: "/products/jelly-gloss.jpg",
    category: "Lips",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "glowy-lips",
    name: "Luméa Glowy Lips Duo",
    tagline: "Tinted Care with Hyaluronic Acid",
    price: 9,
    compareAt: 11,
    image: "/products/glowy-lips.jpg",
    category: "Lips",
    badge: "New",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "labello-blackberry",
    name: "Labello Blackberry Shine",
    tagline: "24H Tinted Lip Balm",
    price: 5,
    image: "/products/labello-blackberry.jpg",
    category: "Lips",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "super-peptide",
    name: "essence Super Peptide Lip Treatment",
    tagline: "Glossy Peptide Lip Care",
    price: 8,
    image: "/products/super-peptide.jpg",
    category: "Lips",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "vandini-hydro",
    name: "VANDINI Hydro Gift Set",
    tagline: "Magnolia & Almond Milk Trio",
    price: 28,
    compareAt: 34,
    image: "/products/vandini-hydro.jpg",
    category: "Body",
    badge: "Gift Set",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "mivolis-collagen",
    name: "Mivolis Beauty Collagen + Hyaluron",
    tagline: "20 Collagen Drinking Ampoules",
    price: 22,
    image: "/products/mivolis-collagen.jpg",
    category: "Wellness",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "hask-argan-oil",
    name: "HASK Argan Oil + Repair Hair Oil",
    tagline: "Repairing Argan Hair Oil",
    price: 9,
    image: "/products/hask-argan-oil.jpg",
    category: "Hair",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "pantene-serum",
    name: "Pantene Pro-V Serum Shots",
    tagline: "30-Second Repair Treatment",
    price: 14,
    image: "/products/pantene-serum.jpg",
    category: "Hair",
    badge: "New",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "dove-summer-revived",
    name: "Dove Body Love Summer Revived",
    tagline: "Gradual Tanning Lotion",
    price: 11,
    image: "/products/dove-summer-revived.jpg",
    category: "Body",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "dove-summer-glow",
    name: "Dove Body Love Summer Glow",
    tagline: "Sunless Tan Body Lotion",
    price: 12,
    image: "/products/dove-summer-glow.jpg",
    category: "Body",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "dove-bridgerton",
    name: "Dove Bridgerton Raspberry Rendezvous",
    tagline: "Limited Edition Body Wash",
    price: 10,
    image: "/products/dove-bridgerton.jpg",
    category: "Body",
    badge: "Limited",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "alverde-men",
    name: "alverde MEN Rough Nature 4in1",
    tagline: "4-in-1 Body, Face, Hair & Beard",
    price: 8,
    image: "/products/alverde-men.jpg",
    category: "Body",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "beach-bag-mat",
    name: "Easy Living Beach Bag & Mat",
    tagline: "Striped Tote with Roll-Up Mat",
    price: 26,
    compareAt: 32,
    image: "/products/beach-bag-mat.jpg",
    category: "Accessories",
    badge: "Gift Set",
    rating: 4.8,
    reviews: 0,
  },
  {
    id: "floral-bag-set",
    name: "Floral Everyday Bag Set",
    tagline: "Tote & Pouch, Two Pieces",
    price: 24,
    image: "/products/floral-bag-set.jpg",
    category: "Accessories",
    rating: 4.8,
    reviews: 0,
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

export const categories = ["All", "Lips", "Hair", "Body", "Wellness", "Accessories"]
