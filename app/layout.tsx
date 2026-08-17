import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import type { ReactNode } from "react"
import { CartProvider } from "@/components/cart-context"
import { MotionProvider } from "@/components/motion-provider"
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
    default: "Luméa Essentials — Beauty & Everyday Essentials",
    template: "%s — Luméa Essentials",
  },
  description:
    "Lip care, hair treatments, body care and everyday essentials, hand-picked from the brands worth stocking. Delivered across Lebanon.",
  keywords: ["beauty", "lip care", "hair care", "body care", "Lebanon", "Luméa Essentials"],
  openGraph: {
    title: "Luméa Essentials — Beauty & Everyday Essentials",
    description: "Hand-picked lip, hair and body care, delivered across Lebanon.",
    type: "website",
    siteName: "Luméa Essentials",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luméa Essentials — Beauty & Everyday Essentials",
    description: "Hand-picked lip, hair and body care, delivered across Lebanon.",
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
        <MotionProvider>
          <CartProvider>{children}</CartProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
