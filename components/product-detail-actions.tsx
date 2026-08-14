"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, ShoppingBag, CheckCircle, Info } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCart } from "./cart-context"
import { WhatsAppIcon } from "./whatsapp-icon"
import { buildWhatsAppOrderLink } from "@/lib/whatsapp"

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "use">("benefits")

  const whatsappLink = buildWhatsAppOrderLink(
    [{ name: product.name, quantity, price: product.price }],
    product.price * quantity,
  )

  const isOutOfStock = product.stock !== undefined && product.stock <= 0
  const stockCount = product.stock ?? 15

  const tabs = [
    { id: "benefits", label: "Benefits" },
    { id: "ingredients", label: "Ingredients" },
    { id: "use", label: "How to Use" },
  ] as const

  return (
    <div className="mt-7 flex flex-col gap-6">
      
      {/* Product Spec Badges (Size, Skin Type) */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-cream border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground/80">
          Size: {product.size || "50ml"}
        </span>
        <span className="rounded-full bg-cream border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground/80">
          Skin Type: {product.skin_type || "All skin types"}
        </span>
      </div>

      {/* Stock Status Indicator */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? "bg-red-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
        <span className="text-foreground">
          {isOutOfStock 
            ? "Out of Stock" 
            : stockCount < 10 
              ? `Only ${stockCount} items left in stock` 
              : "In Stock & Ready to Ship"}
        </span>
      </div>

      {/* Quantity & CTA Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5 w-fit bg-ivory">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-sm font-semibold tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
            disabled={isOutOfStock}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() =>
              addItem(
                {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  tagline: product.tagline,
                },
                quantity,
              )
            }
            disabled={isOutOfStock}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sage-dark px-7 py-4 text-sm font-semibold text-ivory shadow-lg shadow-sage-dark/20 transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97] disabled:opacity-60 disabled:hover:scale-100"
          >
            <ShoppingBag className="h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add to bag"}
          </button>

          <a
            href={isOutOfStock ? "#" : whatsappLink}
            target={isOutOfStock ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => isOutOfStock && e.preventDefault()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 px-7 py-4 text-sm font-semibold text-[#0f6e3d] transition-all duration-300 hover:scale-[1.03] hover:bg-[#25D366] hover:text-white active:scale-[0.97] ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Order via WhatsApp
          </a>
        </div>
      </div>

      {/* Editorial Tabs section */}
      <div className="mt-8 border-t border-border/80 pt-6">
        <div className="flex border-b border-border/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 pr-6 ${isActive ? "text-sage-dark" : "text-muted hover:text-foreground"}`}
              >
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-6 h-0.5 bg-sage-dark"
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-4 min-h-[120px] text-sm leading-relaxed text-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "benefits" && (
                <div className="space-y-2">
                  {product.benefits ? (
                    product.benefits.split("\n").map((line, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-sage-dark font-bold">•</span>
                        <span>{line.replace(/^•\s*/, "")}</span>
                      </p>
                    ))
                  ) : (
                    <p>• Locks in hydration for long-lasting glow.<br />• Calms skin irritation and redness.<br />• Absorbs quickly leaving a matte, dewy skin finish.</p>
                  )}
                </div>
              )}

              {activeTab === "ingredients" && (
                <p className="text-xs leading-relaxed italic">
                  {product.ingredients || "Aqua, Squalane, Glycerin, Rosa Damascena Flower Water, Sodium Hyaluronate, Tocopherol, Centella Asiatica Extract, Xanthan Gum, Phenoxyethanol."}
                </p>
              )}

              {activeTab === "use" && (
                <p>
                  {product.how_to_use || "Apply 2-3 drops to clean face and neck every morning and evening. Massage gently in upward circular motions until fully absorbed. Follow with moisturizer."}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}
