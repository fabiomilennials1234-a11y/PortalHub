"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { LevelBadge } from "./LevelBadge"
import { useLeaderboard } from "@/hooks/useLeaderboard"

interface LeaderboardPodiumProps {
  orgId: string
  orgSlug: string
}

/**
 * Editorial podium: top three members, visually anchored by the gold-bg first
 * place card. Falls back to a 1-2 slot layout when fewer members exist.
 */
export function LeaderboardPodium({ orgId, orgSlug }: LeaderboardPodiumProps) {
  const { data, isLoading } = useLeaderboard(orgId, 3)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="wf-box h-[148px] animate-pulse bg-paper-2"
          />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) return null

  // Reorder visually as 2 · 1 · 3 (classic podium) when there are 3+ entries.
  const top = data.slice(0, 3)
  const ordered =
    top.length === 3 ? [top[1], top[0], top[2]] : top

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ordered.map((entry) => {
        const isFirst = entry.rank === 1
        return (
          <Link
            key={entry.user_id}
            href={`/${orgSlug}/members/${entry.user_id}`}
            className={cn(
              "wf-box wf-box--hover flex flex-col gap-3 p-5",
              isFirst && "bg-gold-bg",
              !isFirst && entry.rank === 2 && "bg-paper-2",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-serif text-[32px] font-semibold tabular-nums leading-none",
                  isFirst ? "text-gold-dk" : "text-ink-soft",
                )}
              >
                {entry.rank}
              </span>
              <LevelBadge level={entry.level} size={isFirst ? "lg" : "md"} />
            </div>

            <div className="flex items-center gap-3">
              <GradientAvatar
                userId={entry.user_id}
                name={entry.profile.full_name}
                avatarUrl={entry.profile.avatar_url}
                size={isFirst ? 56 : 44}
                ringClassName={cn(
                  "ring-1",
                  isFirst ? "ring-gold" : "ring-line",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[18px] font-semibold tracking-[-0.005em]">
                  {entry.profile.full_name ?? "Anonimo"}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
                  tier {entry.level}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "font-serif text-[24px] font-semibold tabular-nums leading-none",
                  isFirst ? "text-gold-dk" : "text-foreground",
                )}
              >
                {entry.points.toLocaleString("pt-BR")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid leading-none">
                creditos
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
