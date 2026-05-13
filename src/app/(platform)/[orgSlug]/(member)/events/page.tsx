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

  const now = new Date()
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  })
    .format(now)
    .toLowerCase()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div className="space-y-2">
          <p className="wf-mono">Agenda da comunidade</p>
          <h1 className="font-serif text-[32px] font-semibold leading-none tracking-tight text-foreground">
            Eventos
          </h1>
          <p className="wf-mono">{monthLabel}</p>
        </div>
        {isModerator && (
          <Link
            className={buttonVariants({ size: "default" })}
            href={`/${orgSlug}/events/new`}
          >
            <Plus className="size-4" />
            Novo evento
          </Link>
        )}
      </header>

      <Tabs defaultValue="upcoming" className="space-y-6">
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
            <p className="py-10 text-center font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mid">
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
