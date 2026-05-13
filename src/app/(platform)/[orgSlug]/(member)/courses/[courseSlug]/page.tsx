import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { BookOpen } from "lucide-react"
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
    <div className="mx-auto w-full max-w-7xl space-y-10">
      {/* Hero — editorial */}
      <header className="space-y-6">
        <div className="wf-box overflow-hidden">
          {course.thumbnail_url ? (
            <div className="relative aspect-[21/9]">
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[21/9] items-center justify-center bg-paper-2">
              <BookOpen
                className="size-16 text-ink-low"
                strokeWidth={1}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <span className="wf-mono">CURSO</span>
          <h1 className="wf-hand text-[42px] sm:text-[52px]">{course.title}</h1>
          {course.description && (
            <p className="max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
              {course.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                <AvatarFallback>
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[13px] text-ink-soft">
                {profile.full_name ?? "Anônimo"}
              </span>
            </div>
            <span aria-hidden className="text-ink-low">·</span>
            <span className="wf-mono">
              {course.total_lessons}{" "}
              {course.total_lessons === 1 ? "AULA" : "AULAS"}
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
      </header>

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
