import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { OrgSettingsForm } from "./OrgSettingsForm"

export const metadata = { title: "Configurações" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
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
    redirect(`/${orgSlug}/community`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header className="space-y-2 border-b border-line pb-6">
        <p className="wf-mono">Organização · admin</p>
        <h1 className="font-serif text-[32px] font-semibold leading-none tracking-tight text-foreground">
          Configurações
        </h1>
        <p className="wf-mono">o que os membros veem da sua comunidade</p>
      </header>
      <section className="wf-box space-y-4 p-6">
        <div className="space-y-1 border-b border-line-soft pb-4">
          <h2 className="font-serif text-[18px] font-semibold text-foreground">
            Identidade
          </h2>
          <p className="wf-mono">Nome, descrição e logo da organização</p>
        </div>
        <OrgSettingsForm org={org} />
      </section>
    </div>
  )
}
