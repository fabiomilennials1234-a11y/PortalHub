import { cn } from "@/lib/utils"

interface XPBarProps {
  currentPoints: number
  nextLevelPoints: number | null
  className?: string
}

export function XPBar({
  currentPoints,
  nextLevelPoints,
  className,
}: XPBarProps) {
  if (nextLevelPoints === null) {
    return (
      <div
        className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}
      >
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full bg-gradient-to-r from-amber-400 to-rose-400" />
        </div>
        <span className="shrink-0 tabular-nums">MAX</span>
      </div>
    )
  }

  const percent = Math.min(
    Math.round((currentPoints / nextLevelPoints) * 100),
    100,
  )
  const remaining = Math.max(nextLevelPoints - currentPoints, 0)

  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>{currentPoints.toLocaleString("pt-BR")} pts</span>
        <span>{remaining > 0 ? `${remaining.toLocaleString("pt-BR")} pra próximo nível` : "MAX"}</span>
      </div>
    </div>
  )
}
