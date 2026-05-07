"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { Payment } from "@/types/database.types"

export function usePayments(orgId: string, limit = 20) {
  const supabase = createClient()
  const { data: auth } = useAuth()

  return useQuery({
    queryKey: ["payments", orgId, auth?.user?.id ?? "anon", limit],
    queryFn: async () => {
      if (!auth?.user) return []

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", auth.user.id)
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return (data ?? []) as unknown as Payment[]
    },
    enabled: !!orgId && !!auth?.user,
  })
}
