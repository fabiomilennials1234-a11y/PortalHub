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
  Check,
  Circle,
  Loader2,
  ArrowLeft,
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
  const {
    completedIds,
    progressPercent,
    markComplete,
    markIncomplete,
    isMarking,
  } = useLessonProgress(course.id)
  const { isEnrolled } = useEnrollment(course.id)

  const isCompleted = completedIds.has(lessonId)
  const basePath = `/${orgSlug}/courses/${course.slug}`

  // Locate module + position for breadcrumb (M? · L?)
  let moduleIndex = 0
  let lessonIndex = 0
  modules.forEach((mod, mi) => {
    const li = mod.lessons.findIndex((l) => l.id === lessonId)
    if (li >= 0) {
      moduleIndex = mi + 1
      lessonIndex = li + 1
    }
  })

  const modulesWithProgress: ModuleWithProgress[] = modules.map((mod) => {
    const lessonsWithProgress: LessonWithProgress[] = (
      mod.lessons as LessonSummary[]
    ).map((l) => ({
      ...l,
      completed: completedIds.has(l.id),
    }))
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
        <div className="mx-auto w-full max-w-4xl space-y-6 p-8">
          {/* Breadcrumb back */}
          <Link
            href={basePath}
            className="wf-mono inline-flex items-center gap-1.5 transition-colors hover:!text-foreground"
          >
            <ArrowLeft className="size-3" />
            VOLTAR AO CURSO
          </Link>

          {isPreviewWithoutEnrollment && (
            <div className="wf-box bg-gold-bg px-4 py-3">
              <span className="text-[13px] leading-[1.55] text-gold-dk">
                Você está vendo uma aula gratuita. Inscreva-se no curso para
                acessar todas as aulas e marcar progresso.
              </span>
            </div>
          )}

          {/* Lesson header */}
          <div className="space-y-2">
            <span className="wf-mono">
              MÓDULO {moduleIndex} · LIÇÃO {lessonIndex}
            </span>
            <h1 className="wf-hand text-[34px]">{lesson.title}</h1>
            {lesson.description && (
              <p className="max-w-2xl text-[14.5px] leading-[1.65] text-ink-soft">
                {lesson.description}
              </p>
            )}
          </div>

          <LessonContent lesson={lesson} />

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
            <div className="flex items-center gap-2">
              {prevLessonId ? (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`${basePath}/${prevLessonId}`} />}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
              )}
              {nextLessonId && (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`${basePath}/${nextLessonId}`} />}
                >
                  Próxima
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>

            {isEnrolled && (
              <div className="flex items-center gap-3">
                {!isCompleted && (
                  <span className="wf-mono !text-gold-dk">
                    +12 CRÉDITOS AO CONCLUIR
                  </span>
                )}
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
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <Circle className="size-4" />
                  )}
                  {isCompleted ? "Concluída" : "Marcar como concluída"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar — hidden on mobile */}
      <div className="hidden w-80 shrink-0 lg:block xl:w-96">
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
