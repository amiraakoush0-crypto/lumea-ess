"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"

/**
 * Full-bleed photo panel that sits above the sticky hero in the stacking order.
 *
 * As it scrolls up over the hero it wipes open from an inset rounded card to
 * edge-to-edge, so the handoff reads as one deliberate swipe rather than two
 * sections butting together. The photo itself counter-drifts for depth.
 *
 * No copy by design — this panel is purely visual.
 */
export function PhotoRevealSection() {
  const containerRef = useRef<HTMLElement>(null)

  // Drives the wipe: 0 as the panel enters from the bottom, 1 once it has
  // travelled up to the top of the viewport.
  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  })

  // Drives the parallax across the panel's whole time on screen.
  const { scrollYProgress: driftProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const inset = useTransform(revealProgress, [0, 0.85], [7, 0])
  const radius = useTransform(revealProgress, [0, 0.85], [2.5, 0])
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}rem)`

  const imageY = useTransform(driftProgress, [0, 1], ["-8%", "8%"])

  return (
    <section ref={containerRef} className="relative z-10 h-svh w-full">
      <motion.div style={{ clipPath }} className="absolute inset-0 overflow-hidden bg-cream">
        <motion.div style={{ y: imageY }} className="absolute inset-0 h-[118%] w-full">
          <Image
            src="/cleanse-foam.jpg"
            alt="A Luméa cleansing ritual"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
        </motion.div>

        {/* Vignette for depth, plus a soft hand-off into the section below */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(35,31,30,0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />
      </motion.div>
    </section>
  )
}
