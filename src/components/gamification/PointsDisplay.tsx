import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface PointsDisplayProps {
  points: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PointsDisplay({
  points,
  size = "md",
  className,
}: PointsDisplayProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-medium tabular-nums text-amber-500",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
        className,
      )}
    >
      <Sparkles
        className={cn(
          size === "sm" && "size-3",
          size === "md" && "size-3.5",
          size === "lg" && "size-4",
        )}
      />
      {points.toLocaleString("pt-BR")}
    </div>
  )
}
