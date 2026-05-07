"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { UserStats } from "@/types/domain"

export function useUserStats(orgId: string, userId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["user-stats", orgId, userId],
    queryFn: async () => {
      const { data: membership } = await supabase
        .from("memberships")
        .select("points, level")
        .eq("org_id", orgId)
        .eq("user_id", userId)
        .single()

      if (!membership) return null

      const { data: levels } = await supabase
        .from("levels")
        .select("level_number, name, min_points")
        .eq("org_id", orgId)
        .order("level_number", { ascending: true })

      const currentLevel = (levels ?? []).find(
        (l) => l.level_number === membership.level,
      )
      const nextLevel = (levels ?? []).find(
        (l) => l.level_number === membership.level + 1,
      )

      const { data: rankRows } = await supabase
        .from("memberships")
        .select("user_id")
        .eq("org_id", orgId)
        .eq("status", "active")
        .order("points", { ascending: false })

      const rankIdx = (rankRows ?? []).findIndex((r) => r.user_id === userId)
      const rank = rankIdx >= 0 ? rankIdx + 1 : null

      const { count: achievementsCount } = await supabase
        .from("user_achievements")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)

      return {
        points: membership.points,
        level: membership.level,
        level_name: currentLevel?.name ?? "Novato",
        next_level_points: nextLevel?.min_points ?? null,
        rank,
        achievements_count: achievementsCount ?? 0,
      } satisfies UserStats
    },
    enabled: !!orgId && !!userId,
  })
}
