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
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full overflow-hidden rounded-sm border border-line bg-paper-2",
          size === "sm" && "h-1.5",
          size === "md" && "h-2",
          size === "lg" && "h-2.5",
        )}
      >
        <div
          className="h-full bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="wf-mono shrink-0 tabular-nums !text-ink-mid">
          {percent}%
        </span>
      )}
    </div>
  )
}
