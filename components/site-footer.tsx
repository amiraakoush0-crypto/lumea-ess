"use client"

import { motion } from "framer-motion"
import { Leaf, Instagram, Twitter, Facebook } from "lucide-react"

const columns = [
  { title: "Shop", links: ["Best Sellers", "Serums", "Moisturizers", "Gift Cards"] },
  { title: "About", links: ["Our Story", "Ingredients", "Sustainability", "Reviews"] },
  { title: "Support", links: ["Contact", "Shipping", "Returns", "FAQ"] },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 rounded-[2rem] bg-sage-dark px-6 py-12 text-center md:px-12 md:py-16"
        >
          <h2 className="max-w-xl text-balance font-serif text-3xl font-semibold text-ivory md:text-4xl">
            Join the Luméa community
          </h2>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-full bg-ivory/95 px-5 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97]"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

        {/* Links */}
        <div className="mt-16 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-sage-dark" />
              <span className="font-serif text-2xl font-semibold text-foreground">Luméa</span>
            </div>
            <div className="mt-5 flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 hover:scale-110 hover:border-sage-dark hover:bg-sage-soft"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-sage-dark"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Luméa Essentials. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-sage-dark">Privacy</a>
            <a href="#" className="transition-colors hover:text-sage-dark">Terms</a>
            <a href="#" className="transition-colors hover:text-sage-dark">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
