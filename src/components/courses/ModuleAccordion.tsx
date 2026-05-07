"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { LessonItem } from "@/components/courses/LessonItem"
import type { ModuleWithLessons, ModuleWithProgress } from "@/types/domain"

interface ModuleAccordionProps {
  module: ModuleWithLessons | ModuleWithProgress
  courseSlug: string
  orgSlug: string
  currentLessonId?: string
  defaultOpen?: boolean
}

function isWithProgress(
  mod: ModuleWithLessons | ModuleWithProgress,
): mod is ModuleWithProgress {
  return "completed_count" in mod
}

export function ModuleAccordion({
  module,
  courseSlug,
  orgSlug,
  currentLessonId,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const hasActiveLessonInside = module.lessons.some(
    (l) => l.id === currentLessonId,
  )
  const [open, setOpen] = useState(defaultOpen || hasActiveLessonInside)

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/30"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
        <span className="flex-1">{module.title}</span>
        {isWithProgress(module) && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {module.completed_count}/{module.total_count}
          </span>
        )}
        {!isWithProgress(module) && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}
          </span>
        )}
      </button>
      {open && (
        <div className="border-t border-border px-1 py-1">
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              courseSlug={courseSlug}
              orgSlug={orgSlug}
              isActive={lesson.id === currentLessonId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
