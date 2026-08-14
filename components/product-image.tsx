"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

type ProductImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
}

export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <div className="shimmer absolute inset-0" aria-hidden />}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-contain transition-all duration-700 ease-out",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
          imgClassName,
        )}
      />
    </div>
  )
}
