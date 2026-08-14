"use client"

import { createBrowserClient } from "@supabase/ssr"

/**
 * Supabase client for use in Client Components.
 * Reads the public URL + anon key from environment variables.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

/** True when Supabase env vars are present, so client components can fall back to demo data appropriately. */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
