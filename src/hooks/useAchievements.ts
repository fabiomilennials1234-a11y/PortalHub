"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { AchievementWithEarned } from "@/types/domain"

export function useAchievements(orgId: string, userId?: string) {
  const supabase = createClient()
  const { data: auth } = useAuth()
  const targetUserId = userId ?? auth?.user?.id

  return useQuery({
    queryKey: ["achievements", orgId, targetUserId ?? "all"],
    queryFn: async () => {
      const { data: achievements, error: achError } = await supabase
        .from("achievements")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: true })

      if (achError) throw achError

      let earnedMap = new Map<string, string>()
      if (targetUserId) {
        const { data: earned } = await supabase
          .from("user_achievements")
          .select("achievement_id, earned_at")
          .eq("user_id", targetUserId)

        earnedMap = new Map(
          (earned ?? []).map((e) => [e.achievement_id, e.earned_at]),
        )
      }

      return (achievements ?? []).map<AchievementWithEarned>((a) => ({
        ...a,
        earned: earnedMap.has(a.id),
        earned_at: earnedMap.get(a.id) ?? null,
      }))
    },
    enabled: !!orgId,
  })
}
