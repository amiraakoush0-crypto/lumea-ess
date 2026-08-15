"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Star } from "lucide-react"
import type { Product } from "@/lib/products"
import { formatPrice, cn } from "@/lib/utils"
import { useCart } from "./cart-context"
import { ProductImage } from "./product-image"

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-gold text-ivory",
  New: "bg-sage-dark text-ivory",
  Limited: "bg-foreground text-ivory",
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()

  return (
    <motion.article
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border bg-cream shadow-sm transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-2xl group-hover:shadow-sage-dark/15"
      >
        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide",
              badgeStyles[product.badge] ?? "bg-foreground text-ivory",
            )}
          >
            {product.badge}
          </span>
        )}

        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
          imgClassName="p-6 transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                tagline: product.tagline,
              })
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full glass-strong py-3 text-sm font-semibold text-foreground shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-sage-dark hover:text-ivory active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            Quick add
          </button>
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col px-1">
        {/* A product with no reviews yet shows just its category — a rating
            beside "(0)" reads as a real score nobody has actually given. */}
        <div className="flex items-center gap-1 text-xs text-muted">
          {product.reviews > 0 && (
            <>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{product.rating}</span>
              <span>({product.reviews.toLocaleString()})</span>
            </>
          )}
          <span className="ml-auto text-sage-dark">{product.category}</span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-foreground transition-colors hover:text-sage-dark">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-sm text-muted">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted line-through">{formatPrice(product.compareAt)}</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
