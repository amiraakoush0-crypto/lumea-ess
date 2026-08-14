"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "./cart-context"
import { cn } from "@/lib/utils"
import { SearchModal } from "./search-modal"

const nav = [
  { label: "Shop All", href: "#shop" },
  { label: "Best Sellers", href: "#shop" },
  { label: "Our Story", href: "#story" },
]

export function SiteHeader() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled ? "glass-strong shadow-[0_8px_30px_rgba(123,40,43,0.10)]" : "bg-gradient-to-b from-ivory/80 via-ivory/40 to-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-105 hover:bg-sage-soft active:scale-90 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Left nav (desktop) */}
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-sm font-medium text-foreground/80 transition-colors hover:text-sage-dark"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Logo */}
          <a
            href="#top"
            className="absolute left-1/2 -translate-x-1/2 text-center"
            aria-label="Luméa Essentials home"
          >
            <span className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Luméa
            </span>
            <span className="ml-1 hidden text-[0.65rem] font-medium uppercase tracking-[0.35em] text-sage-dark sm:inline">
              Essentials
            </span>
          </a>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="#book"
              className="hidden rounded-full bg-sage-dark px-4 py-2 text-xs font-semibold text-ivory transition-all duration-300 hover:scale-[1.04] hover:bg-gold-dark hover:shadow-lg active:scale-[0.97] sm:block"
            >
              Book Appointment
            </a>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-105 hover:bg-sage-soft active:scale-90"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-105 hover:bg-sage-soft active:scale-90"
              aria-label={`Open bag, ${count} items`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.65rem] font-bold text-ivory"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Search bar modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium text-foreground/85 last:border-0"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#book"
                onClick={() => setMenuOpen(false)}
                className="mt-4 rounded-full bg-sage-dark py-2.5 text-center text-xs font-semibold text-ivory transition-all duration-300 hover:scale-[1.02] hover:bg-gold-dark active:scale-[0.98]"
              >
                Book Appointment
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
