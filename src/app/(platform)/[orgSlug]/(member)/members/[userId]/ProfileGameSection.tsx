"use client"

import { TabsContent } from "@/components/ui/tabs"
import { StatsCard } from "@/components/gamification/StatsCard"
import { AchievementCard } from "@/components/gamification/AchievementCard"
import { ActivityFeed } from "@/components/gamification/ActivityFeed"
import { useAchievements } from "@/hooks/useAchievements"
import { Loader2 } from "lucide-react"

interface ProfileGameSectionProps {
  orgId: string
  userId: string
}

export function ProfileGameSection({ orgId, userId }: ProfileGameSectionProps) {
  const { data: achievements, isLoading } = useAchievements(orgId, userId)

  return (
    <>
      <TabsContent value="stats" className="space-y-4">
        <StatsCard orgId={orgId} userId={userId} />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-5 animate-spin text-ink-low" />
          </div>
        ) : !achievements || achievements.length === 0 ? (
          <div className="wf-box py-12 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
            nenhuma conquista cadastrada nesta organizacao
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {achievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="activity">
        <div className="wf-box px-4 py-2">
          <ActivityFeed orgId={orgId} userId={userId} limit={50} />
        </div>
      </TabsContent>
    </>
  )
}
