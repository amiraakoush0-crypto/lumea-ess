"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { WhatsAppIcon } from "./whatsapp-icon"
import { formatPrice } from "@/lib/utils"
import { buildWhatsAppOrderLink } from "@/lib/whatsapp"

export function CartDrawer() {
  const { isOpen, closeCart, items, increment, decrement, remove, subtotal, count } = useCart()

  const whatsappLink = buildWhatsAppOrderLink(items, subtotal)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-foreground/25 backdrop-blur-sm"
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl"
            role="dialog"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-sage-dark" />
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Your Bag
                  <span className="ml-2 text-sm font-sans font-normal text-muted">({count})</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-105 hover:bg-sage-soft active:scale-90"
                aria-label="Close bag"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="thin-scroll flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-soft">
                    <ShoppingBag className="h-7 w-7 text-sage-dark" />
                  </div>
                  <p className="mt-4 font-serif text-lg font-semibold text-foreground">
                    Your bag is empty
                  </p>
                  <p className="mt-1 text-sm text-muted">Discover your radiant ritual.</p>
                  <button
                    onClick={closeCart}
                    className="mt-5 rounded-full bg-sage-dark px-6 py-2.5 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97]"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-cream">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h3 className="font-serif text-base font-semibold leading-tight text-foreground">
                                {item.name}
                              </h3>
                              <p className="text-xs text-muted">{item.tagline}</p>
                            </div>
                            <button
                              onClick={() => remove(item.id)}
                              className="h-fit text-muted transition-all duration-200 hover:scale-110 hover:text-sage-dark"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                              <button
                                onClick={() => decrement(item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increment(item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer / checkout */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Subtotal</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">Taxes and delivery confirmed at checkout.</p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark py-4 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.015] hover:bg-gold-dark active:scale-[0.985]"
                >
                  Checkout · {formatPrice(subtotal)}
                </Link>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 py-3.5 text-sm font-semibold text-[#0f6e3d] transition-all duration-300 hover:scale-[1.015] hover:bg-[#25D366] hover:text-white active:scale-[0.985]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Order via WhatsApp
                </a>

                <button
                  onClick={closeCart}
                  className="mt-2 w-full py-2 text-center text-xs font-medium text-muted transition-colors duration-200 hover:text-sage-dark"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
