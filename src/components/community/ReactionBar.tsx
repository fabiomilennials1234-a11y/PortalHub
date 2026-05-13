"use client"

import { cn } from "@/lib/utils"
import { useReactions } from "@/hooks/useReactions"
import { useAuth } from "@/hooks/useAuth"
import type { ReactionType } from "@/types/domain"
import { ThumbsUp, Heart, Lightbulb, Flame, type LucideIcon } from "lucide-react"

const REACTIONS: { type: ReactionType; icon: LucideIcon; label: string }[] = [
  { type: "like", icon: ThumbsUp, label: "util" },
  { type: "love", icon: Heart, label: "amei" },
  { type: "insightful", icon: Lightbulb, label: "insight" },
  { type: "fire", icon: Flame, label: "fogo" },
]

interface ReactionBarProps {
  targetType: "post" | "comment"
  targetId: string
  className?: string
}

export function ReactionBar({
  targetType,
  targetId,
  className,
}: ReactionBarProps) {
  const { data: auth } = useAuth()
  const { reactions, counts, toggle, isToggling } = useReactions({
    targetType,
    targetId,
  })

  const userReaction = reactions.find(
    (r) => r.user_id === auth?.user?.id,
  )?.reaction_type as ReactionType | undefined

  const disabled = isToggling || !auth?.user

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {REACTIONS.map(({ type, icon: Icon, label }) => {
        const count = counts[type]
        const isActive = userReaction === type

        return (
          <button
            key={type}
            type="button"
            disabled={disabled}
            onClick={() => toggle(type)}
            aria-pressed={isActive}
            aria-label={label}
            className={cn(
              "wf-pill transition-colors",
              "hover:border-ink-low",
              isActive && "wf-pill--accent",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <Icon
              className={cn(
                "h-3 w-3",
                isActive ? "text-paper" : "text-ink-mid",
              )}
            />
            {count > 0 && (
              <span className="tabular-nums">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
