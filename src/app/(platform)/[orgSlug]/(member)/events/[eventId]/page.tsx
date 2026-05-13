import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, Users, MapPin, ExternalLink } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { EventRSVPButton } from "@/components/events/EventRSVPButton"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ orgSlug: string; eventId: string }>
}

type EventStatus = "upcoming" | "live" | "ended" | "cancelled"

const STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: "Em breve",
  live: "Ao vivo",
  ended: "Finalizado",
  cancelled: "Cancelado",
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
}

function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export async function generateMetadata({ params }: Props) {
  const { eventId } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("id", eventId)
    .single()
  return { title: event?.title ?? "Evento" }
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*, host:host_id(full_name, avatar_url)")
    .eq("id", eventId)
    .single()

  if (!event) notFound()

  const host = event.host as {
    full_name: string | null
    avatar_url: string | null
  }

  const status = event.status as EventStatus
  const statusPillClass =
    status === "live"
      ? "wf-pill wf-pill--gold"
      : status === "ended"
        ? "wf-pill opacity-60"
        : "wf-pill"

  return (
    <article className="space-y-8">
      <div className="relative overflow-hidden rounded-md border border-line">
        {event.cover_url ? (
          <div className="relative aspect-[21/9]">
            <Image
              src={event.cover_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center bg-paper-2">
            <Calendar className="size-16 text-ink-low" />
          </div>
        )}
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-serif text-[32px] font-semibold leading-tight tracking-tight text-foreground">
            {event.title}
          </h1>
          <span
            className={cn(
              statusPillClass,
              "flex-none text-[10px] uppercase tracking-[0.08em]",
            )}
          >
            {status === "live" && (
              <span className="size-1.5 animate-pulse rounded-full bg-gold-dk" />
            )}
            {STATUS_LABELS[status]}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-ink-mid">
          <Avatar size="sm">
            {host.avatar_url && <AvatarImage src={host.avatar_url} />}
            <AvatarFallback>{getInitials(host.full_name)}</AvatarFallback>
          </Avatar>
          <span>
            Apresentado por{" "}
            <span className="text-foreground">{host.full_name ?? "Anônimo"}</span>
          </span>
        </div>
      </header>

      <div className="wf-box space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 size-4 shrink-0 text-ink-low" />
          <div className="space-y-0.5">
            <p className="text-[14px] font-medium text-foreground">
              {formatDateTime(event.starts_at)}
            </p>
            <p className="wf-mono">até {formatDateTime(event.ends_at)}</p>
          </div>
        </div>

        {event.location_label && (
          <div className="flex items-center gap-3 text-[14px] text-foreground">
            <MapPin className="size-4 shrink-0 text-ink-low" />
            <span>{event.location_label}</span>
          </div>
        )}

        {event.location_url && (
          <div className="flex items-center gap-3 text-[14px]">
            <ExternalLink className="size-4 shrink-0 text-ink-low" />
            <a
              href={event.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.06em] text-gold-dk hover:underline"
            >
              Acessar evento →
            </a>
          </div>
        )}

        <div className="flex items-center gap-3 text-[14px] text-foreground">
          <Users className="size-4 shrink-0 text-ink-low" />
          <span>
            {event.attendees_count}
            {event.max_attendees ? ` / ${event.max_attendees}` : ""} inscritos
          </span>
        </div>
      </div>

      <EventRSVPButton eventId={eventId} />

      {event.description && (
        <section className="space-y-3 border-t border-line pt-6">
          <p className="wf-mono">Sobre o evento</p>
          <p className="whitespace-pre-wrap font-serif text-[16px] leading-relaxed text-ink-soft">
            {event.description}
          </p>
        </section>
      )}
    </article>
  )
}
