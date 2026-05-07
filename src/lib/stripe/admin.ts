import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Service-role client for webhook handlers — bypasses RLS.
// Only used in API routes that have already verified Stripe signature.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
