import { createClient } from "@/lib/supabase/server"
import { BookOpen } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import { CourseCard } from "@/components/courses/CourseCard"
import { ContinueWatching } from "@/components/courses/ContinueWatching"
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

  const totalLessons = typedCourses.reduce(
    (acc, c) => acc + (c.total_lessons ?? 0),
    0,
  )

  return (
    <div className="space-y-8">
      {/* Editorial header */}
      <header className="space-y-3 border-b border-line-soft pb-6">
        <span className="wf-mono">CATÁLOGO</span>
        <h1 className="wf-hand text-[42px] sm:text-[48px]">Cursos</h1>
        <p className="wf-mono">
          {typedCourses.length}{" "}
          {typedCourses.length === 1 ? "CURSO" : "CURSOS"} · {totalLessons}{" "}
          {totalLessons === 1 ? "AULA" : "AULAS"}
        </p>
      </header>

      <ContinueWatching orgId={org.id} orgSlug={orgSlug} />

      <section className="space-y-4">
        <span className="wf-mono">TODOS OS CURSOS</span>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {typedCourses.map((course) => (
            <CourseCard key={course.id} course={course} orgSlug={orgSlug} />
          ))}
        </div>
      </section>
    </div>
  )
}
