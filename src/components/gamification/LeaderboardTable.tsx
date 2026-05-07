"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LevelBadge } from "./LevelBadge"
import { PointsDisplay } from "./PointsDisplay"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, Trophy, Medal } from "lucide-react"

interface LeaderboardTableProps {
  orgId: string
  orgSlug: string
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

const RANK_ICONS: Record<number, string> = {
  1: "text-amber-400",
  2: "text-slate-400",
  3: "text-orange-600",
}

export function LeaderboardTable({
  orgId,
  orgSlug,
  limit = 50,
}: LeaderboardTableProps) {
  const { data, isLoading } = useLeaderboard(orgId, limit)
  const { data: auth } = useAuth()

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
        Nenhum participante ainda.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      {data.map((entry) => {
        const isCurrent = auth?.user?.id === entry.user_id
        const isTop3 = entry.rank <= 3

        return (
          <Link
            key={entry.user_id}
            href={`/${orgSlug}/members/${entry.user_id}`}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50",
              isCurrent && "border-primary/30 bg-primary/5",
            )}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium tabular-nums",
                isTop3
                  ? "bg-muted"
                  : "bg-muted/40 text-muted-foreground",
              )}
            >
              {isTop3 ? (
                entry.rank === 1 ? (
                  <Trophy className={cn("size-4", RANK_ICONS[entry.rank])} />
                ) : (
                  <Medal className={cn("size-4", RANK_ICONS[entry.rank])} />
                )
              ) : (
                `#${entry.rank}`
              )}
            </div>
            <Avatar size="sm">
              {entry.profile.avatar_url && (
                <AvatarImage src={entry.profile.avatar_url} />
              )}
              <AvatarFallback>
                {getInitials(entry.profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">
                {entry.profile.full_name ?? "Anônimo"}
              </p>
            </div>
            <LevelBadge level={entry.level} size="sm" />
            <PointsDisplay points={entry.points} size="sm" />
          </Link>
        )
      })}
    </div>
  )
}
