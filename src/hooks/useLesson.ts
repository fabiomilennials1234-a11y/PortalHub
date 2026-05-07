"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { LessonFull } from "@/types/domain"

export function useLesson(lessonId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single()

      if (error) throw error
      return data as unknown as LessonFull
    },
    enabled: !!lessonId,
  })
}
