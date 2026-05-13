"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"
import { useUserStats } from "@/hooks/useUserStats"
import { useAuth } from "@/hooks/useAuth"

interface JourneyCardProps {
  orgId: string
  orgSlug: string
}

export function JourneyCard({ orgId, orgSlug }: JourneyCardProps) {
  const { data: auth } = useAuth()
  const userId = auth?.user?.id ?? ""
  const { data: stats, isLoading } = useUserStats(orgId, userId)

  if (!userId) return null

  const percent =
    stats?.next_level_points && stats.next_level_points > 0
      ? Math.min(
          Math.round((stats.points / stats.next_level_points) * 100),
          100,
        )
      : 100

  return (
    <div className="wf-box p-4">
      <div className="flex items-center justify-between">
        <span className="wf-mono">Seu progresso</span>
        {stats?.rank && (
          <Link
            href={`/${orgSlug}/leaderboard`}
            className="wf-mono inline-flex items-center gap-1 !text-gold-dk hover:opacity-80"
          >
            <Trophy className="h-3 w-3" />#{stats.rank}
          </Link>
        )}
      </div>

      {isLoading || !stats ? (
        <div className="mt-3 space-y-2">
          <div className="animate-shimmer h-3 w-2/3 rounded bg-gradient-to-r from-paper-2 via-line-faint to-paper-2" />
          <div className="animate-shimmer h-2 w-full rounded bg-gradient-to-r from-paper-2 via-line-faint to-paper-2" />
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-paper px-2.5 py-1">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border border-gold bg-gold-bg font-serif text-[12px] font-semibold leading-none text-gold-dk">
                {stats.level}
              </span>
              <span className="wf-mono !text-[10.5px]">TIER {stats.level}</span>
            </span>
            <span className="wf-mono !text-ink-mid">
              {stats.points.toLocaleString("pt-BR")} créditos
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-border bg-paper">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="wf-mono flex items-center justify-between !text-[10px]">
              <span>{stats.level_name}</span>
              {stats.next_level_points ? (
                <span>
                  {Math.max(stats.next_level_points - stats.points, 0)} pro tier {stats.level + 1}
                </span>
              ) : (
                <span className="!text-gold-dk">MAX</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
