"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { SubscriptionWithPlan } from "@/types/domain"

export function useSubscription(orgId: string) {
  const supabase = createClient()
  const { data: auth } = useAuth()

  return useQuery({
    queryKey: ["subscription", orgId, auth?.user?.id ?? "anon"],
    queryFn: async () => {
      if (!auth?.user) return null

      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          "*, plan:plan_id(name, price_cents, currency, interval)",
        )
        .eq("user_id", auth.user.id)
        .eq("org_id", orgId)
        .maybeSingle()

      if (error) throw error
      return data as unknown as SubscriptionWithPlan | null
    },
    enabled: !!orgId && !!auth?.user,
  })
}
