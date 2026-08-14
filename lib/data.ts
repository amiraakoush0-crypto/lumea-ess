import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { demoProducts, type Product } from "@/lib/products"

type ProductRow = {
  id: string
  name: string
  tagline: string
  description: string | null
  price: number
  compare_at: number | null
  image: string
  category: string
  badge: string | null
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
  images?: string[] | null
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: Number(row.price),
    compareAt: row.compare_at ? Number(row.compare_at) : null,
    image: row.image,
    category: row.category,
    badge: row.badge,
    rating: Number(row.rating ?? 4.8),
    reviews: row.reviews ?? 0,
    stock: row.stock ?? 15,
    ingredients: row.ingredients ?? "",
    benefits: row.benefits ?? "",
    how_to_use: row.how_to_use ?? "",
    skin_type: row.skin_type ?? "All skin types",
    size: row.size ?? "50ml",
    featured: row.featured ?? false,
    bestseller: row.bestseller ?? false,
    images: row.images ?? [],
  }
}

/**
 * All products for the storefront grid.
 * Demo data is ONLY used when Supabase itself isn't configured (first-time setup).
 * Once Supabase is connected, an empty or errored query returns an empty array so the
 * storefront shows a real "no products yet" empty state instead of fake products.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return demoProducts

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("getProducts error:", error.message)
    return []
  }
  return (data ?? []).map(mapProduct)
}

/** A single product by id, for the product detail page. */
export async function getProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return demoProducts.find((p) => p.id === id) ?? null
  }

  const supabase = await createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("getProduct error:", error.message)
    return null
  }
  return data ? mapProduct(data) : null
}

/** Aggregate rating/review count across all real products, for storefront trust badges. Returns null in demo mode or with no data. */
export async function getRatingSummary(): Promise<{ average: number; totalReviews: number } | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data, error } = await supabase.from("products").select("rating, reviews")

  if (error || !data || data.length === 0) return null

  const totalReviews = data.reduce((sum, p) => sum + (p.reviews ?? 0), 0)
  if (totalReviews === 0) return null

  const weightedSum = data.reduce((sum, p) => sum + Number(p.rating ?? 0) * (p.reviews ?? 0), 0)
  const average = weightedSum / totalReviews

  return { average: Math.round(average * 10) / 10, totalReviews }
}

export type VideoPlacement = "hero" | "editorial_1" | "editorial_2"

export type EditorialVideo = {
  id: string
  title: string
  description: string
  video_url: string
  poster_url: string | null
  cta_text: string | null
  cta_link: string | null
}

/** Active video for a given placement, ordered by display_order. Falls back to null (component uses its own defaults) when unconfigured, empty, or errored. */
export async function getVideoByPlacement(placement: VideoPlacement): Promise<EditorialVideo | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("videos")
    .select("id, title, description, video_url, poster_url, cta_text, cta_link")
    .eq("placement", placement)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return data
}

/** Dashboard stats for the admin overview page. */
export async function getDashboardStats() {
  if (!isSupabaseConfigured()) {
    return { totalRevenue: 0, totalOrders: 0, totalProducts: demoProducts.length, pendingOrders: 0 }
  }

  const supabase = await createClient()

  const [{ count: totalProducts }, { data: orders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("subtotal, status"),
  ])

  const totalOrders = orders?.length ?? 0
  const totalRevenue = (orders ?? []).reduce((sum, o) => sum + Number(o.subtotal ?? 0), 0)
  const pendingOrders = (orders ?? []).filter((o) => o.status === "pending").length

  return { totalRevenue, totalOrders, totalProducts: totalProducts ?? 0, pendingOrders }
}
