import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProgressBar } from "@/components/courses/ProgressBar"

interface ContinueWatchingProps {
  orgId: string
  orgSlug: string
}

interface ModuleLite {
  id: string
  position: number
  lessons: { id: string; position: number }[]
}

interface CourseLite {
  id: string
  title: string
  slug: string
  thumbnail_url: string | null
  total_lessons: number
  modules: ModuleLite[]
}

export async function ContinueWatching({
  orgId,
  orgSlug,
}: ContinueWatchingProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Most recent lesson completion by this user, joined with module/course/org.
  const { data: lastCompletion } = await supabase
    .from("lesson_completions")
    .select(
      "lesson_id, completed_at, lessons!inner(module_id, modules!inner(course_id, courses!inner(id, org_id)))",
    )
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(20)

  if (!lastCompletion || lastCompletion.length === 0) return null

  // Find the first completion whose course belongs to current org.
  type CompletionRow = {
    lesson_id: string
    completed_at: string
    lessons: {
      module_id: string
      modules: {
        course_id: string
        courses: { id: string; org_id: string }
      }
    }
  }
  const rows = lastCompletion as unknown as CompletionRow[]
  const inOrg = rows.find((r) => r.lessons.modules.courses.org_id === orgId)
  if (!inOrg) return null

  const courseId = inOrg.lessons.modules.courses.id

  // Fetch course + modules + lessons to compute progress and next lesson.
  const { data: courseData } = await supabase
    .from("courses")
    .select(
      "id, title, slug, thumbnail_url, total_lessons, modules(id, position, lessons(id, position))",
    )
    .eq("id", courseId)
    .single()

  if (!courseData) return null

  const course = courseData as unknown as CourseLite

  // All lessons sorted by module.position then lesson.position.
  const sortedModules = [...course.modules].sort(
    (a, b) => a.position - b.position,
  )
  const allLessons = sortedModules.flatMap((mod) =>
    [...mod.lessons]
      .sort((a, b) => a.position - b.position)
      .map((l, i) => ({
        id: l.id,
        moduleId: mod.id,
        modulePosition: mod.position,
        lessonPosition: i + 1,
      })),
  )

  if (allLessons.length === 0) return null

  // Completed lessons in this course.
  const lessonIds = allLessons.map((l) => l.id)
  const { data: completions } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds)

  const completedSet = new Set((completions ?? []).map((c) => c.lesson_id))
  const completedCount = completedSet.size
  const totalLessons = allLessons.length

  // If course already 100% complete, don't show.
  if (completedCount >= totalLessons) return null

  // Next lesson = first lesson not in completedSet, in canonical order.
  const nextLesson = allLessons.find((l) => !completedSet.has(l.id))
  if (!nextLesson) return null

  // Module index (1-based) for the next lesson, in sortedModules order.
  const nextModuleIndex =
    sortedModules.findIndex((m) => m.id === nextLesson.moduleId) + 1
  const percent = Math.round((completedCount / totalLessons) * 100)

  return (
    <section className="space-y-3">
      <span className="wf-mono">CONTINUE DE ONDE PAROU</span>
      <article className="wf-box border-ink bg-gold-bg/40 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          {/* Thumb */}
          <div className="wf-box relative h-[80px] w-full shrink-0 overflow-hidden bg-paper-2 sm:w-[140px]">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover"
                sizes="140px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen
                  className="size-7 text-ink-low"
                  strokeWidth={1.25}
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
            <span className="wf-mono">
              MÓDULO {nextModuleIndex} · LIÇÃO {nextLesson.lessonPosition}
            </span>
            <h3 className="truncate font-serif text-[20px] font-medium leading-[1.2] tracking-[-0.015em] text-foreground sm:text-[22px]">
              {course.title}
            </h3>
            <p className="text-[13px] leading-[1.5] text-ink-mid">
              Última lição
            </p>
            <ProgressBar
              value={completedCount}
              max={totalLessons}
              size="sm"
              className="mt-1"
            />
            <span className="wf-mono !text-ink-mid">
              {completedCount}/{totalLessons} LIÇÕES · {percent}%
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center sm:shrink-0">
            <Link
              href={`/${orgSlug}/courses/${course.slug}/${nextLesson.id}`}
              className="wf-pill wf-pill--gold inline-flex items-center gap-1.5 border border-ink !px-4 !py-2 !text-[12px] transition-transform hover:-translate-y-0.5"
            >
              CONTINUAR
              <ArrowRight className="size-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </article>
    </section>
  )
}
