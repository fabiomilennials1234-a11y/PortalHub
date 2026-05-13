import { cn } from "@/lib/utils"
import { Trophy, Flame, Star, Award } from "lucide-react"
import type { AchievementType } from "@/types/domain"

interface AchievementBadgeProps {
  type: AchievementType
  earned?: boolean
  /** Compatibility prop — preserved in signature, not rendered. */
  color?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const ICONS = {
  milestone: Trophy,
  streak: Flame,
  special: Star,
} as const

export function AchievementBadge({
  type,
  earned = false,
  size = "md",
  className,
}: AchievementBadgeProps) {
  const Icon = ICONS[type] ?? Award

  const ring =
    size === "sm" ? "size-10" : size === "lg" ? "size-16" : "size-14"
  const iconCls =
    size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-[22px]"

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-[1.5px] bg-paper transition-colors",
        earned
          ? "border-gold text-foreground"
          : "border-line-soft text-ink-low opacity-50",
        ring,
        className,
      )}
    >
      <Icon className={iconCls} strokeWidth={1.5} />
    </span>
  )
}
