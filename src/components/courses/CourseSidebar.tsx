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
  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto border-l border-border p-4">
      <div className="space-y-2">
        <h2 className="font-heading text-sm font-semibold line-clamp-2">
          {course.title}
        </h2>
        <ProgressBar value={progressPercent} showLabel size="sm" />
      </div>
      <div className="space-y-2">
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
