"use client"

import { motion } from "framer-motion"
import { Droplets, Sun, Moon } from "lucide-react"
import { CreamSwirlArt } from "./cream-swirl-art"

const steps = [
  {
    icon: Sun,
    step: "01",
    title: "Cleanse & Prep",
    text: "Begin with Cloud Milk Cleanser to gently lift impurities without stripping.",
  },
  {
    icon: Droplets,
    step: "02",
    title: "Treat & Hydrate",
    text: "Layer Radiance Serum, then seal with Hydra Veil for lasting moisture.",
  },
  {
    icon: Moon,
    step: "03",
    title: "Restore Overnight",
    text: "Finish with Midnight Restore Oil to renew skin while you sleep.",
  },
]

export function Ritual() {
  return (
    <section id="ritual" className="relative overflow-hidden bg-sage-soft/30">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square overflow-hidden rounded-[2rem] shadow-xl shadow-sage-dark/10"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <CreamSwirlArt className="h-full w-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold text-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-sage-dark" />
            100% Clean Formula
          </motion.div>
        </motion.div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-dark">
            The Luméa Ritual
          </span>
          <h2 className="mt-3 text-balance font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Three mindful steps to luminous skin
          </h2>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted">
            A ritual designed to be simple, sensorial, and effective — morning and night.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="flex items-start gap-4 rounded-2xl glass p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-dark text-ivory">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gold-dark">{s.step}</span>
                      <h3 className="font-serif text-xl font-semibold text-foreground">{s.title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
