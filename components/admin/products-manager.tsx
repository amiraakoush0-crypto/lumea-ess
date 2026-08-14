"use client"

import { useActionState, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/utils"
import { createProduct, updateProduct, deleteProduct, type ProductFormState } from "@/lib/actions/products"
import { MediaUpload } from "./media-upload"

const emptyState: ProductFormState = {}

export function ProductsManager({ products }: { products: Product[] }) {
  const [panelProduct, setPanelProduct] = useState<Product | "new" | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} items in your catalog.</p>
        </div>
        <button
          onClick={() => setPanelProduct("new")}
          className="flex items-center gap-2 rounded-full bg-sage-dark px-5 py-2.5 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-ivory/70">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Badge</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-cream">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="44px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted">{product.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-foreground/80">{product.category}</td>
                <td className="px-5 py-3 text-foreground/80">
                  {formatPrice(product.price)}
                  {product.compareAt && (
                    <span className="ml-1.5 text-xs text-muted line-through">
                      {formatPrice(product.compareAt)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-foreground/80">{product.badge ?? "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPanelProduct(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPendingDelete(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 active:scale-90"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  No products yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {panelProduct && (
          <ProductFormPanel
            key="product-form"
            product={panelProduct === "new" ? null : panelProduct}
            onClose={() => setPanelProduct(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDelete && (
          <ConfirmDeleteDialog
            key="confirm-delete"
            productName={products.find((p) => p.id === pendingDelete)?.name ?? "this product"}
            onCancel={() => setPendingDelete(null)}
            onConfirm={async () => {
              await deleteProduct(pendingDelete)
              setPendingDelete(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductFormPanel({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct
  const [state, formAction, isPending] = useActionState<ProductFormState, FormData>(action, emptyState)

  useEffect(() => {
    if (state.success) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-[1.75rem] border border-border bg-ivory p-6 shadow-2xl md:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {product ? "Edit product" : "Add product"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium text-foreground">
            Name
            <input
              name="name"
              defaultValue={product?.name}
              required
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="sm:col-span-2 text-sm font-medium text-foreground">
            Tagline
            <input
              name="tagline"
              defaultValue={product?.tagline}
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="sm:col-span-2 text-sm font-medium text-foreground">
            Description
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description ?? ""}
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Price (USD)
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price}
              required
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Compare-at price
            <input
              name="compareAt"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.compareAt ?? ""}
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Category
            <input
              name="category"
              defaultValue={product?.category}
              required
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            Badge
            <input
              name="badge"
              defaultValue={product?.badge ?? ""}
              placeholder="Best Seller, New, Limited…"
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <div className="sm:col-span-2">
            <MediaUpload
              name="image"
              label="Product Image"
              defaultValue={product?.image}
              accept="image"
              folder="products"
            />
          </div>

          {state.error && <p className="sm:col-span-2 text-sm font-medium text-red-600">{state.error}</p>}

          <div className="sm:col-span-2 mt-1 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.02] hover:bg-gold-dark active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            >
              {isPending ? "Saving…" : product ? "Save changes" : "Add product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-sage-soft active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function ConfirmDeleteDialog({
  productName,
  onCancel,
  onConfirm,
}: {
  productName: string
  onCancel: () => void
  onConfirm: () => void
}) {
  const [isPending, setIsPending] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-[1.75rem] border border-border bg-ivory p-6 shadow-2xl"
      >
        <h2 className="font-serif text-xl font-semibold text-foreground">Delete product?</h2>
        <p className="mt-2 text-sm text-muted">
          &ldquo;{productName}&rdquo; will be permanently removed from your catalog.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={async () => {
              setIsPending(true)
              await onConfirm()
              setIsPending(false)
            }}
            disabled={isPending}
            className="flex-1 rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-sage-soft active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
