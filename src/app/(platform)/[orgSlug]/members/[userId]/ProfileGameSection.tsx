"use client"

import { TabsContent } from "@/components/ui/tabs"
import { StatsCard } from "@/components/gamification/StatsCard"
import { AchievementCard } from "@/components/gamification/AchievementCard"
import { ActivityFeed } from "@/components/gamification/ActivityFeed"
import { useAchievements } from "@/hooks/useAchievements"
import { Loader2, Trophy } from "lucide-react"

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
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : !achievements || achievements.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Trophy className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nenhuma conquista cadastrada nesta organização.
            </p>
          </div>
        ) : (
          achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))
        )}
      </TabsContent>

      <TabsContent value="activity">
        <ActivityFeed orgId={orgId} userId={userId} limit={50} />
      </TabsContent>
    </>
  )
}
