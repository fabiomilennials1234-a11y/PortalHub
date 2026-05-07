"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ActivityEntry } from "@/types/domain"

interface UseActivityLogOptions {
  orgId: string
  userId?: string
  limit?: number
}

export function useActivityLog({
  orgId,
  userId,
  limit = 30,
}: UseActivityLogOptions) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["activity-log", orgId, userId ?? "all", limit],
    queryFn: async () => {
      let query = supabase
        .from("point_events")
        .select(
          "*, profile:user_id(full_name, avatar_url)",
        )
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (userId) query = query.eq("user_id", userId)

      const { data, error } = await query
      if (error) throw error

      type Row = {
        id: string
        user_id: string
        org_id: string
        action: string
        points: number
        reference_type: string | null
        reference_id: string | null
        created_at: string
        profile: {
          full_name: string | null
          avatar_url: string | null
        } | null
      }

      const rows = (data ?? []) as unknown as Row[]
      return rows.map<ActivityEntry>((row) => ({
        id: row.id,
        user_id: row.user_id,
        org_id: row.org_id,
        action: row.action,
        points: row.points,
        reference_type: row.reference_type,
        reference_id: row.reference_id,
        created_at: row.created_at,
        profile: {
          full_name: row.profile?.full_name ?? null,
          avatar_url: row.profile?.avatar_url ?? null,
        },
      }))
    },
    enabled: !!orgId,
  })
}
