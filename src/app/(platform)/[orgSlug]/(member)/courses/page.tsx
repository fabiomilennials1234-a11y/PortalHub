import { createClient } from "@/lib/supabase/server"
import { BookOpen } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import { CourseCard } from "@/components/courses/CourseCard"
import type { CourseWithAuthor } from "@/types/domain"

export const metadata = { title: "Cursos" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function CoursesPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) return null

  const { data: courses } = await supabase
    .from("courses")
    .select("*, profiles:author_id(full_name, avatar_url)")
    .eq("org_id", org.id)
    .eq("status", "published")
    .order("position", { ascending: true })

  const typedCourses = (courses ?? []) as unknown as CourseWithAuthor[]

  if (typedCourses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Nenhum curso disponível"
        description="Cursos publicados aparecerão aqui."
      />
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-lg font-semibold">Cursos</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {typedCourses.map((course) => (
          <CourseCard key={course.id} course={course} orgSlug={orgSlug} />
        ))}
      </div>
    </div>
  )
}
