import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { BookOpen, Clock } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDuration } from "@/lib/utils"
import { CourseDetailClient } from "./CourseDetailClient"

interface Props {
  params: Promise<{ orgSlug: string; courseSlug: string }>
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

export async function generateMetadata({ params }: Props) {
  const { orgSlug, courseSlug } = await params
  const supabase = await createClient()
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()
  if (!org) return { title: "Curso" }

  const { data: course } = await supabase
    .from("courses")
    .select("title, description")
    .eq("org_id", org.id)
    .eq("slug", courseSlug)
    .single()
  return {
    title: course?.title ?? "Curso",
    description: course?.description,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { orgSlug, courseSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  const { data: course } = await supabase
    .from("courses")
    .select("*, profiles:author_id(full_name, avatar_url)")
    .eq("org_id", org.id)
    .eq("slug", courseSlug)
    .single()

  if (!course) notFound()

  const profile = course.profiles as {
    full_name: string | null
    avatar_url: string | null
  }

  const { data: modules } = await supabase
    .from("modules")
    .select(
      "*, lessons(id, module_id, title, description, content_type, duration_seconds, position, is_free_preview)",
    )
    .eq("course_id", course.id)
    .order("position", { ascending: true })

  const sortedModules = (modules ?? []).map((mod) => ({
    ...mod,
    lessons: [...(mod.lessons as unknown[])].sort(
      (a: unknown, b: unknown) =>
        (a as { position: number }).position -
        (b as { position: number }).position,
    ),
  }))

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl">
        {course.thumbnail_url ? (
          <div className="relative aspect-[21/9]">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="size-16 text-primary/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-4">
        <h1 className="font-heading text-2xl font-bold">{course.title}</h1>
        {course.description && (
          <p className="text-sm text-muted-foreground">{course.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {profile.avatar_url && (
                <AvatarImage src={profile.avatar_url} />
              )}
              <AvatarFallback>
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <span>{profile.full_name ?? "Anônimo"}</span>
          </div>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {course.total_lessons} aula{course.total_lessons !== 1 ? "s" : ""}
          </span>
          {course.total_duration_seconds > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatDuration(course.total_duration_seconds)}
            </span>
          )}
        </div>
      </div>

      {/* Client section: enroll + curriculum */}
      <CourseDetailClient
        courseId={course.id}
        courseSlug={courseSlug}
        orgSlug={orgSlug}
        modules={sortedModules}
      />
    </div>
  )
}
