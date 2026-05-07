"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LevelBadge } from "./LevelBadge"
import { XPBar } from "./XPBar"
import { useUserStats } from "@/hooks/useUserStats"
import { Trophy, Sparkles, TrendingUp } from "lucide-react"

interface StatsCardProps {
  orgId: string
  userId: string
}

export function StatsCard({ orgId, userId }: StatsCardProps) {
  const { data: stats, isLoading } = useUserStats(orgId, userId)

  if (isLoading || !stats) {
    return (
      <Card>
        <CardContent className="space-y-3 py-4">
          <div className="h-16 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <LevelBadge
            level={stats.level}
            name={stats.level_name}
            size="md"
            showName
          />
          {stats.rank !== null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <TrendingUp className="size-3.5" />#{stats.rank}
            </span>
          )}
        </div>

        <XPBar
          currentPoints={stats.points}
          nextLevelPoints={stats.next_level_points}
        />

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              <Sparkles className="size-3" />
              Pontos
            </div>
            <p className="font-mono text-base font-semibold tabular-nums">
              {stats.points.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              <Trophy className="size-3" />
              Conquistas
            </div>
            <p className="font-mono text-base font-semibold tabular-nums">
              {stats.achievements_count}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
