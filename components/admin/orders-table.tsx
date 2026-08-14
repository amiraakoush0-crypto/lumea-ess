"use client"

import { useState, useTransition } from "react"
import { formatPrice } from "@/lib/utils"
import { updateOrderStatus, type OrderStatus } from "@/lib/actions/orders"

export type AdminOrder = {
  id: string
  customer_name: string
  phone: string
  address: string
  notes: string | null
  subtotal: number
  status: OrderStatus
  created_at: string
  items: { product_name: string; quantity: number; price: number }[]
}

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-gold/20 text-gold-dark",
  confirmed: "bg-sage-soft text-sage-dark",
  shipped: "bg-sage/20 text-sage-dark",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
}

const statuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-ivory/70">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">Items</th>
            <th className="px-5 py-3 font-medium">Total</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              expanded={expanded === order.id}
              onToggle={() => setExpanded((prev) => (prev === order.id ? null : order.id))}
            />
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-muted">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function OrderRow({
  order,
  expanded,
  onToggle,
}: {
  order: AdminOrder
  expanded: boolean
  onToggle: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(order.status)

  return (
    <>
      <tr className="cursor-pointer border-b border-border last:border-0 hover:bg-sage-soft/20" onClick={onToggle}>
        <td className="px-5 py-3">
          <p className="font-medium text-foreground">{order.customer_name}</p>
          <p className="text-xs text-muted">{order.phone}</p>
        </td>
        <td className="px-5 py-3 text-foreground/80">{order.items.length} item(s)</td>
        <td className="px-5 py-3 font-medium text-foreground">{formatPrice(order.subtotal)}</td>
        <td className="px-5 py-3 text-foreground/80">
          {new Date(order.created_at).toLocaleDateString()}
        </td>
        <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={status}
            disabled={isPending}
            onChange={(e) => {
              const next = e.target.value as OrderStatus
              setStatus(next)
              startTransition(() => updateOrderStatus(order.id, next))
            }}
            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-sage ${statusStyles[status]}`}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-cream/60 last:border-0">
          <td colSpan={5} className="px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Delivery address</p>
            <p className="mt-1 text-sm text-foreground">{order.address}</p>
            {order.notes && (
              <>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Notes</p>
                <p className="mt-1 text-sm text-foreground">{order.notes}</p>
              </>
            )}
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">Items</p>
            <ul className="mt-1 flex flex-col gap-1">
              {order.items.map((item, i) => (
                <li key={i} className="text-sm text-foreground/85">
                  {item.product_name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  )
}
