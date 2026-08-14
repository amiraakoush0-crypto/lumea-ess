"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Mail, Phone, MapPin, Calendar, Clock, ShoppingBag, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export type CustomerOrder = {
  id: string
  total: number
  status: string
  created_at: string
}

export type CustomerRecord = {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  city: string | null
  country: string | null
  created_at: string
  order_count: number
  total_spent: number
  orders: CustomerOrder[]
}

export function CustomersManager({ customers }: { customers: CustomerRecord[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null)

  // Filter customers by search input
  const filteredCustomers = customers.filter((cust) => {
    const term = searchQuery.toLowerCase()
    return (
      cust.name.toLowerCase().includes(term) ||
      (cust.email && cust.email.toLowerCase().includes(term)) ||
      cust.phone.includes(term)
    )
  })

  return (
    <div>
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted">{customers.length} registered customers in database.</p>
      </div>

      {/* Search Filter */}
      <div className="mt-6 flex max-w-md items-center gap-2 rounded-full glass px-4 py-2.5">
        <Search className="h-4 w-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-ivory/70">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium text-center">Orders</th>
              <th className="px-5 py-3 font-medium text-right">Total Spent</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="border-b border-border last:border-0 hover:bg-sage-soft/10">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-foreground">{cust.name}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(cust.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs space-y-0.5 text-foreground/80">
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted shrink-0" />
                    {cust.email || "No email"}
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted shrink-0" />
                    {cust.phone}
                  </p>
                </td>
                <td className="px-5 py-3 text-xs text-foreground/80">
                  {cust.address ? (
                    <div>
                      <p className="max-w-[200px] truncate">{cust.address}</p>
                      <p className="text-muted">{cust.city}, {cust.country}</p>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3 text-center font-mono font-medium text-foreground">
                  {cust.order_count}
                </td>
                <td className="px-5 py-3 text-right font-mono font-semibold text-sage-dark">
                  {formatPrice(cust.total_spent)}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="rounded-full bg-sage-soft px-3 py-1.5 text-xs font-semibold text-sage-dark transition-all duration-200 hover:scale-105 hover:bg-sage hover:text-ivory active:scale-95"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  {searchQuery ? "No matching customers found." : "No registered customers yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Drawer / Modal Overlay */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-foreground/25 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 -z-10"
            />
            
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="h-full w-full max-w-md bg-ivory shadow-2xl p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground truncate">{selectedCustomer.name}</h2>
                  <p className="text-xs text-muted">Customer details & history</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-full p-1.5 hover:bg-sage-soft transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="mt-6 flex-1 overflow-y-auto space-y-6 thin-scroll pr-1">
                {/* Profile Summary Card */}
                <div className="rounded-2xl bg-cream border border-border p-4 space-y-3">
                  <h3 className="font-serif text-sm font-semibold text-foreground">Contact Profile</h3>
                  <div className="text-xs space-y-2 text-foreground/80">
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted" />
                      {selectedCustomer.email || "No email provided"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted" />
                      {selectedCustomer.phone}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted mt-0.5" />
                      <span>
                        {selectedCustomer.address || "No address provided"}<br />
                        {selectedCustomer.city && `${selectedCustomer.city}, `}{selectedCustomer.country}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted" />
                      Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Orders aggregate */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border p-4 bg-ivory">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Orders</span>
                    <p className="mt-1 font-serif text-2xl font-bold text-foreground">{selectedCustomer.order_count}</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-ivory">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Spent</span>
                    <p className="mt-1 font-serif text-2xl font-bold text-sage-dark">{formatPrice(selectedCustomer.total_spent)}</p>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  <h3 className="font-serif text-sm font-semibold text-foreground">Order History</h3>
                  {selectedCustomer.orders.length === 0 ? (
                    <p className="text-xs text-muted">No orders found for this customer.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {selectedCustomer.orders.map((order) => (
                        <li key={order.id} className="rounded-xl border border-border bg-ivory p-3.5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-semibold text-foreground flex items-center gap-1">
                              <ShoppingBag className="h-3.5 w-3.5 text-sage-dark shrink-0" />
                              Order ID: {order.id.slice(0, 8)}...
                            </p>
                            <p className="text-muted flex items-center gap-1 mt-1 font-mono">
                              <Clock className="h-3.5 w-3.5 text-muted" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-foreground font-mono">{formatPrice(order.total)}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              order.status === "delivered" 
                                ? "bg-emerald-50 text-emerald-700" 
                                : order.status === "cancelled" 
                                  ? "bg-red-50 text-red-700" 
                                  : "bg-amber-50 text-amber-700"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-border/60 pt-4 mt-auto">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full rounded-full border border-border py-3 text-sm font-semibold text-foreground hover:bg-sage-soft transition-colors"
                >
                  Close panel
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
