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
      <div className={cn("space-y-1.5", className)}>
        <div className="h-1.5 w-full overflow-hidden rounded-[2px] border border-line bg-paper-2">
          <div className="h-full w-full bg-gold" />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid tabular-nums">
          <span>{currentPoints.toLocaleString("pt-BR")} creditos</span>
          <span>tier maximo</span>
        </div>
      </div>
    )
  }

  const percent = Math.min(
    Math.round((currentPoints / nextLevelPoints) * 100),
    100,
  )
  const remaining = Math.max(nextLevelPoints - currentPoints, 0)

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-[2px] border border-line bg-paper-2">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid tabular-nums">
        <span>{currentPoints.toLocaleString("pt-BR")} creditos</span>
        <span>
          {remaining > 0
            ? `${remaining.toLocaleString("pt-BR")} pro proximo tier`
            : "tier maximo"}
        </span>
      </div>
    </div>
  )
}
