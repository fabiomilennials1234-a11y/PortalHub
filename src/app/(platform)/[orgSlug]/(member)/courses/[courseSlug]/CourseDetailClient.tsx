"use client"

import { Separator } from "@/components/ui/separator"
import { EnrollButton } from "@/components/courses/EnrollButton"
import { ProgressBar } from "@/components/courses/ProgressBar"
import { ModuleAccordion } from "@/components/courses/ModuleAccordion"
import { useEnrollment } from "@/hooks/useEnrollment"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import type { ModuleWithLessons, ModuleWithProgress, LessonWithProgress, LessonSummary } from "@/types/domain"

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
          } satisfies ModuleWithProgress
        })
      : modules

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <EnrollButton courseId={courseId} />
        {isEnrolled && (
          <ProgressBar
            value={progressPercent}
            showLabel
            size="sm"
            className="flex-1"
          />
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <h2 className="font-heading text-base font-semibold">Currículo</h2>
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
          <p className="text-sm text-muted-foreground">
            Nenhum módulo adicionado ainda.
          </p>
        )}
      </div>
    </div>
  )
}
