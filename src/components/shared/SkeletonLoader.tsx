import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  lines?: number
  className?: string
}

export function SkeletonLoader({ lines = 3, className }: SkeletonLoaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === 0 ? "w-3/4" : i === lines - 1 ? "w-1/2" : "w-full")}
        />
      ))}
    </div>
  )
}
