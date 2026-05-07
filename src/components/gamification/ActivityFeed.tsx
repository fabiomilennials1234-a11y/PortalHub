"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PointsDisplay } from "./PointsDisplay"
import { useActivityLog } from "@/hooks/useActivityLog"
import { Loader2, MessageSquare, FileText, Heart, BookOpen, LogIn } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ActivityFeedProps {
  orgId: string
  userId?: string
  limit?: number
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

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  )
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
  daily_login: { icon: LogIn, label: "login diário" },
}

export function ActivityFeed({ orgId, userId, limit = 30 }: ActivityFeedProps) {
  const { data, isLoading } = useActivityLog({ orgId, userId, limit })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma atividade ainda.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((entry) => {
        const meta = ACTION_LABELS[entry.action] ?? {
          icon: FileText,
          label: entry.action,
        }
        const Icon = meta.icon

        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/30"
          >
            <Avatar size="sm">
              {entry.profile.avatar_url && (
                <AvatarImage src={entry.profile.avatar_url} />
              )}
              <AvatarFallback>
                {getInitials(entry.profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 items-center gap-2 text-sm">
              <span className="font-medium">
                {entry.profile.full_name ?? "Anônimo"}
              </span>
              <Icon className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{meta.label}</span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {timeAgo(entry.created_at)}
            </span>
            <PointsDisplay points={entry.points} size="sm" />
          </div>
        )
      })}
    </div>
  )
}
