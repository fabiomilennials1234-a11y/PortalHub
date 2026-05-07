import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { JoinButton } from "./JoinButton"

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function JoinPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, description, logo_url, settings")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  const joinMode = (org.settings as Record<string, unknown>)?.join_mode

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{org.name}</h1>
          {org.description && (
            <p className="text-sm text-muted-foreground">{org.description}</p>
          )}
        </div>
        {joinMode === "open" ? (
          <JoinButton orgId={org.id} orgSlug={org.slug} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Esta comunidade aceita membros apenas por convite.
          </p>
        )}
      </div>
    </div>
  )
}
