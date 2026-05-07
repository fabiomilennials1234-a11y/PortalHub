import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/utils"
import type { CourseWithAuthor } from "@/types/domain"

interface CourseCardProps {
  course: CourseWithAuthor
  orgSlug: string
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
}

export function CourseCard({ course, orgSlug }: CourseCardProps) {
  return (
    <Link href={`/${orgSlug}/courses/${course.slug}`}>
      <Card className="group overflow-hidden transition-all hover:ring-2 hover:ring-primary/20">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="size-10 text-primary/40" />
            </div>
          )}
          {course.status !== "published" && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 text-[10px]"
            >
              {course.status === "draft" ? "Rascunho" : "Arquivado"}
            </Badge>
          )}
        </div>
        <CardContent className="space-y-2">
          <h3 className="font-heading line-clamp-2 text-sm font-semibold leading-snug">
            {course.title}
          </h3>
          {course.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {course.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Avatar size="sm">
                {course.profiles.avatar_url && (
                  <AvatarImage src={course.profiles.avatar_url} />
                )}
                <AvatarFallback>
                  {getInitials(course.profiles.full_name)}
                </AvatarFallback>
              </Avatar>
              <span>{course.profiles.full_name ?? "Anônimo"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {course.total_lessons}
              </span>
              {course.total_duration_seconds > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatDuration(course.total_duration_seconds)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
