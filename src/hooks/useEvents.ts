"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { EventWithHost } from "@/types/domain"

interface UseEventsOptions {
  orgId: string
  status?: "upcoming" | "live" | "ended" | "cancelled"
}

export function useEvents({ orgId, status }: UseEventsOptions) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["events", orgId, status ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*, host:host_id(full_name, avatar_url)")
        .eq("org_id", orgId)

      if (status) query = query.eq("status", status)

      const { data, error } = await query.order("starts_at", {
        ascending: status === "ended" ? false : true,
      })

      if (error) throw error
      return (data ?? []) as unknown as EventWithHost[]
    },
    enabled: !!orgId,
  })
}
