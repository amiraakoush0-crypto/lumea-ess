"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type VideoFormState = { error?: string; success?: boolean }

export async function createVideo(_prevState: VideoFormState, formData: FormData): Promise<VideoFormState> {
  const supabase = await createClient()

  const video = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    video_url: String(formData.get("video_url") ?? "").trim(),
    poster_url: String(formData.get("poster_url") ?? "").trim() || null,
    placement: String(formData.get("placement") ?? "hero").trim(),
    display_order: Number(formData.get("display_order") ?? 0),
    is_active: formData.get("is_active") === "true",
    cta_text: String(formData.get("cta_text") ?? "").trim() || null,
    cta_link: String(formData.get("cta_link") ?? "").trim() || null,
  }

  if (!video.video_url || !video.placement) {
    return { error: "Video URL and Placement are required." }
  }

  const { error } = await supabase.from("videos").insert(video)
  if (error) return { error: error.message }

  revalidatePath("/admin/videos")
  revalidatePath("/")
  return { success: true }
}

export async function updateVideo(
  id: string,
  _prevState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> {
  const supabase = await createClient()

  const video = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    video_url: String(formData.get("video_url") ?? "").trim(),
    poster_url: String(formData.get("poster_url") ?? "").trim() || null,
    placement: String(formData.get("placement") ?? "hero").trim(),
    display_order: Number(formData.get("display_order") ?? 0),
    is_active: formData.get("is_active") === "true",
    cta_text: String(formData.get("cta_text") ?? "").trim() || null,
    cta_link: String(formData.get("cta_link") ?? "").trim() || null,
  }

  if (!video.video_url || !video.placement) {
    return { error: "Video URL and Placement are required." }
  }

  const { error } = await supabase.from("videos").update(video).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/videos")
  revalidatePath("/")
  return { success: true }
}

export async function deleteVideo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("videos").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/videos")
  revalidatePath("/")
}
