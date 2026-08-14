import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { CustomersManager, type CustomerRecord } from "@/components/admin/customers-manager"

async function getCustomers(): Promise<CustomerRecord[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !customers) return []

  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_id, total, status, created_at")
    .order("created_at", { ascending: false })

  return customers.map((cust) => {
    const custOrders = (orders ?? []).filter((o) => o.customer_id === cust.id)
    return {
      id: cust.id,
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      address: cust.address,
      city: cust.city,
      country: cust.country,
      created_at: cust.created_at,
      order_count: custOrders.length,
      total_spent: custOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0),
      orders: custOrders.map((o) => ({
        id: o.id,
        total: Number(o.total ?? 0),
        status: o.status,
        created_at: o.created_at,
      })),
    }
  })
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()
  const configured = isSupabaseConfigured()

  return (
    <div>
      {!configured && (
        <div className="mb-6 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
          Supabase isn&apos;t connected yet, so customer records placed through checkout
          aren&apos;t available here.
        </div>
      )}

      <CustomersManager customers={customers} />
    </div>
  )
}
