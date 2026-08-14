import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata = {
  title: "Admin — Luméa Essentials",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-1 overflow-x-hidden p-5 md:p-10">{children}</div>
      </div>
    </div>
  )
}
