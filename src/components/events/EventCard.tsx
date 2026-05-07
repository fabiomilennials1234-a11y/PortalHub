import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EventWithHost } from "@/types/domain"

interface EventCardProps {
  event: EventWithHost
  orgSlug: string
}

const STATUS_LABELS = {
  upcoming: "Em breve",
  live: "Ao vivo",
  ended: "Finalizado",
  cancelled: "Cancelado",
} as const

const STATUS_VARIANTS = {
  upcoming: "default",
  live: "destructive",
  ended: "secondary",
  cancelled: "outline",
} as const

function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function EventCard({ event, orgSlug }: EventCardProps) {
  return (
    <Link href={`/${orgSlug}/events/${event.id}`}>
      <Card className="group overflow-hidden transition-all hover:ring-2 hover:ring-primary/20">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {event.cover_url ? (
            <Image
              src={event.cover_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Calendar className="size-10 text-primary/40" />
            </div>
          )}
          <Badge
            variant={STATUS_VARIANTS[event.status]}
            className="absolute top-2 right-2"
          >
            {STATUS_LABELS[event.status]}
          </Badge>
        </div>
        <CardContent className="space-y-2">
          <h3 className="font-heading line-clamp-2 text-sm font-semibold leading-snug">
            {event.title}
          </h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              {formatEventDate(event.starts_at)}
            </div>
            {event.location_label && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3" />
                <span className="truncate">{event.location_label}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="size-3" />
              {event.attendees_count}
              {event.max_attendees ? ` / ${event.max_attendees}` : ""} inscritos
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
