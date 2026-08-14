"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react"

export type EditorialVideoSectionProps = {
  video?: {
    title: string
    description: string
    video_url: string
    poster_url: string | null
    cta_text: string | null
    cta_link: string | null
  } | null
}

export function EditorialVideoSection({ video }: EditorialVideoSectionProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoSrc = video?.video_url || "/banner-loop.mp4"
  const posterSrc = video?.poster_url || "/banner-loop-poster.png"
  const headline = video?.title || "72-Hour Ceramide Hydration."
  const description =
    video?.description ||
    "A lightweight, ceramide-rich daily cream that locks in moisture for a full 72 hours, repairing your skin barrier while restoring organic botanical suppleness. Experience the luxurious sensation of melting hydration that absorbs instantly without weight."
  const ctaText = video?.cta_text || "Shop Hydra Veil"
  const ctaLink = video?.cta_link || "#shop"

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Smooth editorial parallax on the image/video container
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay bypass
      })
    }
  }, [])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          
          {/* Editorial Content - Left (Desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-dark">
                The Hydration Campaign
              </span>
              
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                {headline}
              </h2>
              
              <p className="mt-6 text-base leading-relaxed text-muted">
                {description}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-soft text-sage-dark">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Triple Ceramide Barrier Support</h4>
                    <p className="text-xs text-muted">Ceramides NP, AP, and EOP lock moisture deep within the lipid barrier.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-soft text-sage-dark">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Botanical Squalane & Rosewater</h4>
                    <p className="text-xs text-muted">Nourishes and calms redness, providing a dewy, soft-focus finish.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-soft text-sage-dark">
                    <RefreshCw className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Non-Comedogenic & Clean</h4>
                    <p className="text-xs text-muted">Free of parabens, synthetic fragrances, and pore-clogging mineral oils.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href={ctaLink}
                  className="group inline-flex items-center gap-2 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-semibold text-ivory shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark hover:shadow-lg active:scale-[0.97]"
                >
                  {ctaText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Cinematic Editorial Video - Right (Desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-foreground shadow-2xl shadow-sage-dark/15 md:aspect-[16/10]">
              <motion.div style={{ y: yParallax }} className="absolute inset-0 h-[112%] w-full">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={posterSrc}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
                {/* Soft editorial luxury overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sage-dark/15 via-transparent to-transparent mix-blend-multiply" />
              </motion.div>
              
              <div className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-foreground">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-dark"></span>
                </span>
                Campaign Film: The Veil of Hydration
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
