"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import type { LeaderboardEntry } from "@/types/domain"

interface LeaderboardPodiumProps {
  orgId: string
  orgSlug: string
}

interface PodiumSlotProps {
  entry: LeaderboardEntry
  orgSlug: string
}

const HEIGHTS: Record<number, string> = {
  1: "h-48 sm:h-56 lg:h-64",
  2: "h-36 sm:h-44 lg:h-52",
  3: "h-28 sm:h-36 lg:h-44",
}

const BAR_STYLES: Record<number, string> = {
  1: "bg-ink text-paper",
  2: "bg-paper-2 text-foreground",
  3: "bg-gold-bg text-foreground",
}

function PodiumSlot({ entry, orgSlug }: PodiumSlotProps) {
  const isFirst = entry.rank === 1
  return (
    <Link
      href={`/${orgSlug}/members/${entry.user_id}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative inline-block">
        {isFirst && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 -rotate-6 text-[32px] leading-none sm:-top-8 sm:text-[40px]"
          >
            👑
          </span>
        )}
        <GradientAvatar
          userId={entry.user_id}
          name={entry.profile.full_name}
          avatarUrl={entry.profile.avatar_url}
          size={isFirst ? 96 : 80}
          ringClassName={cn(
            "ring-2",
            isFirst ? "ring-gold" : "ring-ink",
          )}
        />
      </div>

      <p
        className={cn(
          "mt-3 font-serif font-semibold tracking-[-0.005em] text-foreground transition-colors group-hover:text-gold-dk",
          isFirst ? "text-[22px] sm:text-[26px]" : "text-[18px] sm:text-[20px]",
        )}
      >
        {entry.profile.full_name ?? "Anonimo"}
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] tabular-nums text-ink-mid">
        {entry.points.toLocaleString("pt-BR")} cred.
      </p>

      <div
        className={cn(
          "mt-2.5 flex w-full items-center justify-center rounded-t-md border border-ink border-b-0",
          HEIGHTS[entry.rank],
          BAR_STYLES[entry.rank],
        )}
      >
        <span
          className={cn(
            "font-serif font-semibold leading-none tabular-nums",
            entry.rank === 1
              ? "text-[60px] sm:text-[76px] lg:text-[96px]"
              : "text-[44px] sm:text-[56px] lg:text-[72px]",
          )}
        >
          {entry.rank}
        </span>
      </div>
    </Link>
  )
}

/**
 * Editorial podium: top three members rendered as a classic 2-1-3 stage with
 * pillars of distinct heights, a crown for the first place, and the rank
 * numeral set in serif inside each bar.
 */
export function LeaderboardPodium({ orgId, orgSlug }: LeaderboardPodiumProps) {
  const { data, isLoading } = useLeaderboard(orgId, 3)

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[36, 28, 24].map((h, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="size-16 animate-pulse rounded-full bg-paper-2" />
            <div className="mt-3 h-4 w-24 animate-pulse rounded bg-paper-2" />
            <div
              className={cn(
                "mt-3 w-full animate-pulse rounded-t-md bg-paper-2",
                h === 36 && "h-36",
                h === 28 && "h-28",
                h === 24 && "h-24",
              )}
            />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) return null

  const top = data.slice(0, 3)
  // 2 · 1 · 3 visual order when we have a complete podium.
  const ordered =
    top.length === 3
      ? ([top[1], top[0], top[2]] as LeaderboardEntry[])
      : top

  return (
    <div className="grid grid-cols-3 items-end gap-4 sm:gap-6 lg:gap-10">
      {ordered.map((entry) => (
        <PodiumSlot key={entry.user_id} entry={entry} orgSlug={orgSlug} />
      ))}
    </div>
  )
}
