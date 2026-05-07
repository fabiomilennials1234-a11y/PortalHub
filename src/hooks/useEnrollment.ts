"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"

export function useEnrollment(courseId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: auth } = useAuth()

  const enrollmentQuery = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      if (!auth?.user) return null
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", auth.user.id)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!courseId && !!auth?.user,
  })

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      formData.set("course_id", courseId)
      const { enrollInCourse } = await import("@/actions/courses")
      return enrollInCourse(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] })
    },
  })

  const unenrollMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      formData.set("course_id", courseId)
      const { unenrollFromCourse } = await import("@/actions/courses")
      return unenrollFromCourse(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] })
    },
  })

  return {
    enrollment: enrollmentQuery.data ?? null,
    isEnrolled: !!enrollmentQuery.data,
    isCompleted: !!enrollmentQuery.data?.completed_at,
    isLoading: enrollmentQuery.isLoading,
    enroll: enrollMutation.mutate,
    unenroll: unenrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
  }
}
