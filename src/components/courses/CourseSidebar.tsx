"use client"

import { ProgressBar } from "@/components/courses/ProgressBar"
import { ModuleAccordion } from "@/components/courses/ModuleAccordion"
import type { CourseWithAuthor, ModuleWithProgress } from "@/types/domain"

interface CourseSidebarProps {
  course: CourseWithAuthor
  modules: ModuleWithProgress[]
  currentLessonId?: string
  orgSlug: string
  progressPercent: number
}

export function CourseSidebar({
  course,
  modules,
  currentLessonId,
  orgSlug,
  progressPercent,
}: CourseSidebarProps) {
  const totalLessons = modules.reduce((acc, m) => acc + m.total_count, 0)
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.completed_count,
    0,
  )

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-l border-line bg-paper">
      <div className="space-y-3 border-b border-line-soft px-5 py-5">
        <span className="wf-mono">CURSO</span>
        <h2 className="wf-hand line-clamp-2 text-[20px]">{course.title}</h2>
        <ProgressBar value={progressPercent} size="sm" />
        <span className="wf-mono block tabular-nums">
          {completedLessons} / {totalLessons} · {progressPercent}%
        </span>
      </div>
      <div className="space-y-2.5 p-4">
        {modules.map((mod) => (
          <ModuleAccordion
            key={mod.id}
            module={mod}
            courseSlug={course.slug}
            orgSlug={orgSlug}
            currentLessonId={currentLessonId}
          />
        ))}
      </div>
    </aside>
  )
}
