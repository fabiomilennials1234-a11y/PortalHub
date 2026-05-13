import { cn } from "@/lib/utils"

interface LevelBadgeProps {
  level: number
  name?: string
  /** Compatibility prop — preserved in signature, not rendered. */
  color?: string | null
  size?: "sm" | "md" | "lg"
  showName?: boolean
  className?: string
}

/**
 * Editorial certification badge. Square gold-bordered tile carrying the tier
 * number in serif, optionally followed by a "TIER N" caps-mono label.
 */
export function LevelBadge({
  level,
  name,
  size = "md",
  showName = false,
  className,
}: LevelBadgeProps) {
  const tile =
    size === "sm" ? "size-[16px] text-[10.5px]" : size === "lg" ? "size-[22px] text-[14px]" : "size-[18px] text-[12px]"
  const labelText = size === "sm" ? "text-[10px]" : size === "lg" ? "text-[11.5px]" : "text-[11px]"
  const pad = size === "sm" ? "px-2 py-[2px] gap-1.5" : size === "lg" ? "px-2.5 py-1 gap-2" : "px-2 py-[3px] gap-2"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border border-line bg-paper",
        pad,
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[2px] border border-gold bg-gold-bg font-serif font-semibold text-gold-dk tabular-nums",
          tile,
        )}
      >
        {level}
      </span>
      <span
        className={cn(
          "font-mono uppercase tracking-[0.06em] text-ink-soft",
          labelText,
        )}
      >
        TIER {level}
        {showName && name ? <span className="ml-1 text-ink-low">· {name}</span> : null}
      </span>
    </span>
  )
}
