import { cn } from "@/lib/utils"

interface PointsDisplayProps {
  points: number
  size?: "sm" | "md" | "lg"
  className?: string
  /**
   * When `true` the "creditos" caps-mono suffix is hidden — useful for very
   * dense table cells where the suffix becomes noise.
   */
  hideUnit?: boolean
}

export function PointsDisplay({
  points,
  size = "md",
  className,
  hideUnit = false,
}: PointsDisplayProps) {
  const numberSize =
    size === "sm" ? "text-[13px]" : size === "lg" ? "text-[22px]" : "text-[16px]"
  const unitSize = size === "sm" ? "text-[9.5px]" : size === "lg" ? "text-[11px]" : "text-[10px]"

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "font-serif font-semibold tabular-nums leading-none",
          numberSize,
        )}
      >
        {points.toLocaleString("pt-BR")}
      </span>
      {!hideUnit && (
        <span
          className={cn(
            "font-mono uppercase tracking-[0.08em] text-ink-mid leading-none",
            unitSize,
          )}
        >
          creditos
        </span>
      )}
    </span>
  )
}
