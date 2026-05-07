"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ReportWithReporter, ReportStatus } from "@/types/domain"

interface UseReportsOptions {
  orgId: string
  status?: ReportStatus
}

export function useReports({ orgId, status }: UseReportsOptions) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["reports", orgId, status ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("reports")
        .select("*, reporter:reporter_id(full_name, avatar_url)")
        .eq("org_id", orgId)

      if (status) query = query.eq("status", status)

      const { data, error } = await query.order("created_at", {
        ascending: false,
      })

      if (error) throw error
      return (data ?? []) as unknown as ReportWithReporter[]
    },
    enabled: !!orgId,
  })
}
