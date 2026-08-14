import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Anchors for sections that have since been removed from the storefront.
 * CTA links are authored in the database, so rows seeded before a section was
 * retired would otherwise dead-link. Remap them at render time.
 */
const RETIRED_ANCHORS: Record<string, string> = {
  "#ritual": "#shop",
}

export function resolveCtaLink(link: string | null | undefined, fallback = "#shop") {
  if (!link) return fallback
  return RETIRED_ANCHORS[link] ?? link
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value)
}
