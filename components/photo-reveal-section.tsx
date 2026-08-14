"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * Full-bleed photo panel. Sits above the sticky hero in the stacking order and
 * scrolls up over it, so the two intro panels hand off as one continuous move
 * instead of two sections butting together.
 *
 * No copy by design — this panel is purely visual.
 */
export function PhotoRevealSection() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // The photo drifts slower than the panel for depth. Transform-only.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-svh w-full overflow-hidden bg-cream"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 h-[118%] w-full">
        <Image
          src="/model-ritual.png"
          alt="A Luméa sheet-mask ritual"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_22%]"
        />
      </motion.div>

      {/* Vignette + warm wash: adds depth and softens the upscale on wide viewports */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(35,31,30,0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />
    </section>
  )
}
