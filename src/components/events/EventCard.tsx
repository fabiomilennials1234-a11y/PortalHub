import Link from "next/link"
import { Users, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
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

const MONTH_CAPS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const

function formatTime(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function formatWeekday(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(new Date(date))
    .replace(".", "")
    .toUpperCase()
}

export function EventCard({ event, orgSlug }: EventCardProps) {
  const start = new Date(event.starts_at)
  const day = String(start.getDate()).padStart(2, "0")
  const month = MONTH_CAPS[start.getMonth()]
  const weekday = formatWeekday(event.starts_at)
  const time = formatTime(event.starts_at)
  const status = event.status

  const statusPillClass =
    status === "live"
      ? "wf-pill wf-pill--gold"
      : status === "ended"
        ? "wf-pill opacity-60"
        : status === "cancelled"
          ? "wf-pill"
          : "wf-pill"

  return (
    <Link
      href={`/${orgSlug}/events/${event.id}`}
      className="block focus:outline-none"
    >
      <article
        className={cn(
          "wf-box wf-box--hover relative flex gap-4 p-4 transition-colors",
          status === "ended" && "opacity-80",
        )}
      >
        <div className="flex h-14 w-14 flex-none flex-col items-center justify-center gap-0 rounded-md border border-line bg-paper-2 leading-none">
          <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-gold-dk">
            {month}
          </span>
          <span className="font-serif text-[22px] font-semibold leading-none text-foreground">
            {day}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-serif text-[17px] font-semibold leading-tight text-foreground">
              {event.title}
            </h3>
            <span
              className={cn(
                statusPillClass,
                "flex-none whitespace-nowrap text-[10px] uppercase tracking-[0.08em]",
              )}
            >
              {status === "live" && (
                <span className="size-1.5 animate-pulse rounded-full bg-gold-dk" />
              )}
              {STATUS_LABELS[status]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="wf-mono">
              {weekday} · {time}
            </span>
            <span className="wf-mono inline-flex items-center gap-1">
              <Users className="size-3 text-ink-low" />
              {event.attendees_count}
              {event.max_attendees ? ` / ${event.max_attendees}` : ""}{" "}
              confirmados
            </span>
          </div>

          {event.location_label && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-ink-mid">
              <MapPin className="size-3 shrink-0 text-ink-low" />
              <span className="truncate">{event.location_label}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
