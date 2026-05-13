"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { GradientAvatar } from "@/components/shared/GradientAvatar"

interface LeaderboardMiniProps {
  orgId: string
  orgSlug: string
}

export function LeaderboardMini({ orgId, orgSlug }: LeaderboardMiniProps) {
  const { data, isLoading } = useLeaderboard(orgId, 5)

  return (
    <div className="wf-box p-4">
      <div className="flex items-center justify-between">
        <span className="wf-mono">Em alta hoje</span>
        <Link
          href={`/${orgSlug}/leaderboard`}
          className="wf-mono inline-flex items-center gap-1 hover:!text-foreground"
        >
          Ver tudo
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <ul className="mt-3 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="animate-shimmer h-5 rounded bg-gradient-to-r from-paper-2 via-line-faint to-paper-2"
            />
          ))}
        </ul>
      ) : (data ?? []).length === 0 ? (
        <p className="mt-3 font-serif text-[13px] italic text-ink-mid">
          Sem ranking ainda. Comece a interagir.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {(data ?? []).map((entry) => (
            <li key={entry.user_id} className="flex items-center gap-2.5">
              <span className="font-serif text-[15px] text-gold-dk tabular-nums">
                {entry.rank}
              </span>
              <GradientAvatar
                userId={entry.user_id}
                name={entry.profile.full_name}
                avatarUrl={entry.profile.avatar_url}
                size={22}
                ringClassName="ring-1 ring-border"
              />
              <span className="flex-1 truncate text-[12.5px] text-foreground">
                {entry.profile.full_name ?? "Anônimo"}
              </span>
              <span className="wf-mono !text-[10.5px] !text-ink-soft">
                {entry.points.toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
