"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { PlanWithFeatures } from "@/types/domain"

export function usePlans(orgId: string, includeInactive = false) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["plans", orgId, includeInactive],
    queryFn: async () => {
      let query = supabase
        .from("plans")
        .select("*")
        .eq("org_id", orgId)
        .order("position", { ascending: true })
        .order("price_cents", { ascending: true })

      if (!includeInactive) query = query.eq("active", true)

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as unknown as PlanWithFeatures[]
    },
    enabled: !!orgId,
  })
}
