import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { EventForm } from "@/components/events/EventForm"

export const metadata = { title: "Novo Evento" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function NewEventPage({ params }: Props) {
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
    redirect(`/${orgSlug}/events`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header className="space-y-2 border-b border-line pb-6">
        <p className="wf-mono">Criar agenda</p>
        <h1 className="font-serif text-[32px] font-semibold leading-none tracking-tight text-foreground">
          Novo evento
        </h1>
        <p className="wf-mono">defina o que sua comunidade vai viver</p>
      </header>
      <div className="wf-box p-6">
        <EventForm orgId={org.id} orgSlug={orgSlug} />
      </div>
    </div>
  )
}
