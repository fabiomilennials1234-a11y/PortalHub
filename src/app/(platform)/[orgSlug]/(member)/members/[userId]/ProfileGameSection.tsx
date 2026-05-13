"use client"

import { TabsContent } from "@/components/ui/tabs"
import { AchievementBadge } from "@/components/gamification/AchievementBadge"
import { useAchievements } from "@/hooks/useAchievements"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { UserPostsTab } from "./UserPostsTab"
import { UserCommentsTab } from "./UserCommentsTab"
import { UserCoursesTab } from "./UserCoursesTab"

interface ProfileGameSectionProps {
  orgId: string
  orgSlug: string
  userId: string
}

export function ProfileGameSection({
  orgId,
  orgSlug,
  userId,
}: ProfileGameSectionProps) {
  const { data: achievements, isLoading } = useAchievements(orgId, userId)

  return (
    <>
      <TabsContent value="posts">
        <div className="wf-box px-5 py-2">
          <UserPostsTab orgId={orgId} orgSlug={orgSlug} userId={userId} />
        </div>
      </TabsContent>

      <TabsContent value="comments">
        <div className="wf-box px-5 py-2">
          <UserCommentsTab orgSlug={orgSlug} userId={userId} />
        </div>
      </TabsContent>

      <TabsContent value="courses">
        <div className="wf-box px-5 py-4">
          <UserCoursesTab orgId={orgId} orgSlug={orgSlug} userId={userId} />
        </div>
      </TabsContent>

      <TabsContent value="badges">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-5 animate-spin text-ink-low" />
          </div>
        ) : !achievements || achievements.length === 0 ? (
          <div className="wf-box py-12 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
            nenhuma conquista cadastrada nesta organizacao
          </div>
        ) : (
          <div className="wf-box p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <AchievementBadge
                    type={a.type}
                    earned={a.earned}
                    size="lg"
                  />
                  <p
                    className={cn(
                      "line-clamp-2 font-serif text-[13px] font-medium leading-tight tracking-[-0.005em]",
                      !a.earned && "text-ink-mid",
                    )}
                  >
                    {a.name}
                  </p>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink-low">
                    {a.earned ? "conquistado" : "bloqueado"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
    </>
  )
}
