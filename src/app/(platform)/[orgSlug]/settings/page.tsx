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
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
      <OrgSettingsForm org={org} />
    </div>
  )
}
