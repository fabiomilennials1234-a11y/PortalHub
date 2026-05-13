"use client"

import { EnrollButton } from "@/components/courses/EnrollButton"
import { ProgressBar } from "@/components/courses/ProgressBar"
import { ModuleAccordion } from "@/components/courses/ModuleAccordion"
import { useEnrollment } from "@/hooks/useEnrollment"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import type {
  ModuleWithLessons,
  ModuleWithProgress,
  LessonWithProgress,
  LessonSummary,
} from "@/types/domain"

interface CourseDetailClientProps {
  courseId: string
  courseSlug: string
  orgSlug: string
  modules: ModuleWithLessons[]
}

export function CourseDetailClient({
  courseId,
  courseSlug,
  orgSlug,
  modules,
}: CourseDetailClientProps) {
  const { isEnrolled } = useEnrollment(courseId)
  const { completedIds, progressPercent } = useLessonProgress(courseId)

  const modulesWithProgress: (ModuleWithLessons | ModuleWithProgress)[] =
    isEnrolled
      ? modules.map((mod) => {
          const lessonsWithProgress: LessonWithProgress[] = (
            mod.lessons as LessonSummary[]
          ).map((l) => ({
            ...l,
            completed: completedIds.has(l.id),
          }))
          return {
            ...mod,
            lessons: lessonsWithProgress,
            completed_count: lessonsWithProgress.filter((l) => l.completed)
              .length,
            total_count: lessonsWithProgress.length,
          } satisfies ModuleWithProgress
        })
      : modules

  return (
    <div className="space-y-8">
      {/* Enroll + progress card */}
      <div className="wf-box flex flex-col gap-4 bg-paper p-5 sm:flex-row sm:items-center">
        <EnrollButton courseId={courseId} />
        {isEnrolled && (
          <div className="flex-1 space-y-1.5">
            <ProgressBar value={progressPercent} size="sm" />
            <span className="wf-mono block tabular-nums">
              {progressPercent}% CONCLUÍDO
            </span>
          </div>
        )}
      </div>

      {/* Curriculum */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-line-soft pb-3">
          <h2 className="wf-hand text-[26px]">Currículo</h2>
          <span className="wf-mono">
            {modules.length} {modules.length === 1 ? "MÓDULO" : "MÓDULOS"}
          </span>
        </div>
        <div className="space-y-3">
          {modulesWithProgress.map((mod) => (
            <ModuleAccordion
              key={mod.id}
              module={mod}
              courseSlug={courseSlug}
              orgSlug={orgSlug}
              defaultOpen
            />
          ))}
          {modules.length === 0 && (
            <div className="wf-box p-6 text-center">
              <span className="wf-mono">NENHUM MÓDULO ADICIONADO AINDA</span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
