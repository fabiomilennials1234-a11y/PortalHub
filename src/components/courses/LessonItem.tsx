import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDuration } from "@/lib/utils"
import { Play, FileText, ExternalLink, Check } from "lucide-react"
import type { LessonSummary, LessonWithProgress } from "@/types/domain"

interface LessonItemProps {
  lesson: LessonSummary | LessonWithProgress
  courseSlug: string
  orgSlug: string
  isActive?: boolean
}

const CONTENT_ICONS = {
  video: Play,
  text: FileText,
  embed: ExternalLink,
} as const

function isWithProgress(
  lesson: LessonSummary | LessonWithProgress,
): lesson is LessonWithProgress {
  return "completed" in lesson
}

export function LessonItem({
  lesson,
  courseSlug,
  orgSlug,
  isActive,
}: LessonItemProps) {
  const Icon = CONTENT_ICONS[lesson.content_type]
  const completed = isWithProgress(lesson) && lesson.completed

  return (
    <Link
      href={`/${orgSlug}/courses/${courseSlug}/${lesson.id}`}
      className={cn(
        "group relative flex items-center gap-3 rounded-sm px-3 py-2 text-[13px] text-ink-soft transition-colors hover:bg-paper-2",
        isActive && "bg-paper-2 pl-3.5 font-semibold text-foreground",
        completed && !isActive && "text-ink-mid",
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 bg-gold"
        />
      )}
      <div
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm border",
          completed
            ? "border-gold bg-gold-bg text-gold-dk"
            : isActive
              ? "border-foreground bg-paper text-foreground"
              : "border-line bg-paper text-ink-low",
        )}
      >
        {completed ? (
          <Check className="size-3" strokeWidth={2.5} />
        ) : (
          <Icon className="size-2.5" />
        )}
      </div>
      <span className="flex-1 truncate">{lesson.title}</span>
      {lesson.is_free_preview && (
        <span className="wf-mono shrink-0 !text-[10px] !text-ink-mid">
          PREVIEW
        </span>
      )}
      {lesson.duration_seconds > 0 && (
        <span className="wf-mono shrink-0 tabular-nums !text-[10px] !text-ink-low">
          {formatDuration(lesson.duration_seconds)}
        </span>
      )}
    </Link>
  )
}
