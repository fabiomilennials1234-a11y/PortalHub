import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  className,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          size === "sm" && "h-1.5",
          size === "md" && "h-2",
          size === "lg" && "h-3",
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {percent}%
        </span>
      )}
    </div>
  )
}
