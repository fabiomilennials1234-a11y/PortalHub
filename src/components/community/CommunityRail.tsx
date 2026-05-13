import { JourneyCard } from "./rail/JourneyCard"
import { LeaderboardMini } from "./rail/LeaderboardMini"
import { UpcomingEventsMini } from "./rail/UpcomingEventsMini"
import { OnlineNowMini } from "./rail/OnlineNowMini"
import { AboutCard } from "./rail/AboutCard"

interface CommunityRailProps {
  orgId: string
  orgSlug: string
  description: string | null
  memberCount: number
  createdAt: string
}

export function CommunityRail({
  orgId,
  orgSlug,
  description,
  memberCount,
  createdAt,
}: CommunityRailProps) {
  return (
    <div className="sticky top-20 space-y-4">
      <JourneyCard orgId={orgId} orgSlug={orgSlug} />
      <LeaderboardMini orgId={orgId} orgSlug={orgSlug} />
      <UpcomingEventsMini orgId={orgId} orgSlug={orgSlug} />
      <OnlineNowMini orgId={orgId} />
      <AboutCard
        description={description}
        memberCount={memberCount}
        createdAt={createdAt}
      />
    </div>
  )
}
