"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useReactions } from "@/hooks/useReactions"
import { useAuth } from "@/hooks/useAuth"
import type { ReactionType } from "@/types/domain"

const REACTIONS: { type: ReactionType; emoji: string }[] = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "insightful", emoji: "💡" },
  { type: "fire", emoji: "🔥" },
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

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {REACTIONS.map(({ type, emoji }) => {
        const count = counts[type]
        const isActive = userReaction === type

        return (
          <Button
            key={type}
            variant={isActive ? "secondary" : "ghost"}
            size="xs"
            disabled={isToggling || !auth?.user}
            onClick={() => toggle(type)}
            className={cn(
              "gap-1 text-xs",
              isActive && "ring-1 ring-primary/30",
            )}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span className="tabular-nums">{count}</span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
