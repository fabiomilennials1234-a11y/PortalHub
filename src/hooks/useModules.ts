"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ModuleWithLessons } from "@/types/domain"

export function useModules(courseId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["modules", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(
          "*, lessons(id, module_id, title, description, content_type, duration_seconds, position, is_free_preview)",
        )
        .eq("course_id", courseId)
        .order("position", { ascending: true })

      if (error) throw error

      return (data as unknown as ModuleWithLessons[]).map((mod) => ({
        ...mod,
        lessons: [...mod.lessons].sort((a, b) => a.position - b.position),
      }))
    },
    enabled: !!courseId,
  })
}
