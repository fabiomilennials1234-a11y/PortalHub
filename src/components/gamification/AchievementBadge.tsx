import { cn } from "@/lib/utils"
import { Trophy, Flame, Star, Award } from "lucide-react"
import type { AchievementType } from "@/types/domain"

interface AchievementBadgeProps {
  type: AchievementType
  earned?: boolean
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
  color,
  size = "md",
  className,
}: AchievementBadgeProps) {
  const Icon = ICONS[type] ?? Award
  const finalColor = color ?? "#fbbf24"

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all",
        size === "sm" && "size-7",
        size === "md" && "size-10",
        size === "lg" && "size-14",
        earned ? "shadow-md" : "opacity-30 grayscale",
        className,
      )}
      style={{
        backgroundColor: earned
          ? `color-mix(in oklch, ${finalColor} 20%, transparent)`
          : "var(--muted)",
        color: earned ? finalColor : "var(--muted-foreground)",
      }}
    >
      <Icon
        className={cn(
          size === "sm" && "size-3.5",
          size === "md" && "size-5",
          size === "lg" && "size-7",
        )}
      />
    </div>
  )
}
