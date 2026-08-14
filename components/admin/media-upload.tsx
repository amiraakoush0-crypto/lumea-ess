"use client"

import { useRef, useState } from "react"
import { UploadCloud, Loader2, X, Link as LinkIcon } from "lucide-react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

type MediaUploadProps = {
  name: string
  label: string
  defaultValue?: string | null
  accept: "image" | "video"
  folder: string
}

/**
 * Drag-and-drop / click-to-upload widget backed by real Supabase Storage (bucket: "media").
 * Renders a hidden input so it drops straight into the existing FormData-based server actions —
 * no changes needed in lib/actions/*. Falls back to a plain URL field when Supabase isn't configured.
 */
export function MediaUpload({ name, label, defaultValue, accept, folder }: MediaUploadProps) {
  const [value, setValue] = useState(defaultValue ?? "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const configured = isSupabaseConfigured()
  const mimeAccept = accept === "image" ? "image/*" : "video/*"

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() || (accept === "image" ? "jpg" : "mp4")
      const path = `${folder}/${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        setError(uploadError.message)
        return
      }

      const { data } = supabase.storage.from("media").getPublicUrl(path)
      setValue(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  if (!configured) {
    // No Supabase connected yet — plain URL input, same as before.
    return (
      <label className="text-sm font-medium text-foreground">
        {label}
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://…"
          className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
        />
        <span className="mt-1 block text-xs text-muted">
          Connect Supabase to enable direct file uploads.
        </span>
      </label>
    )
  }

  return (
    <div className="text-sm font-medium text-foreground">
      <span>{label}</span>
      <input type="hidden" name={name} value={value} />

      <div className="mt-1.5 space-y-2">
        {value ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-ivory p-2.5">
            {accept === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
            ) : (
              <video src={value} muted className="h-14 w-20 shrink-0 rounded-lg bg-foreground object-cover" />
            )}
            <span className="min-w-0 flex-1 truncate text-xs font-normal text-muted">{value}</span>
            <button
              type="button"
              onClick={() => setValue("")}
              className="shrink-0 rounded-full p-1.5 text-muted hover:bg-sage-soft hover:text-foreground"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-ivory px-4 py-6 text-xs font-medium text-muted transition-colors hover:border-sage hover:text-sage-dark disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" /> Click to upload {accept === "image" ? "an image" : "a video"}
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={mimeAccept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ""
          }}
        />

        <label className="flex items-center gap-1.5 text-xs font-normal text-muted">
          <LinkIcon className="h-3 w-3 shrink-0" />
          or paste a URL:
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://…"
            className="ml-1 min-w-0 flex-1 rounded-lg border border-border bg-ivory px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-sage"
          />
        </label>

        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </div>
    </div>
  )
}
