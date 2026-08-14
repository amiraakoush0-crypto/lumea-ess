import { DollarSign, Package, ClipboardList, Clock } from "lucide-react"
import { getDashboardStats } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const configured = isSupabaseConfigured()

  const cards = [
    { label: "Total revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign },
    { label: "Total orders", value: stats.totalOrders.toLocaleString(), icon: ClipboardList },
    { label: "Products", value: stats.totalProducts.toLocaleString(), icon: Package },
    { label: "Pending orders", value: stats.pendingOrders.toLocaleString(), icon: Clock },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">A quick overview of your store.</p>

      {!configured && (
        <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
          Supabase isn&apos;t connected yet, so these numbers are placeholders. Add your project keys to{" "}
          <code className="rounded bg-ivory px-1.5 py-0.5">.env.local</code> to see live data.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-ivory/80 p-5 shadow-sm shadow-sage-dark/5"
          >
            <div className="flex items-center gap-2 text-muted">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-ivory/60 p-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">Getting started</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
          <li>• Manage your catalog from the Products tab — add, edit, or remove items.</li>
          <li>• Track and update order status from the Orders tab.</li>
          <li>• Changes to products appear on the storefront immediately.</li>
        </ul>
      </div>
    </div>
  )
}
