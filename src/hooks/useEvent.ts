"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { EventWithHost } from "@/types/domain"

export function useEvent(eventId: string) {
  const supabase = createClient()
  const { data: auth } = useAuth()

  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, host:host_id(full_name, avatar_url)")
        .eq("id", eventId)
        .single()
      if (error) throw error
      return data as unknown as EventWithHost
    },
    enabled: !!eventId,
  })

  const registrationQuery = useQuery({
    queryKey: ["event-registration", eventId, auth?.user?.id ?? "anon"],
    queryFn: async () => {
      if (!auth?.user) return null
      const { data } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", auth.user.id)
        .maybeSingle()
      return data
    },
    enabled: !!eventId && !!auth?.user,
  })

  return {
    event: eventQuery.data,
    isLoading: eventQuery.isLoading,
    isRegistered: !!registrationQuery.data,
    queryClient: useQueryClient(),
  }
}
