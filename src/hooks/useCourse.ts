"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { CourseWithAuthor } from "@/types/domain"

export function useCourse(orgId: string, courseSlug: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["course", orgId, courseSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(
          "*, profiles:author_id(full_name, avatar_url)",
        )
        .eq("org_id", orgId)
        .eq("slug", courseSlug)
        .single()

      if (error) throw error
      return data as unknown as CourseWithAuthor
    },
    enabled: !!orgId && !!courseSlug,
  })
}
