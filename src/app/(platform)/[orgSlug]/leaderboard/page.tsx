import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LeaderboardTable } from "@/components/gamification/LeaderboardTable"
import { ActivityFeed } from "@/components/gamification/ActivityFeed"

export const metadata = { title: "Leaderboard" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function LeaderboardPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-heading text-lg font-semibold">Leaderboard</h1>

      <Tabs defaultValue="ranking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>
        <TabsContent value="ranking">
          <LeaderboardTable orgId={org.id} orgSlug={orgSlug} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityFeed orgId={org.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
