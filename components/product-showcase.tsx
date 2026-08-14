"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import type { Product } from "@/lib/products"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

export function ProductShowcase({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All")

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)))
    return ["All", ...unique]
  }, [products])

  const filtered = active === "All" ? products : products.filter((p) => p.category === active)

  return (
    <section id="shop" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-dark"
        >
          The Collection
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 text-balance font-serif text-4xl font-semibold text-foreground md:text-5xl"
        >
          Shop best sellers
        </motion.h2>
      </div>

      {/* Filters */}
      <div className="mt-9 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]",
              active === cat
                ? "bg-sage-dark text-ivory shadow-md shadow-sage-dark/20"
                : "border border-border bg-ivory/60 text-foreground/75 hover:border-sage-dark hover:text-sage-dark",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm text-muted">No products in this category yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
