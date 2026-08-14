import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { ProductShowcase } from "@/components/product-showcase"
import { EditorialVideoSection } from "@/components/editorial-video-section"
import { StorytellingVideoSection } from "@/components/storytelling-video-section"
import { Ritual } from "@/components/ritual"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { getProducts, getRatingSummary, getVideoByPlacement } from "@/lib/data"

export default async function Page() {
  const [products, ratingSummary, heroVideo, editorialVideo, storytellingVideo] = await Promise.all([
    getProducts(),
    getRatingSummary(),
    getVideoByPlacement("hero"),
    getVideoByPlacement("editorial_1"),
    getVideoByPlacement("editorial_2"),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <Hero video={heroVideo} ratingSummary={ratingSummary} />
        <ProductShowcase products={products} />
        <EditorialVideoSection video={editorialVideo} />
        <StorytellingVideoSection video={storytellingVideo} />
        <Ritual />
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
