"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

interface LeaderboardTableProps {
  orgId: string
  orgSlug: string
  limit?: number
}

type RangeFilter = "week" | "month" | "all"

const FILTERS: ReadonlyArray<{ id: RangeFilter; label: string }> = [
  { id: "week", label: "Essa semana" },
  { id: "month", label: "Mes" },
  { id: "all", label: "Todo" },
]

/**
 * Visual-only delta inferred from a stable hash of the user id. Keeps the
 * leaderboard rows feeling alive while the real "points earned this week"
 * pipeline is not yet wired.
 */
function mockDelta(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0
  }
  const span = 380 // 400 - 20
  return 20 + (Math.abs(hash) % (span + 1))
}

export function LeaderboardTable({
  orgId,
  orgSlug,
  limit = 50,
}: LeaderboardTableProps) {
  const [range, setRange] = useState<RangeFilter>("week")
  const { data, isLoading } = useLeaderboard(orgId, limit)
  const { data: auth } = useAuth()

  return (
    <div className="space-y-3">
      {/* Range filter pills — visual only for now. */}
      <div className="flex items-center gap-2">
        {FILTERS.map((f) => {
          const active = f.id === range
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setRange(f.id)}
              className={cn(
                "wf-pill text-[11.5px]",
                active ? "wf-pill--gold" : "wf-pill--ghost",
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-5 animate-spin text-ink-low" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="wf-box py-12 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
          nenhum participante ainda
        </div>
      ) : (
        <div className="wf-box overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[56px_1fr_110px_80px_110px] items-center gap-3 border-b border-line bg-paper-2 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
            <span>rank</span>
            <span>membro</span>
            <span className="text-right">tier</span>
            <span className="text-right">delta</span>
            <span className="text-right">creditos</span>
          </div>

          {/* Rows */}
          <ul>
            {data.map((entry, idx) => {
              const isCurrent = auth?.user?.id === entry.user_id
              const isLast = idx === data.length - 1
              const delta = mockDelta(entry.user_id)

              return (
                <li
                  key={entry.user_id}
                  className={cn(
                    "border-b border-line-faint last:border-b-0",
                    isLast && "border-b-0",
                  )}
                >
                  <Link
                    href={`/${orgSlug}/members/${entry.user_id}`}
                    className={cn(
                      "grid grid-cols-[56px_1fr_110px_80px_110px] items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-2",
                      isCurrent && "bg-gold-bg/40",
                    )}
                  >
                    <span
                      className={cn(
                        "font-serif text-[20px] font-semibold tabular-nums leading-none",
                        entry.rank <= 3 ? "text-gold-dk" : "text-ink-soft",
                      )}
                    >
                      {entry.rank}
                    </span>

                    <div className="flex min-w-0 items-center gap-3">
                      <GradientAvatar
                        userId={entry.user_id}
                        name={entry.profile.full_name}
                        avatarUrl={entry.profile.avatar_url}
                        size={32}
                        ringClassName="ring-1 ring-line"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-[15px] font-medium tracking-[-0.005em]">
                          {entry.profile.full_name ?? "Anonimo"}
                        </p>
                        {isCurrent && (
                          <span className="mt-0.5 inline-block font-mono text-[9.5px] uppercase tracking-[0.08em] text-gold-dk">
                            voce
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-right font-mono text-[11px] uppercase tracking-[0.06em] tabular-nums text-ink-soft">
                      tier {entry.level}
                    </span>

                    <span className="text-right font-mono text-[11px] uppercase tracking-[0.06em] tabular-nums text-success">
                      +{delta}
                    </span>

                    <span className="flex items-baseline justify-end gap-1.5">
                      <span className="font-serif text-[15px] font-semibold tabular-nums leading-none">
                        {entry.points.toLocaleString("pt-BR")}
                      </span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink-mid leading-none">
                        cred.
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
