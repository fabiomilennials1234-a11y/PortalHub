"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { LeaderboardEntry } from "@/types/domain"

export function useLeaderboard(orgId: string, limit = 50) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["leaderboard", orgId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select(
          "user_id, org_id, points, level, profile:user_id(full_name, avatar_url)",
        )
        .eq("org_id", orgId)
        .eq("status", "active")
        .order("points", { ascending: false })
        .limit(limit)

      if (error) throw error

      type Row = {
        user_id: string
        org_id: string
        points: number
        level: number
        profile: { full_name: string | null; avatar_url: string | null } | null
      }

      const rows = (data ?? []) as unknown as Row[]
      return rows.map<LeaderboardEntry>((row, idx) => ({
        user_id: row.user_id,
        org_id: row.org_id,
        points: row.points,
        level: row.level,
        rank: idx + 1,
        profile: {
          full_name: row.profile?.full_name ?? null,
          avatar_url: row.profile?.avatar_url ?? null,
        },
      }))
    },
    enabled: !!orgId,
  })
}
