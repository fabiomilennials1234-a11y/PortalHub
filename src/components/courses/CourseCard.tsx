import Link from "next/link"
import Image from "next/image"
import { BookOpen } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import type { CourseWithAuthor } from "@/types/domain"

interface CourseCardProps {
  course: CourseWithAuthor
  orgSlug: string
}

export function CourseCard({ course, orgSlug }: CourseCardProps) {
  return (
    <Link
      href={`/${orgSlug}/courses/${course.slug}`}
      className="group block"
    >
      <article className="wf-box wf-box--hover overflow-hidden">
        <div className="relative aspect-video overflow-hidden border-b border-line bg-paper-2">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-paper-2">
              <BookOpen className="size-8 text-ink-low" strokeWidth={1.25} />
            </div>
          )}
          {course.status !== "published" && (
            <span className="wf-pill absolute right-2 top-2 !bg-paper !text-ink-soft">
              {course.status === "draft" ? "RASCUNHO" : "ARQUIVADO"}
            </span>
          )}
        </div>
        <div className="space-y-2.5 p-4">
          <div className="flex items-start gap-2">
            <h3 className="font-serif text-[18px] font-medium leading-[1.2] tracking-[-0.015em] text-foreground line-clamp-2 flex-1">
              {course.title}
            </h3>
          </div>
          {course.description && (
            <p className="line-clamp-2 text-[13px] leading-[1.55] text-ink-mid">
              {course.description}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <span className="wf-mono">
              {course.total_lessons} {course.total_lessons === 1 ? "AULA" : "AULAS"}
            </span>
            {course.total_duration_seconds > 0 && (
              <>
                <span aria-hidden className="text-ink-low">·</span>
                <span className="wf-mono">
                  {formatDuration(course.total_duration_seconds)}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
