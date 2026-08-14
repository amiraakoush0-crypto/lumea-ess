import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { PhotoRevealSection } from "@/components/photo-reveal-section"
import { ProductShowcase } from "@/components/product-showcase"
import { EditorialVideoSection } from "@/components/editorial-video-section"
import { StorytellingVideoSection } from "@/components/storytelling-video-section"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { getProducts, getVideoByPlacement } from "@/lib/data"

export default async function Page() {
  const [products, heroVideo, editorialVideo, storytellingVideo] = await Promise.all([
    getProducts(),
    getVideoByPlacement("hero"),
    getVideoByPlacement("editorial_1"),
    getVideoByPlacement("editorial_2"),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        {/* Intro: the hero sticks while the photo panel scrolls up over it,
            so the two full-bleed panels hand off as one continuous motion. */}
        <div className="relative">
          <Hero
            video={
              heroVideo && {
                video_url: heroVideo.video_url,
                poster_url: heroVideo.poster_url,
                cta_text: heroVideo.cta_text,
                cta_link: heroVideo.cta_link,
              }
            }
          />
          <PhotoRevealSection />
        </div>
        <ProductShowcase products={products} />
        <EditorialVideoSection video={editorialVideo} />
        <StorytellingVideoSection video={storytellingVideo} />
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
