"use client"

import { useActivityLog } from "@/hooks/useActivityLog"
import {
  Loader2,
  MessageSquare,
  FileText,
  Heart,
  BookOpen,
  LogIn,
  Activity,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ActivityFeedProps {
  orgId: string
  userId?: string
  limit?: number
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "agora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

const ACTION_LABELS: Record<string, { icon: LucideIcon; label: string }> = {
  post_created: { icon: FileText, label: "criou um post" },
  comment_created: { icon: MessageSquare, label: "comentou" },
  reaction_given: { icon: Heart, label: "reagiu" },
  lesson_completed: { icon: BookOpen, label: "completou uma aula" },
  daily_login: { icon: LogIn, label: "login diario" },
}

export function ActivityFeed({ orgId, userId, limit = 30 }: ActivityFeedProps) {
  const { data, isLoading } = useActivityLog({ orgId, userId, limit })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-ink-low" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
        nenhuma atividade ainda
      </div>
    )
  }

  return (
    <ul className="divide-y divide-line-faint">
      {data.map((entry) => {
        const meta = ACTION_LABELS[entry.action] ?? {
          icon: Activity,
          label: entry.action,
        }
        const Icon = meta.icon

        return (
          <li
            key={entry.id}
            className="flex items-center gap-3 px-1 py-2.5"
          >
            <Icon
              className="size-[14px] shrink-0 text-ink-low"
              strokeWidth={1.5}
            />
            <p className="flex-1 truncate text-[13px] text-ink-soft">
              <span className="font-medium text-foreground">
                {entry.profile.full_name ?? "Anonimo"}
              </span>{" "}
              <span className="text-ink-mid">{meta.label}</span>
            </p>
            {entry.points > 0 && (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] tabular-nums text-gold-dk">
                +{entry.points}
              </span>
            )}
            <span className="w-12 text-right font-mono text-[10px] uppercase tracking-[0.06em] tabular-nums text-ink-low">
              {timeAgo(entry.created_at)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
