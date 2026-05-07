"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LessonContent } from "@/components/courses/LessonContent"
import { CourseSidebar } from "@/components/courses/CourseSidebar"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { useEnrollment } from "@/hooks/useEnrollment"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react"
import type {
  CourseWithAuthor,
  LessonFull,
  ModuleWithLessons,
  ModuleWithProgress,
  LessonSummary,
  LessonWithProgress,
} from "@/types/domain"

interface LessonPlayerClientProps {
  course: CourseWithAuthor
  lesson: LessonFull
  modules: ModuleWithLessons[]
  orgSlug: string
  lessonId: string
  prevLessonId: string | null
  nextLessonId: string | null
}

export function LessonPlayerClient({
  course,
  lesson,
  modules,
  orgSlug,
  lessonId,
  prevLessonId,
  nextLessonId,
}: LessonPlayerClientProps) {
  const { completedIds, progressPercent, markComplete, markIncomplete, isMarking } =
    useLessonProgress(course.id)
  const { isEnrolled } = useEnrollment(course.id)

  const isCompleted = completedIds.has(lessonId)
  const basePath = `/${orgSlug}/courses/${course.slug}`

  const modulesWithProgress: ModuleWithProgress[] = modules.map((mod) => {
    const lessonsWithProgress: LessonWithProgress[] = (mod.lessons as LessonSummary[]).map(
      (l) => ({
        ...l,
        completed: completedIds.has(l.id),
      }),
    )
    return {
      ...mod,
      lessons: lessonsWithProgress,
      completed_count: lessonsWithProgress.filter((l) => l.completed).length,
      total_count: lessonsWithProgress.length,
    }
  })

  const isPreviewWithoutEnrollment = !isEnrolled && lesson.is_free_preview

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] -m-6">
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
          {isPreviewWithoutEnrollment && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
              👀 Você está vendo uma aula gratuita. Inscreva-se no curso pra
              acessar todas as aulas e marcar progresso.
            </div>
          )}

          <LessonContent lesson={lesson} />

          <div className="space-y-2">
            <h1 className="font-heading text-lg font-bold">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-sm text-muted-foreground">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {prevLessonId && (
                <Button variant="outline" size="sm" render={<Link href={`${basePath}/${prevLessonId}`} />}>
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
              )}
              {nextLessonId && (
                <Button variant="outline" size="sm" render={<Link href={`${basePath}/${nextLessonId}`} />}>
                  Próxima
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>

            {isEnrolled && (
              <Button
                variant={isCompleted ? "secondary" : "default"}
                size="sm"
                disabled={isMarking}
                onClick={() =>
                  isCompleted
                    ? markIncomplete(lessonId)
                    : markComplete(lessonId)
                }
              >
                {isMarking ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Circle className="size-4" />
                )}
                {isCompleted ? "Concluída" : "Marcar como concluída"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar — hidden on mobile */}
      <div className="hidden w-80 shrink-0 lg:block">
        <CourseSidebar
          course={course}
          modules={modulesWithProgress}
          currentLessonId={lessonId}
          orgSlug={orgSlug}
          progressPercent={progressPercent}
        />
      </div>
    </div>
  )
}
