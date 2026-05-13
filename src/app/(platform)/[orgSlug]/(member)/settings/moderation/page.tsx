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
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-2 border-b border-line pb-6">
        <p className="wf-mono">Moderação · denúncias</p>
        <h1 className="font-serif text-[32px] font-semibold leading-none tracking-tight text-foreground">
          Moderação
        </h1>
        <p className="wf-mono">
          o que sua comunidade reportou — revise e decida
        </p>
      </header>
      <ReportsList orgId={org.id} />
    </div>
  )
}
