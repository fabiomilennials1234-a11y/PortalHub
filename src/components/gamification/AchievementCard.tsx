import { cn } from "@/lib/utils"
import { AchievementBadge } from "./AchievementBadge"
import { PointsDisplay } from "./PointsDisplay"
import type { AchievementWithEarned } from "@/types/domain"

interface AchievementCardProps {
  achievement: AchievementWithEarned
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(new Date(date))
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border p-3 transition-colors",
        achievement.earned ? "bg-card" : "bg-muted/20",
      )}
    >
      <AchievementBadge
        type={achievement.type}
        earned={achievement.earned}
        color={achievement.color}
        size="md"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={cn(
              "font-heading text-sm font-medium",
              !achievement.earned && "text-muted-foreground",
            )}
          >
            {achievement.name}
          </h4>
          {achievement.points_reward > 0 && (
            <PointsDisplay points={achievement.points_reward} size="sm" />
          )}
        </div>
        {achievement.description && (
          <p className="text-xs text-muted-foreground">
            {achievement.description}
          </p>
        )}
        {achievement.earned && achievement.earned_at && (
          <p className="text-[10px] text-muted-foreground">
            Conquistado em {formatDate(achievement.earned_at)}
          </p>
        )}
      </div>
    </div>
  )
}
