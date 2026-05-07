"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"

export function useLessonProgress(courseId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: auth } = useAuth()

  const progressQuery = useQuery({
    queryKey: ["lesson-progress", courseId],
    queryFn: async () => {
      if (!auth?.user) return { completedIds: new Set<string>(), total: 0 }

      const { data: modules } = await supabase
        .from("modules")
        .select("id, lessons(id)")
        .eq("course_id", courseId)

      const allLessonIds: string[] = []
      for (const mod of modules ?? []) {
        const lessons = mod.lessons as unknown as { id: string }[]
        for (const l of lessons) {
          allLessonIds.push(l.id)
        }
      }

      if (allLessonIds.length === 0) {
        return { completedIds: new Set<string>(), total: 0 }
      }

      const { data: completions } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", auth.user.id)
        .in("lesson_id", allLessonIds)

      return {
        completedIds: new Set((completions ?? []).map((c) => c.lesson_id)),
        total: allLessonIds.length,
      }
    },
    enabled: !!courseId && !!auth?.user,
  })

  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const formData = new FormData()
      formData.set("lesson_id", lessonId)
      const { markLessonComplete } = await import("@/actions/courses")
      return markLessonComplete(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", courseId],
      })
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] })
    },
  })

  const markIncompleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const formData = new FormData()
      formData.set("lesson_id", lessonId)
      const { markLessonIncomplete } = await import("@/actions/courses")
      return markLessonIncomplete(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", courseId],
      })
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] })
    },
  })

  const completedIds = progressQuery.data?.completedIds ?? new Set<string>()
  const total = progressQuery.data?.total ?? 0
  const completedCount = completedIds.size
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0

  return {
    completedIds,
    completedCount,
    total,
    progressPercent,
    isLoading: progressQuery.isLoading,
    markComplete: markCompleteMutation.mutate,
    markIncomplete: markIncompleteMutation.mutate,
    isMarking:
      markCompleteMutation.isPending || markIncompleteMutation.isPending,
  }
}
