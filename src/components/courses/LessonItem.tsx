import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDuration } from "@/lib/utils"
import { Play, FileText, ExternalLink, Check, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50",
        isActive && "bg-muted",
        completed && "text-muted-foreground",
      )}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          completed
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {completed ? <Check className="size-3" /> : <Icon className="size-3" />}
      </div>
      <span className="flex-1 truncate">{lesson.title}</span>
      {lesson.is_free_preview && (
        <Badge variant="outline" className="gap-1 text-[10px]">
          <Eye className="size-2.5" />
          Preview
        </Badge>
      )}
      {lesson.duration_seconds > 0 && (
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {formatDuration(lesson.duration_seconds)}
        </span>
      )}
    </Link>
  )
}
