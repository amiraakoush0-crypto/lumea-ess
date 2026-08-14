"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * Pure visual break between the hero and the shop grid — no copy, just the
 * ritual photo revealing and drifting gently as it scrolls into view.
 */
export function PhotoRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.06])
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])

  return (
    <section ref={containerRef} className="bg-cream py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ scale }}
        className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] shadow-xl shadow-foreground/10 sm:max-w-lg md:max-w-xl"
      >
        <motion.div style={{ y }} className="absolute inset-0 h-[112%] w-full">
          <Image
            src="/model-ritual.png"
            alt="A Luméa sheet-mask ritual"
            fill
            sizes="(max-width: 768px) 90vw, 576px"
            className="object-cover object-top"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
