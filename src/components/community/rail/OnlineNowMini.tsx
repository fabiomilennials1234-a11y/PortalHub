"use client"

import { useMembers } from "@/hooks/useMembers"
import { GradientAvatar } from "@/components/shared/GradientAvatar"

interface OnlineNowMiniProps {
  orgId: string
}

// TODO: substituir por Realtime Presence em sprint pos-MVP.
export function OnlineNowMini({ orgId }: OnlineNowMiniProps) {
  const { data, isLoading } = useMembers(orgId)
  const top = (data ?? []).slice(0, 5)
  const totalActive = data?.length ?? 0
  const extra = Math.max(totalActive - top.length, 0)

  return (
    <div className="wf-box p-4">
      <span className="wf-mono flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_currentColor]" />
        Ativos agora
      </span>

      {isLoading ? (
        <div className="mt-3 flex -space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer size-6 rounded-full bg-gradient-to-r from-paper-2 via-line-faint to-paper-2 ring-2 ring-paper"
            />
          ))}
        </div>
      ) : top.length === 0 ? (
        <p className="mt-3 font-serif text-[13px] italic text-ink-mid">
          Sem membros ativos.
        </p>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {top.map((m) => (
              <GradientAvatar
                key={m.user_id}
                userId={m.user_id}
                name={m.profile?.full_name ?? null}
                avatarUrl={m.profile?.avatar_url ?? null}
                size={26}
                ringClassName="ring-2 ring-paper"
              />
            ))}
          </div>
          {extra > 0 && (
            <span className="wf-mono !text-[10.5px]">
              +{extra} {extra === 1 ? "membro" : "membros"}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
