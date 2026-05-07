"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { PostWithAuthor } from "@/types/domain"

const PAGE_SIZE = 20

interface UsePostsOptions {
  orgId: string
  categoryId?: string | null
}

export function usePosts({ orgId, categoryId }: UsePostsOptions) {
  const supabase = createClient()

  return useInfiniteQuery({
    queryKey: ["posts", orgId, categoryId ?? "all"],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      let query = supabase
        .from("posts")
        .select(
          "*, profiles:author_id(full_name, avatar_url), categories:category_id(name, slug, color)",
        )
        .eq("org_id", orgId)
        .eq("published", true)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE)

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      if (pageParam) {
        query = query.lt("created_at", pageParam)
      }

      const { data, error } = await query

      if (error) throw error
      return data as unknown as PostWithAuthor[]
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined
      const unpinned = lastPage.filter((p) => !p.pinned)
      if (unpinned.length === 0) return undefined
      return unpinned[unpinned.length - 1].created_at
    },
    enabled: !!orgId,
  })
}
