"use client"

import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { NotificationWithActor } from "@/types/domain"

export function useNotifications(limit = 30) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: auth } = useAuth()
  const userId = auth?.user?.id

  const query = useQuery({
    queryKey: ["notifications", userId ?? "anon", limit],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from("notifications")
        .select("*, actor:actor_id(full_name, avatar_url)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return (data ?? []) as unknown as NotificationWithActor[]
    },
    enabled: !!userId,
  })

  // Realtime subscription for new notifications
  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["notifications", userId],
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, queryClient])

  const unreadCount = (query.data ?? []).filter((n) => !n.read).length

  return {
    notifications: query.data ?? [],
    unreadCount,
    isLoading: query.isLoading,
  }
}
