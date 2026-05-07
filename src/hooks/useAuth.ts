"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export function useAuth() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      return { user, profile }
    },
    staleTime: 5 * 60 * 1000,
  })
}
