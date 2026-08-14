"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, ArrowRight, Droplet } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function ModelRitualSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 1.04])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.85])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-cream py-20 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:gap-4 md:px-8">
        {/* Image — appears with parallax rise as the section scrolls into view */}
        <motion.div
          style={{ y: imageY, scale: imageScale, opacity: imageOpacity }}
          className="relative order-1 mx-auto w-full max-w-md md:order-2"
        >
          <div className="relative aspect-[3/4] w-full">
            <img
              src="/model-ritual.png"
              alt="The Luméa ritual — a sheet mask treatment"
              className="h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Floating detail card — reinforces "professional" editorial feel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl md:-left-8 md:bottom-10 md:translate-x-0"
          >
            <Droplet className="h-5 w-5 shrink-0 text-sage-dark" />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">10-Minute Ritual</p>
              <p className="text-xs text-muted">Deep hydration, daily glow</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Copy */}
        <div className="order-2 flex flex-col items-start text-left md:order-1">
          <motion.span
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-sage-dark"
          >
            <Sparkles className="h-3.5 w-3.5" />
            The Ritual
          </motion.span>

          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl"
          >
            A moment of stillness,
            <br />
            written into skin.
          </motion.h2>

          <motion.p
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mt-5 max-w-md text-pretty leading-relaxed text-muted"
          >
            Every Luméa treatment is designed as a pause — a few quiet minutes where
            botanical actives go to work, skin softens, and the day slows down. Formulated
            for visible results, felt as much as seen.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mt-8"
          >
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-sage-dark px-7 py-3.5 text-sm font-semibold text-ivory shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark hover:shadow-lg active:scale-[0.97]"
            >
              Discover the Ritual
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
