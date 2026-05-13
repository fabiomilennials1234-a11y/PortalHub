import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { CourseForm } from "@/components/courses/CourseForm"

export const metadata = { title: "Novo Curso" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function NewCoursePage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("org_id", org.id)
    .single()

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    redirect(`/${orgSlug}/courses`)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-3 border-b border-line-soft pb-6">
        <span className="wf-mono">CATÁLOGO · NOVO</span>
        <h1 className="wf-hand text-[36px]">Novo Curso</h1>
        <p className="text-[13.5px] leading-[1.6] text-ink-mid">
          Comece pelo título — descrição, módulos e aulas podem ser adicionados
          depois.
        </p>
      </header>
      <CourseForm orgId={org.id} orgSlug={orgSlug} />
    </div>
  )
}
