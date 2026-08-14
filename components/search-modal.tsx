"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { demoProducts, type Product } from "@/lib/products"
import { formatPrice } from "@/lib/utils"

export interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Load all products client-side for fast searching
  useEffect(() => {
    if (!isOpen) return

    async function loadProducts() {
      setLoading(true)

      // Demo data is only used when Supabase itself isn't configured (first-time setup).
      // Once connected, an empty catalog just returns no search results — never fake ones.
      if (!isSupabaseConfigured()) {
        setProducts(demoProducts)
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true })

        if (error) {
          console.error("Failed to load products for search:", error.message)
          setProducts([])
        } else {
          setProducts(
            (data ?? []).map((row) => ({
              id: row.id,
              name: row.name,
              tagline: row.tagline,
              description: row.description,
              price: Number(row.price),
              compareAt: row.compare_at ? Number(row.compare_at) : null,
              image: row.image,
              category: row.category,
              badge: row.badge,
              rating: Number(row.rating ?? 4.8),
              reviews: row.reviews ?? 0,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to load products for search:", err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [isOpen])

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Real-time filtering
  const results = query.trim() === "" 
    ? [] 
    : products.filter((p) => {
        const text = `${p.name} ${p.category} ${p.tagline} ${p.description ?? ""}`.toLowerCase()
        return text.includes(query.toLowerCase())
      })

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-foreground/25 p-4 pt-16 backdrop-blur-sm md:pt-28">
          
          {/* Backdrop Click Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 -z-10"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border bg-ivory shadow-2xl"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 border-b border-border px-6 py-5">
              <Search className="h-5 w-5 text-muted shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search serums, moisturizers, ingredients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
              />
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted shrink-0" />}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-sage-soft transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Section */}
            <div className="max-h-[360px] overflow-y-auto px-6 py-4 thin-scroll">
              {query.trim() === "" ? (
                <div className="py-6 text-center text-sm text-muted">
                  Type a product name, category, or skin benefit to begin searching...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-medium text-foreground">No matches found</p>
                  <p className="mt-1 text-xs text-muted">Try checking the spelling or searching for a broader term.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Found {results.length} results
                  </span>
                  
                  <ul className="divide-y divide-border/60">
                    {results.map((p) => (
                      <li key={p.id} className="first:pt-0 pt-3 pb-3">
                        <Link 
                          href={`/product/${p.id}`} 
                          onClick={onClose}
                          className="flex gap-4 group rounded-xl p-2 transition-colors hover:bg-sage-soft/30"
                        >
                          <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-cream">
                            <Image
                              src={p.image || "/placeholder.svg"}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-serif text-sm font-semibold text-foreground truncate group-hover:text-sage-dark transition-colors">
                                {p.name}
                              </h4>
                              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                                {formatPrice(p.price)}
                              </span>
                            </div>
                            <p className="text-xs text-muted truncate">{p.tagline}</p>
                            <span className="mt-1.5 inline-block text-[9px] font-semibold uppercase tracking-wider text-sage-dark bg-sage-soft px-2 py-0.5 rounded-full">
                              {p.category}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  )
}
