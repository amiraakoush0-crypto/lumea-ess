import { Leaf } from "lucide-react"

const INSTAGRAM_URL = "https://www.instagram.com/lumea_essential26"
// Lebanese mobile 71 183 481 in international form for wa.me deep links.
const WHATSAPP_URL = "https://wa.me/96171183481"

const shopLinks = ["Best Sellers", "Lips", "Hair", "Body", "Accessories"]

/** Brand glyphs are inlined: lucide has no WhatsApp mark and has deprecated its
 *  Instagram one, so both live here rather than half in the icon library. */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-sage-dark" />
              <span className="font-serif text-2xl font-semibold text-foreground">Luméa</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Curated beauty and everyday essentials, chosen for skin that glows.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Luméa Essentials on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 hover:scale-110 hover:border-sage-dark hover:bg-sage-soft"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Luméa Essentials on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 hover:scale-110 hover:border-sage-dark hover:bg-sage-soft"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Shop</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {shopLinks.map((link) => (
                <li key={link}>
                  <a href="/#shop" className="text-sm text-muted transition-colors hover:text-sage-dark">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-sage-dark"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  71 183 481
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-sage-dark"
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                  @lumea_essential26
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} Luméa Essentials. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
