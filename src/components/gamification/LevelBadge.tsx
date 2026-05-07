import { cn } from "@/lib/utils"
import { Shield } from "lucide-react"

interface LevelBadgeProps {
  level: number
  name?: string
  color?: string | null
  size?: "sm" | "md" | "lg"
  showName?: boolean
  className?: string
}

export function LevelBadge({
  level,
  name,
  color,
  size = "md",
  showName = false,
  className,
}: LevelBadgeProps) {
  const finalColor = color ?? "#94a3b8"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium",
        size === "sm" && "text-[10px]",
        size === "md" && "text-xs",
        size === "lg" && "text-sm",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklch, ${finalColor} 18%, transparent)`,
        color: finalColor,
      }}
    >
      <Shield
        className={cn(
          size === "sm" && "size-3",
          size === "md" && "size-3.5",
          size === "lg" && "size-4",
        )}
      />
      <span className="tabular-nums">Nv {level}</span>
      {showName && name && (
        <>
          <span className="opacity-60">·</span>
          <span>{name}</span>
        </>
      )}
    </div>
  )
}
