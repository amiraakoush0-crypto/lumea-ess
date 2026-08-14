"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { useCart } from "@/components/cart-context"
import { formatPrice } from "@/lib/utils"
import { buildWhatsAppOrderLink } from "@/lib/whatsapp"
import { createOrder } from "@/lib/actions/orders"

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", country: "", notes: "" })

  const whatsappLink = buildWhatsAppOrderLink(items, subtotal, form)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createOrder(items, form)
      if (result.error) {
        setError(result.error)
        return
      }
      setSuccess(true)
      clear()
    })
  }

  if (success) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center md:px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-soft">
            <CheckCircle2 className="h-8 w-8 text-sage-dark" />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground">Order received</h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted">
            Thank you! We&apos;ve received your order and will reach out shortly to confirm delivery details.
          </p>
          <Link
            href="/"
            className="mt-8 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97]"
          >
            Continue shopping
          </Link>
        </main>
        <SiteFooter />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center md:px-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Your bag is empty</h1>
          <p className="mt-2 text-muted">Add a few favorites before checking out.</p>
          <Link
            href="/#shop"
            className="mt-8 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97]"
          >
            Shop the collection
          </Link>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-sage-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <h1 className="mt-5 text-balance font-serif text-4xl font-semibold text-foreground">Checkout</h1>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <div className="rounded-[2rem] border border-border bg-ivory/70 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="jane.doe@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="+961 71 000 000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Delivery address</label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="Street name, building, floor..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">City</label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="Beirut"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Country</label>
                  <input
                    required
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="Lebanon"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Order notes (optional)</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="Preferred delivery time, gift note, etc."
                />
              </div>

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark py-4 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.015] hover:bg-gold-dark active:scale-[0.985] disabled:opacity-60 disabled:hover:scale-100"
              >
                {isPending ? "Placing order…" : `Place order · ${formatPrice(subtotal)}`}
              </button>

              <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-widest text-muted">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 py-3.5 text-sm font-semibold text-[#0f6e3d] transition-all duration-300 hover:scale-[1.015] hover:bg-[#25D366] hover:text-white active:scale-[0.985]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Order via WhatsApp instead
              </a>
            </form>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-[2rem] border border-border bg-cream p-6 md:p-8">
            <h2 className="font-serif text-xl font-semibold text-foreground">Order summary</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-ivory">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-serif text-xl font-semibold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted">Delivery and any applicable taxes confirmed upon contact.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
