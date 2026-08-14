"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { CartItem } from "@/components/cart-context"

export type CheckoutState = { error?: string; success?: boolean; orderId?: string }

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export async function createOrder(
  items: CartItem[],
  customer: { 
    name: string 
    email: string 
    phone: string 
    address: string 
    city: string 
    country: string 
    notes?: string 
  },
): Promise<CheckoutState> {
  if (items.length === 0) return { error: "Your bag is empty." }
  if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.country) {
    return { error: "Please fill in your name, phone, address, city, and country." }
  }

  if (!isSupabaseConfigured()) {
    // Demo mode
    return { success: true, orderId: "demo" }
  }

  try {
    const supabase = await createClient()
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = 0.00 // Standard free shipping for luxury orders
    const total = subtotal + shipping

    // 1. Get or Create Customer Record (relational mapping)
    let customerId: string | null = null
    
    // Check if customer exists by phone (phone number is unique)
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", customer.phone)
      .maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
      // Proactively update their details in case they changed
      await supabase
        .from("customers")
        .update({
          name: customer.name,
          email: customer.email || null,
          address: customer.address,
          city: customer.city,
          country: customer.country
        })
        .eq("id", customerId)
    } else {
      // Create new customer record
      const { data: newCustomer, error: insertCustError } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          email: customer.email || null,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          country: customer.country
        })
        .select("id")
        .single()

      if (insertCustError || !newCustomer) {
        console.error("Error inserting customer:", insertCustError)
        // If it fails (e.g. duplicate email conflict), fall back to checking by email
        if (customer.email) {
          const { data: custByEmail } = await supabase
            .from("customers")
            .select("id")
            .eq("email", customer.email)
            .maybeSingle()
          if (custByEmail) customerId = custByEmail.id
        }
      } else {
        customerId = newCustomer.id
      }
    }

    // 2. Create the Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_name: customer.name,
        email: customer.email || null,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        notes: customer.notes || null,
        subtotal,
        shipping,
        total,
        status: "pending",
      })
      .select("id")
      .single()

    if (orderError || !order) {
      return { error: orderError?.message ?? "Could not create order. Please try again." }
    }

    // 3. Create the Relational Order Items
    // Map item.id (can be a UUID or a slug in fallback states)
    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => {
        // Validate if item.id is a uuid, if not set product_id to null and just save text name
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
        return {
          order_id: order.id,
          product_id: isUuid ? item.id : null,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
        }
      }),
    )

    if (itemsError) {
      console.error("Order Items Insertion Error:", itemsError)
      return { error: itemsError.message }
    }

    // 4. Atomically decrement product stock via a SECURITY DEFINER RPC (see
    // supabase/schema.sql). A single row-locked UPDATE per product means
    // concurrent orders can't both read the same stock value and oversell
    // the last unit — and it works under RLS for anonymous checkout, unlike
    // a direct update against the products table.
    const uuidItems = items.filter((item) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id),
    )
    if (uuidItems.length > 0) {
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        items: uuidItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      })
      if (stockError) console.error("Stock decrement error:", stockError)
    }

    revalidatePath("/admin/orders")
    revalidatePath("/admin/customers")
    revalidatePath("/admin")
    revalidatePath("/")
    
    return { success: true, orderId: order.id }

  } catch (err: any) {
    console.error("Create Order Server Action Exception:", err)
    return { error: err?.message ?? "An unexpected error occurred while placing your order." }
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/orders")
  revalidatePath("/admin")
}
