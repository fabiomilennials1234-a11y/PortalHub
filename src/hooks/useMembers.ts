"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { MemberWithProfile } from "@/types/domain"

export function useMembers(orgId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["members", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select(
          `
          id,
          user_id,
          org_id,
          role,
          status,
          points,
          level,
          joined_at,
          profile:profiles!memberships_user_id_fkey (
            full_name,
            avatar_url,
            bio
          )
        `,
        )
        .eq("org_id", orgId)
        .eq("status", "active")
        .order("points", { ascending: false })
      if (error) throw error
      return (data as unknown as MemberWithProfile[]) ?? []
    },
    enabled: !!orgId,
  })
}
