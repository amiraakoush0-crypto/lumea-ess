"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, Leaf, Star } from "lucide-react"

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

  // Gentle parallax: the video drifts and slowly zooms as you scroll past the hero,
  // and the copy softens out — a subtle, professional sense of depth and movement.
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Video auto-play blocked by browser. User interaction needed:", err)
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="top" className="relative flex min-h-[92vh] items-center overflow-hidden bg-foreground">
      {/* Full-bleed looping video wrapper — smooth texture/glow background with subtle parallax */}
      <motion.div
        style={{ y: videoY, scale: videoScale }}
        className="absolute inset-0 -z-20 h-full w-full overflow-hidden"
      >
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

      {/* Soft dark → cream overlay gradient so copy stays perfectly readable */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/60 via-foreground/25 to-background/90" />
      {/* Gentle side vignette for extra contrast behind the copy */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/45 via-transparent to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-3xl px-4 pb-20 pt-32 text-center md:px-8 md:pb-28 md:pt-40"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 rounded-full bg-ivory/90 px-4 py-1.5 text-xs font-medium text-sage-dark shadow-sm backdrop-blur"
        >
          <Leaf className="h-3.5 w-3.5 text-sage-dark" />
          Clean botanical skincare
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-5 text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-ivory drop-shadow-[0_4px_24px_rgba(35,31,30,0.35)] md:text-7xl"
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
          className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-ivory/85"
        >
          {description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={ctaLink}
            className="group inline-flex items-center gap-2 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-semibold text-ivory shadow-lg shadow-foreground/20 transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark hover:shadow-xl active:scale-[0.97]"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#ritual"
            className="inline-flex items-center gap-2 rounded-full bg-ivory/90 px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.03] hover:bg-ivory active:scale-[0.97]"
          >
            Discover the ritual
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-8 flex items-center justify-center gap-5 text-sm text-ivory/80"
        >
          {ratingSummary ? (
            <>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>
                <strong className="text-ivory">{ratingSummary.average}/5</strong> from{" "}
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

      {/* Animated scroll cue — a small, living detail that signals there's more below */}
      <motion.a
        href="#shop"
        aria-label="Scroll to shop"
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.6 }, y: { delay: 1.2, duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
        className="absolute bottom-7 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-ivory/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-ivory"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  )
}
