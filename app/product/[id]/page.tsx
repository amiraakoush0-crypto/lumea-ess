import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductImage } from "@/components/product-image"
import { ProductDetailActions } from "@/components/product-detail-actions"
import { formatPrice } from "@/lib/utils"
import { getProduct } from "@/lib/data"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return { title: "Product not found — Luméa Essentials" }
  }

  const title = `${product.name} — Luméa Essentials`
  const description =
    product.description?.slice(0, 155) ||
    `${product.tagline} — shop ${product.name} from Luméa Essentials.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.image ? [{ url: product.image }] : undefined,
    },
    alternates: { canonical: `/product/${product.id}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-sage-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-cream">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="h-full w-full"
              imgClassName="p-8"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            {product.badge && (
              <span className="inline-flex w-fit items-center rounded-full bg-sage-dark px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-ivory">
                {product.badge}
              </span>
            )}

            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-muted">{product.tagline}</p>

            <div className="mt-4 flex items-center gap-1 text-sm text-muted">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{product.rating}</span>
              <span>({product.reviews.toLocaleString()} reviews)</span>
              <span className="ml-2 text-sage-dark">{product.category}</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-serif text-3xl font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-lg text-muted line-through">{formatPrice(product.compareAt)}</span>
              )}
            </div>

            {product.description && (
              <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted">{product.description}</p>
            )}

            <ProductDetailActions product={product} />
          </div>
        </div>
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
