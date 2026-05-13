"use client"

import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { useEvents } from "@/hooks/useEvents"

interface UpcomingEventsMiniProps {
  orgId: string
  orgSlug: string
}

const MONTH_PT = [
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
]

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function UpcomingEventsMini({
  orgId,
  orgSlug,
}: UpcomingEventsMiniProps) {
  const { data, isLoading } = useEvents({ orgId, status: "upcoming" })
  const events = (data ?? []).slice(0, 2)

  return (
    <div className="wf-box p-4">
      <div className="flex items-center justify-between">
        <span className="wf-mono">Eventos · essa semana</span>
        <Link
          href={`/${orgSlug}/events`}
          className="wf-mono inline-flex items-center gap-1 hover:!text-foreground"
        >
          Ver todos
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-3 space-y-2">
          <div className="animate-shimmer h-12 rounded bg-gradient-to-r from-paper-2 via-line-faint to-paper-2" />
          <div className="animate-shimmer h-12 rounded bg-gradient-to-r from-paper-2 via-line-faint to-paper-2" />
        </div>
      ) : events.length === 0 ? (
        <div className="mt-3 flex items-center gap-2 font-serif text-[13px] italic text-ink-mid">
          <Calendar className="h-3.5 w-3.5" />
          Nenhum evento agendado.
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((evt) => {
            const d = new Date(evt.starts_at)
            return (
              <li key={evt.id}>
                <Link
                  href={`/${orgSlug}/events/${evt.id}`}
                  className="wf-box wf-box--hover flex items-center gap-3 p-2.5"
                >
                  <div className="flex w-10 shrink-0 flex-col items-center rounded-sm border border-border bg-paper-2 py-1 leading-tight">
                    <span className="wf-mono !text-[9px] !text-gold-dk">
                      {MONTH_PT[d.getMonth()]}
                    </span>
                    <span className="font-serif text-[16px] font-semibold tabular-nums text-foreground">
                      {d.getDate().toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium text-foreground">
                      {evt.title}
                    </p>
                    <p className="wf-mono mt-0.5 !text-[10px]">
                      {formatTime(evt.starts_at)}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
