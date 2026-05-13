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
        "wf-box wf-box--hover flex items-start gap-4 p-4",
        !achievement.earned && "bg-paper-2",
      )}
    >
      <AchievementBadge
        type={achievement.type}
        earned={achievement.earned}
        size="md"
      />
      <div className="flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <h4
            className={cn(
              "font-serif text-[16px] font-semibold leading-tight tracking-[-0.005em]",
              !achievement.earned && "text-ink-mid",
            )}
          >
            {achievement.name}
          </h4>
          {achievement.points_reward > 0 && (
            <PointsDisplay points={achievement.points_reward} size="sm" />
          )}
        </div>
        {achievement.description && (
          <p className="text-[13px] leading-snug text-ink-soft">
            {achievement.description}
          </p>
        )}
        {achievement.earned && achievement.earned_at && (
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-low">
            conquistado em {formatDate(achievement.earned_at)}
          </p>
        )}
        {!achievement.earned && (
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-low">
            bloqueado
          </p>
        )}
      </div>
    </div>
  )
}
