"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Leaf, Star } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export type HeroProps = {
  video?: {
    title: string
    description: string
    video_url: string
    poster_url: string | null
    cta_text: string | null
    cta_link: string | null
  } | null
  ratingSummary?: { average: number; totalReviews: number } | null
}

export function Hero({ video, ratingSummary }: HeroProps = {}) {
  const videoSrc = video?.video_url || "/hero-loop.mp4"
  const posterSrc = video?.poster_url || "/hero-loop-poster.png"
  const headline = video?.title || "Skin that glows,\nrituals that last."
  const [headlineLine1, headlineLine2] = headline.includes("\n")
    ? headline.split("\n")
    : [headline, ""]
  const description = video?.description || "Clean botanical skincare for a luminous complexion."
  const ctaText = video?.cta_text || "Shop Best Sellers"
  const ctaLink = video?.cta_link || "#shop"

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked until user interaction — poster covers the gap.
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-28 md:grid-cols-2 md:gap-12 md:px-8 md:pb-24 md:pt-36">
        {/* Copy */}
        <motion.div style={{ opacity: contentOpacity }} className="order-2 text-center md:order-1 md:text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-1.5 text-xs font-medium text-sage-dark"
          >
            <Leaf className="h-3.5 w-3.5" />
            Clean botanical skincare
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-5 text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl"
          >
            {headlineLine1}
            {headlineLine2 && (
              <>
                <br />
                {headlineLine2}
              </>
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted md:mx-0"
          >
            {description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <a
              href={ctaLink}
              className="group inline-flex items-center gap-2 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-semibold text-ivory shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark hover:shadow-lg active:scale-[0.97]"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#ritual"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-[1.03] hover:border-sage-dark hover:bg-sage-soft active:scale-[0.97]"
            >
              Discover the ritual
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-8 flex items-center justify-center gap-5 text-sm text-muted md:justify-start"
          >
            {ratingSummary ? (
              <>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>
                  <strong className="text-foreground">{ratingSummary.average}/5</strong> from{" "}
                  {ratingSummary.totalReviews.toLocaleString()}+ reviews
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Dermatologist-tested
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Serum video — framed in its native portrait shape so the shot isn't cropped to its dark backdrop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-xl shadow-foreground/10 md:order-2 md:max-w-none"
        >
          <motion.div style={{ y: videoY }} className="h-[112%] w-full">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={posterSrc}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
