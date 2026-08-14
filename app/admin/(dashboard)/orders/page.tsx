import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { OrdersTable, type AdminOrder } from "@/components/admin/orders-table"

async function getOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !orders) return []

  const { data: items } = await supabase
    .from("order_items")
    .select("order_id, product_name, quantity, price")

  return orders.map((order) => ({
    id: order.id,
    customer_name: order.customer_name,
    phone: order.phone,
    address: order.address,
    notes: order.notes,
    subtotal: Number(order.subtotal),
    status: order.status,
    created_at: order.created_at,
    items: (items ?? [])
      .filter((i) => i.order_id === order.id)
      .map((i) => ({ product_name: i.product_name, quantity: i.quantity, price: Number(i.price) })),
  }))
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  const configured = isSupabaseConfigured()

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-muted">Track and update order status. Click a row for details.</p>

      {!configured && (
        <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
          Supabase isn&apos;t connected yet, so orders placed through checkout aren&apos;t being saved.
        </div>
      )}

      <OrdersTable orders={orders} />
    </div>
  )
}
