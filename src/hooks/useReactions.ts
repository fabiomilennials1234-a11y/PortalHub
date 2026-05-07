"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ReactionType } from "@/types/domain"

interface UseReactionsOptions {
  targetType: "post" | "comment"
  targetId: string
}

interface ReactionCount {
  like: number
  love: number
  insightful: number
  fire: number
}

export function useReactions({ targetType, targetId }: UseReactionsOptions) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const reactionsQuery = useQuery({
    queryKey: ["reactions", targetType, targetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reactions")
        .select("id, user_id, reaction_type")
        .eq("target_type", targetType)
        .eq("target_id", targetId)

      if (error) throw error
      return data
    },
    enabled: !!targetId,
  })

  const toggleMutation = useMutation({
    mutationFn: async (reactionType: ReactionType) => {
      const formData = new FormData()
      formData.set("target_type", targetType)
      formData.set("target_id", targetId)
      formData.set("reaction_type", reactionType)

      const { toggleReaction } = await import("@/actions/reactions")
      return toggleReaction(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", targetType, targetId],
      })
    },
  })

  const counts: ReactionCount = { like: 0, love: 0, insightful: 0, fire: 0 }
  for (const r of reactionsQuery.data ?? []) {
    counts[r.reaction_type as ReactionType]++
  }

  return {
    reactions: reactionsQuery.data ?? [],
    counts,
    isLoading: reactionsQuery.isLoading,
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  }
}
