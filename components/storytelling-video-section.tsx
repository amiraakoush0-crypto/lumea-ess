"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Droplet, Heart, Shield } from "lucide-react"
import { resolveCtaLink } from "@/lib/utils"

export type StorytellingVideoSectionProps = {
  video?: {
    title: string
    description: string
    video_url: string
    poster_url: string | null
    cta_text: string | null
    cta_link: string | null
  } | null
}

export function StorytellingVideoSection({ video }: StorytellingVideoSectionProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoSrc = video?.video_url || "/storytelling-loop.mp4"
  const posterSrc = video?.poster_url || undefined
  const headline = video?.title || "Mindful Alchemy."
  const description =
    video?.description || "Cold-pressed and formulated in small batches, for actives at their purest."
  const ctaText = video?.cta_text || "Our formulation values"
  const ctaLink = resolveCtaLink(video?.cta_link)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Subtle parallax shift for the video container
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.98])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay bypass
      })
    }
  }, [])

  return (
    <section ref={containerRef} id="story" className="relative overflow-hidden bg-sage-soft/10 py-24 md:py-32 border-t border-b border-border/40">
      
      {/* Decorative botanical element or texture placeholder */}
      <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute left-10 bottom-0 -z-10 h-96 w-96 rounded-full bg-sage/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          
          {/* Video - Left (Desktop) */}
          <div className="lg:col-span-7">
            <motion.div 
              style={{ scale: videoScale }}
              className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] bg-foreground shadow-2xl shadow-sage-dark/10"
            >
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
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-foreground">
                <Droplet className="h-3.5 w-3.5 text-sage-dark animate-pulse" />
                Crafting active botanicals
              </div>
            </motion.div>
          </div>

          {/* Content - Right (Desktop) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-dark">
                  Skin Science & Purity
                </span>
                <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                  {headline}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-dark text-ivory">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="self-center font-serif text-lg font-semibold text-foreground">Dermatologist Tested</h3>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-dark text-ivory">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="self-center font-serif text-lg font-semibold text-foreground">100% Clean & Vegan</h3>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-dark text-ivory">
                    <Droplet className="h-5 w-5" />
                  </div>
                  <h3 className="self-center font-serif text-lg font-semibold text-foreground">Sustainable Sourcing</h3>
                </div>

              </div>

              <div className="pt-4">
                <a
                  href={ctaLink}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sage-dark hover:text-gold-dark transition-colors"
                >
                  {ctaText}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
