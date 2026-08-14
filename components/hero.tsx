"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { resolveCtaLink } from "@/lib/utils"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

/**
 * Only the fields the panel actually renders. The videos row also carries a
 * title and description, but this hero shows neither — keeping them out of the
 * prop keeps that copy out of the serialized payload sent to the browser.
 */
export type HeroProps = {
  video?: {
    video_url: string
    poster_url: string | null
    cta_text: string | null
    cta_link: string | null
  } | null
}

export function Hero({ video }: HeroProps = {}) {
  const videoSrc = video?.video_url || "/hero-loop.mp4"
  const posterSrc = video?.poster_url || "/hero-loop-poster.png"
  const ctaText = video?.cta_text || "Shop Best Sellers"
  const ctaLink = resolveCtaLink(video?.cta_link)

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // The panel is sticky, so as the next panel slides over it the content
  // drifts up and dissolves — transform/opacity only, stays on the compositor.
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])

  useEffect(() => {
    videoRef.current?.play().catch(() => {
      // Autoplay blocked until interaction — the poster holds the frame.
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="sticky top-0 h-svh w-full overflow-hidden bg-foreground"
    >
      {/* Full-bleed cinematic video */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 h-full w-full">
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

      {/* Scrims: vertical for legibility, vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/20 to-foreground/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(35,31,30,0.5)_100%)]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-5 text-center md:px-8"
      >
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="font-serif text-3xl font-semibold uppercase tracking-[0.32em] text-ivory drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-4xl md:text-5xl md:tracking-[0.38em]"
        >
          Luméa Essentials
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={ctaLink}
            className="group inline-flex items-center gap-2 rounded-full bg-ivory px-9 py-4 text-sm font-semibold text-foreground shadow-xl shadow-black/20 transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:text-ivory active:scale-[0.97]"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#story"
            className="inline-flex items-center gap-2 rounded-full border border-ivory/40 px-9 py-4 text-sm font-semibold text-ivory backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-ivory hover:bg-ivory/10 active:scale-[0.97]"
          >
            Our Story
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#shop"
        aria-label="Scroll down"
        style={{ opacity: contentOpacity }}
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-colors hover:bg-ivory/10"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  )
}
