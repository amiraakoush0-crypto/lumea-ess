"use client"

import { useActionState, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react"
import { createVideo, updateVideo, deleteVideo, type VideoFormState } from "@/lib/actions/videos"
import { MediaUpload } from "./media-upload"

export type VideoRecord = {
  id: string
  title: string
  description: string
  video_url: string
  poster_url: string | null
  placement: "hero" | "editorial_1" | "editorial_2"
  display_order: number
  is_active: boolean
  cta_text: string | null
  cta_link: string | null
  created_at: string
}

const emptyState: VideoFormState = {}

export function VideosManager({ videos }: { videos: VideoRecord[] }) {
  const [panelVideo, setPanelVideo] = useState<VideoRecord | "new" | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Videos</h1>
          <p className="mt-1 text-sm text-muted">{videos.length} videos managed in database.</p>
        </div>
        <button
          onClick={() => setPanelVideo("new")}
          className="flex items-center gap-2 rounded-full bg-sage-dark px-5 py-2.5 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.03] hover:bg-gold-dark active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          Add video
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-ivory/70">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Video Title / URL</th>
              <th className="px-5 py-3 font-medium">Placement</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">CTA</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((vid) => (
              <tr key={vid.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-foreground">{vid.title || "Untitled Video"}</p>
                    <p className="text-xs text-muted font-mono max-w-[280px] truncate">{vid.video_url}</p>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs uppercase text-foreground/80">{vid.placement}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${vid.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {vid.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {vid.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-foreground/85">
                  {vid.cta_text ? (
                    <div>
                      <p className="font-semibold">{vid.cta_text}</p>
                      <p className="text-muted font-mono truncate max-w-[120px]">{vid.cta_link}</p>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPanelVideo(vid)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-sage-soft active:scale-90"
                      aria-label="Edit video settings"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPendingDelete(vid.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 active:scale-90"
                      aria-label="Delete video"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  No video records found. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {panelVideo && (
          <VideoFormPanel
            key="video-form"
            video={panelVideo === "new" ? null : panelVideo}
            onClose={() => setPanelVideo(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDelete && (
          <ConfirmDeleteDialog
            key="confirm-delete"
            videoTitle={videos.find((v) => v.id === pendingDelete)?.title || "this video"}
            onCancel={() => setPendingDelete(null)}
            onConfirm={async () => {
              await deleteVideo(pendingDelete)
              setPendingDelete(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function VideoFormPanel({ video, onClose }: { video: VideoRecord | null; onClose: () => void }) {
  const action = video ? updateVideo.bind(null, video.id) : createVideo
  const [state, formAction, isPending] = useActionState<VideoFormState, FormData>(action, emptyState)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="w-full max-w-lg rounded-[1.75rem] border border-border bg-ivory p-6 shadow-2xl md:p-8"
      >
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {video ? "Edit video" : "Add video placement"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-sage-soft transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <label className="sm:col-span-2 text-sm font-medium text-foreground">
            Campaign Title
            <input
              name="title"
              defaultValue={video?.title}
              required
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="e.g. Skin that glows, rituals that last."
            />
          </label>

          <label className="sm:col-span-2 text-sm font-medium text-foreground">
            Campaign Description
            <textarea
              name="description"
              rows={2}
              defaultValue={video?.description}
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Detailed sub-text to display over or next to the video..."
            />
          </label>

          <div className="sm:col-span-2">
            <MediaUpload
              name="video_url"
              label="Video File"
              defaultValue={video?.video_url}
              accept="video"
              folder="videos"
            />
          </div>

          <label className="text-sm font-medium text-foreground">
            Placement
            <select
              name="placement"
              defaultValue={video?.placement || "hero"}
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="hero">Hero Background (Video 1)</option>
              <option value="editorial_1">Editorial Highlight (Video 2)</option>
              <option value="editorial_2">Storytelling Segment (Video 3)</option>
            </select>
          </label>

          <label className="text-sm font-medium text-foreground">
            Display Status
            <select
              name="is_active"
              defaultValue={video?.is_active ? "true" : "false"}
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="true">Active (Show on Site)</option>
              <option value="false">Disabled (Hide)</option>
            </select>
          </label>

          <label className="text-sm font-medium text-foreground">
            CTA Button Text (Optional)
            <input
              name="cta_text"
              defaultValue={video?.cta_text || ""}
              placeholder="e.g. Shop Now"
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <label className="text-sm font-medium text-foreground">
            CTA Button Link (Optional)
            <input
              name="cta_link"
              defaultValue={video?.cta_link || ""}
              placeholder="e.g. #shop"
              className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>

          <div className="sm:col-span-2">
            <MediaUpload
              name="poster_url"
              label="Poster / Fallback Image (Optional)"
              defaultValue={video?.poster_url || ""}
              accept="image"
              folder="posters"
            />
          </div>

          <input type="hidden" name="display_order" value={video?.display_order ?? 0} />

          {state.error && <p className="sm:col-span-2 text-sm font-medium text-red-600">{state.error}</p>}

          <div className="sm:col-span-2 mt-4 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.02] hover:bg-gold-dark active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? "Saving..." : video ? "Save Changes" : "Add Video"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-sage-soft active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function ConfirmDeleteDialog({
  videoTitle,
  onCancel,
  onConfirm,
}: {
  videoTitle: string
  onCancel: () => void
  onConfirm: () => void
}) {
  const [isPending, setIsPending] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="w-full max-w-sm rounded-[1.75rem] border border-border bg-ivory p-6 shadow-2xl"
      >
        <h2 className="font-serif text-xl font-semibold text-foreground">Delete video record?</h2>
        <p className="mt-2 text-sm text-muted">
          &ldquo;{videoTitle}&rdquo; will be permanently deleted from the database.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={async () => {
              setIsPending(true)
              await onConfirm()
              setIsPending(false)
            }}
            disabled={isPending}
            className="flex-1 rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-sage-soft active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
