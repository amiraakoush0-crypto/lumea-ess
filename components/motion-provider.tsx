"use client"

import { MotionConfig } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Framer Motion animates via inline transforms in JS, so the reduced-motion CSS
 * in globals.css can't reach it. `reducedMotion="user"` makes every motion
 * component in the tree honour the operating system setting instead.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
