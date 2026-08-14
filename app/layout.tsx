import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import type { ReactNode } from "react"
import { CartProvider } from "@/components/cart-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Luméa Essentials — Luxury Skincare Rituals",
    template: "%s — Luméa Essentials",
  },
  description:
    "Luméa Essentials crafts clean, results-driven skincare rituals. Serums, creams and oils formulated with botanical actives for luminous, healthy skin.",
  keywords: ["luxury skincare", "serum", "moisturizer", "clean beauty", "Luméa Essentials"],
  openGraph: {
    title: "Luméa Essentials — Luxury Skincare Rituals",
    description: "Clean, results-driven skincare rituals for luminous skin.",
    type: "website",
    siteName: "Luméa Essentials",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luméa Essentials — Luxury Skincare Rituals",
    description: "Clean, results-driven skincare rituals for luminous skin.",
  },
}

export const viewport: Viewport = {
  themeColor: "#FBF9F5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`bg-background ${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
