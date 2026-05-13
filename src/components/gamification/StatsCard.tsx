"use client"

import { LevelBadge } from "./LevelBadge"
import { XPBar } from "./XPBar"
import { useUserStats } from "@/hooks/useUserStats"

interface StatsCardProps {
  orgId: string
  userId: string
}

interface StatCellProps {
  label: string
  value: string
  unit?: string
}

function StatCell({ label, value, unit }: StatCellProps) {
  return (
    <div className="wf-box p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-serif text-[28px] font-semibold tabular-nums leading-none text-foreground">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid leading-none">
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}

export function StatsCard({ orgId, userId }: StatsCardProps) {
  const { data: stats, isLoading } = useUserStats(orgId, userId)

  if (isLoading || !stats) {
    return (
      <div className="wf-box space-y-4 p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-paper-2" />
        <div className="h-1.5 w-full animate-pulse rounded bg-paper-2" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 animate-pulse rounded bg-paper-2" />
          <div className="h-20 animate-pulse rounded bg-paper-2" />
          <div className="h-20 animate-pulse rounded bg-paper-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tier + XP bar */}
      <div className="wf-box space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <LevelBadge
            level={stats.level}
            name={stats.level_name}
            size="lg"
            showName
          />
          {stats.rank !== null && (
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid tabular-nums">
              posicao #{stats.rank}
            </span>
          )}
        </div>
        <XPBar
          currentPoints={stats.points}
          nextLevelPoints={stats.next_level_points}
        />
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCell
          label="creditos"
          value={stats.points.toLocaleString("pt-BR")}
          unit="acumulados"
        />
        <StatCell
          label="conquistas"
          value={stats.achievements_count.toLocaleString("pt-BR")}
          unit={stats.achievements_count === 1 ? "badge" : "badges"}
        />
        <StatCell
          label="tier"
          value={stats.level.toString()}
          unit={stats.level_name ?? undefined}
        />
      </div>
    </div>
  )
}
