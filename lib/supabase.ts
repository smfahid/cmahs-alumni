import { createClient } from "@supabase/supabase-js"

// Create a singleton instance for the Supabase client
let supabase: ReturnType<typeof createClient> | null = null
let supabaseAdmin: ReturnType<typeof createClient> | null = null

// For server-side usage
export const getSupabase = () => {
  if (supabase) return supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required")
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}

export const getSupabaseAdmin = () => {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and Service Role Key are required")
  }

  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  return supabaseAdmin
}

// For client-side usage
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Browser client singleton
let browserClient: ReturnType<typeof createClient> | null = null

export const getBrowserClient = () => {
  if (typeof window === "undefined") {
    throw new Error("getBrowserClient should only be called in the browser")
  }

  if (!browserClient) {
    browserClient = createBrowserClient()
  }

  return browserClient
}
