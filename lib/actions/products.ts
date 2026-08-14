"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ProductFormState = { error?: string; success?: boolean }

function parseProductForm(formData: FormData) {
  const compareAtRaw = String(formData.get("compareAt") ?? "").trim()
  return {
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    price: Number(formData.get("price")),
    compare_at: compareAtRaw ? Number(compareAtRaw) : null,
    image: String(formData.get("image") ?? "").trim() || "/placeholder.svg",
    category: String(formData.get("category") ?? "").trim(),
    badge: String(formData.get("badge") ?? "").trim() || null,
  }
}

export async function createProduct(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = await createClient()
  const product = parseProductForm(formData)

  if (!product.name || !product.category || Number.isNaN(product.price)) {
    return { error: "Please fill in at least name, category, and a valid price." }
  }

  const { error } = await supabase.from("products").insert(product)
  if (error) return { error: error.message }

  revalidatePath("/admin/products")
  revalidatePath("/")
  return { success: true }
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient()
  const product = parseProductForm(formData)

  if (!product.name || !product.category || Number.isNaN(product.price)) {
    return { error: "Please fill in at least name, category, and a valid price." }
  }

  const { error } = await supabase.from("products").update(product).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/products")
  revalidatePath("/")
  revalidatePath(`/product/${id}`)
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
  revalidatePath("/")
}
