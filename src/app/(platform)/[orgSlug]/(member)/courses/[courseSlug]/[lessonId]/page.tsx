import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { LessonPlayerClient } from "./LessonPlayerClient"

interface Props {
  params: Promise<{ orgSlug: string; courseSlug: string; lessonId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lessonId } = await params
  const supabase = await createClient()
  const { data: lesson } = await supabase
    .from("lessons")
    .select("title")
    .eq("id", lessonId)
    .single()
  return { title: lesson?.title ?? "Aula" }
}

export default async function LessonPlayerPage({ params }: Props) {
  const { orgSlug, courseSlug, lessonId } = await params
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

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single()

  if (!lesson) notFound()

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

  const allLessons = sortedModules.flatMap((m) => m.lessons) as unknown as {
    id: string
    position: number
  }[]
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1].id : null
  const nextLessonId =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1].id
      : null

  return (
    <LessonPlayerClient
      course={course as unknown as Parameters<typeof LessonPlayerClient>[0]["course"]}
      lesson={lesson as unknown as Parameters<typeof LessonPlayerClient>[0]["lesson"]}
      modules={sortedModules as unknown as Parameters<typeof LessonPlayerClient>[0]["modules"]}
      orgSlug={orgSlug}
      lessonId={lessonId}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
    />
  )
}
