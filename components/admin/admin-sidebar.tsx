"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ClipboardList, LogOut, Leaf, ExternalLink, Film, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions/auth"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/videos", label: "Videos", icon: Film },
  { href: "/admin/customers", label: "Customers", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-border bg-ivory/70 p-5 md:w-64">
      <div>
        <div className="flex items-center gap-2 px-2 py-2">
          <Leaf className="h-5 w-5 text-sage-dark" />
          <span className="font-serif text-xl font-semibold text-foreground">Luméa Admin</span>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sage-dark text-ivory"
                    : "text-foreground/75 hover:bg-sage-soft hover:text-sage-dark",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-sage-soft hover:text-sage-dark"
        >
          <ExternalLink className="h-4 w-4" />
          View store
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-sage-soft hover:text-sage-dark"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
