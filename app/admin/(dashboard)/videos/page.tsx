import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { VideosManager, type VideoRecord } from "@/components/admin/videos-manager"

export const revalidate = 0

const fallbackVideos: VideoRecord[] = [
  {
    id: "v1",
    title: "Skin that glows, rituals that last.",
    description: "Luméa Essentials blends high-performance actives with soothing botanicals for a luminous, healthy complexion — thoughtfully formulated, beautifully simple.",
    video_url: "/hero-loop.mp4",
    poster_url: "/hero-loop-poster.png",
    placement: "hero",
    display_order: 0,
    is_active: true,
    cta_text: "Shop Best Sellers",
    cta_link: "#shop",
    created_at: new Date().toISOString(),
  },
  {
    id: "v2",
    title: "The Hydration Ritual",
    description: "A lightweight, ceramide-rich daily cream that locks in moisture for a full 72 hours, repairing your skin barrier while restoring organic botanical suppleness.",
    video_url: "/banner-loop.mp4",
    poster_url: "/banner-loop-poster.png",
    placement: "editorial_1",
    display_order: 0,
    is_active: true,
    cta_text: "Shop Hydra Veil",
    cta_link: "#shop",
    created_at: new Date().toISOString(),
  },
  {
    id: "v3",
    title: "Botanical Alchemy & Science",
    description: "Every droplet of Luméa is cold-pressed and dermatologically tested, ensuring active bio-nutrients are delivered in their purest state directly to your skin.",
    video_url: "/storytelling-loop.mp4",
    poster_url: null,
    placement: "editorial_2",
    display_order: 0,
    is_active: true,
    cta_text: "Our Clean Science",
    cta_link: "#shop",
    created_at: new Date().toISOString(),
  }
]

export default async function AdminVideosPage() {
  const configured = isSupabaseConfigured()
  let videos: VideoRecord[] = []

  if (configured) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("placement", { ascending: true })
        .order("display_order", { ascending: true })

      if (!error && data && data.length > 0) {
        videos = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          video_url: d.video_url,
          poster_url: d.poster_url,
          placement: d.placement,
          display_order: d.display_order,
          is_active: d.is_active,
          cta_text: d.cta_text,
          cta_link: d.cta_link,
          created_at: d.created_at,
        }))
      } else {
        videos = fallbackVideos
      }
    } catch (err) {
      console.error("Failed to fetch videos from Supabase:", err)
      videos = fallbackVideos
    }
  } else {
    videos = fallbackVideos
  }

  return (
    <div>
      {!configured && (
        <div className="mb-6 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
          Supabase isn&apos;t connected yet. Showing default media catalog. Connect to Supabase via environment variables to customize these settings in production.
        </div>
      )}
      <VideosManager videos={videos} />
    </div>
  )
}
