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
  const withProgress = isWithProgress(module)
  const isComplete =
    withProgress && module.total_count > 0 && module.completed_count === module.total_count

  return (
    <div className="wf-box overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2"
      >
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm border",
            isComplete
              ? "border-gold bg-gold-bg"
              : "border-line bg-paper",
          )}
          aria-hidden
        >
          {isComplete && (
            <span className="wf-mono !text-[9px] !text-gold-dk">✓</span>
          )}
        </span>
        <span className="font-serif text-[15px] font-medium tracking-[-0.01em] text-foreground flex-1">
          {module.title}
        </span>
        {withProgress ? (
          <span className="wf-mono tabular-nums !text-ink-mid">
            {module.completed_count}/{module.total_count}
          </span>
        ) : (
          <span className="wf-mono tabular-nums !text-ink-mid">
            {module.lessons.length} {module.lessons.length === 1 ? "AULA" : "AULAS"}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-low transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-line-soft bg-paper px-1.5 py-1.5">
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
