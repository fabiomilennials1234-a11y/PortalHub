import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, Users, MapPin, ExternalLink } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EventRSVPButton } from "@/components/events/EventRSVPButton"

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

const STATUS_VARIANTS: Record<
  EventStatus,
  "default" | "destructive" | "secondary" | "outline"
> = {
  upcoming: "default",
  live: "destructive",
  ended: "secondary",
  cancelled: "outline",
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

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="relative overflow-hidden rounded-xl">
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
          <div className="flex aspect-[21/9] items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Calendar className="size-16 text-primary/30" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold">{event.title}</h1>
          <Badge variant={STATUS_VARIANTS[event.status as EventStatus]}>
            {STATUS_LABELS[event.status as EventStatus]}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar size="sm">
            {host.avatar_url && <AvatarImage src={host.avatar_url} />}
            <AvatarFallback>{getInitials(host.full_name)}</AvatarFallback>
          </Avatar>
          <span>Apresentado por {host.full_name ?? "Anônimo"}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">{formatDateTime(event.starts_at)}</p>
            <p className="text-xs text-muted-foreground">
              até {formatDateTime(event.ends_at)}
            </p>
          </div>
        </div>

        {event.location_label && (
          <div className="flex items-center gap-3">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span>{event.location_label}</span>
          </div>
        )}

        {event.location_url && (
          <div className="flex items-center gap-3">
            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
            <a
              href={event.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Acessar evento
            </a>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Users className="size-4 shrink-0 text-muted-foreground" />
          <span>
            {event.attendees_count}
            {event.max_attendees ? ` / ${event.max_attendees}` : ""} inscritos
          </span>
        </div>
      </div>

      <Separator />

      <EventRSVPButton eventId={eventId} />

      {event.description && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="font-heading text-sm font-semibold">Sobre</h2>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
