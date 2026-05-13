"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ProgressBar } from "@/components/courses/ProgressBar"

interface UserCoursesTabProps {
  orgId: string
  orgSlug: string
  userId: string
}

interface CourseProgress {
  course_id: string
  title: string
  slug: string
  total_lessons: number
  completed_lessons: number
  completed_at: string | null
}

export function UserCoursesTab({
  orgId,
  orgSlug,
  userId,
}: UserCoursesTabProps) {
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["user-courses", orgId, userId],
    queryFn: async () => {
      const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select(
          "course_id, completed_at, courses:course_id(id, title, slug, total_lessons, org_id)",
        )
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false })

      if (error) throw error

      type EnrollmentRow = {
        course_id: string
        completed_at: string | null
        courses: {
          id: string
          title: string
          slug: string
          total_lessons: number
          org_id: string
        } | null
      }

      const rows = (enrollments ?? []) as unknown as EnrollmentRow[]
      const inOrg = rows.filter((r) => r.courses && r.courses.org_id === orgId)

      // Pull completed lesson counts per course in a single round trip via
      // lesson_completions joined to lessons → modules → course.
      // Simpler: query lesson_completions for this user, then look up the
      // course_id via the lessons/modules chain. We piggyback off the
      // database query by selecting the chain inline.
      const { data: completions } = await supabase
        .from("lesson_completions")
        .select(
          "lesson_id, lessons:lesson_id(modules:module_id(course_id))",
        )
        .eq("user_id", userId)

      type CompletionRow = {
        lesson_id: string
        lessons: { modules: { course_id: string } | null } | null
      }
      const completedByCourse = new Map<string, number>()
      for (const c of ((completions ?? []) as unknown as CompletionRow[])) {
        const cid = c.lessons?.modules?.course_id
        if (!cid) continue
        completedByCourse.set(cid, (completedByCourse.get(cid) ?? 0) + 1)
      }

      const courses: CourseProgress[] = inOrg.map((r) => {
        const course = r.courses!
        const completed = completedByCourse.get(course.id) ?? 0
        return {
          course_id: course.id,
          title: course.title,
          slug: course.slug,
          total_lessons: course.total_lessons,
          completed_lessons: completed,
          completed_at: r.completed_at,
        }
      })

      // Only courses the user has actually progressed through.
      return courses.filter(
        (c) => c.completed_lessons > 0 || c.completed_at !== null,
      )
    },
    enabled: !!orgId && !!userId,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-ink-low" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
        nenhum curso em andamento
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {data.map((c) => {
        const percent =
          c.total_lessons > 0
            ? Math.round((c.completed_lessons / c.total_lessons) * 100)
            : c.completed_at
              ? 100
              : 0
        return (
          <li key={c.course_id} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <Link
                href={`/${orgSlug}/courses/${c.slug}`}
                className="font-serif text-[16px] font-medium tracking-[-0.005em] text-foreground transition-colors hover:text-gold-dk"
              >
                {c.title}
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] tabular-nums text-ink-mid">
                {percent}% concluido
              </span>
            </div>
            <ProgressBar value={percent} max={100} size="sm" />
          </li>
        )
      })}
    </ul>
  )
}
