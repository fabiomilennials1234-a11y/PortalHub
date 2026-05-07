"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { CommentWithAuthor } from "@/types/domain"

export function useComments(postId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles:author_id(full_name, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) throw error

      const comments = data as unknown as CommentWithAuthor[]
      const topLevel: CommentWithAuthor[] = []
      const childMap = new Map<string, CommentWithAuthor[]>()

      for (const comment of comments) {
        if (!comment.parent_id) {
          topLevel.push({ ...comment, children: [] })
        } else {
          const existing = childMap.get(comment.parent_id) ?? []
          existing.push(comment)
          childMap.set(comment.parent_id, existing)
        }
      }

      for (const parent of topLevel) {
        parent.children = childMap.get(parent.id) ?? []
      }

      return topLevel
    },
    enabled: !!postId,
  })
}
