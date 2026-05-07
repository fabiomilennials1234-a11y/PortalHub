import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Calendar, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { EventCard } from "@/components/events/EventCard"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { EventWithHost } from "@/types/domain"

export const metadata = { title: "Eventos" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

async function fetchEvents(
  orgId: string,
  status: "upcoming" | "ended",
): Promise<EventWithHost[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*, host:host_id(full_name, avatar_url)")
    .eq("org_id", orgId)
    .eq("status", status)
    .order("starts_at", { ascending: status === "upcoming" })
  return (data ?? []) as unknown as EventWithHost[]
}

export default async function EventsPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  const { data: membership } = user
    ? await supabase
        .from("memberships")
        .select("role")
        .eq("user_id", user.id)
        .eq("org_id", org.id)
        .single()
    : { data: null }

  const isModerator =
    membership && ["owner", "admin", "moderator"].includes(membership.role)

  const [upcoming, past] = await Promise.all([
    fetchEvents(org.id, "upcoming"),
    fetchEvents(org.id, "ended"),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-lg font-semibold">Eventos</h1>
        {isModerator && (
          <Link
            className={buttonVariants({ size: "default" })}
            href={`/${orgSlug}/events/new`}
          >
            <Plus className="size-4" />
            Novo evento
          </Link>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Próximos ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Passados ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Nenhum evento próximo"
              description="Eventos agendados aparecerão aqui."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} orgSlug={orgSlug} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Nenhum evento passado.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.id} event={e} orgSlug={orgSlug} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

    </div>
  )
}
