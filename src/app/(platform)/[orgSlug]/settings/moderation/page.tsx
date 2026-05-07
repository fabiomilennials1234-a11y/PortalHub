import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ReportsList } from "@/components/moderation/ReportsList"

export const metadata = { title: "Moderação" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function ModerationPage({ params }: Props) {
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

  if (
    !membership ||
    !["owner", "admin", "moderator"].includes(membership.role)
  ) {
    redirect(`/${orgSlug}/community`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-lg font-semibold">Moderação</h1>
        <p className="text-xs text-muted-foreground">
          Denúncias enviadas pelos membros desta organização.
        </p>
      </div>
      <ReportsList orgId={org.id} />
    </div>
  )
}
