import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LeaderboardTable } from "@/components/gamification/LeaderboardTable"
import { LeaderboardPodium } from "@/components/gamification/LeaderboardPodium"
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
    <div className="mx-auto w-full max-w-7xl space-y-8 py-2">
      {/* Header */}
      <header className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mid">
          gamificacao
        </p>
        <h1 className="font-serif text-[36px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
          Leaderboard
        </h1>
        <p className="font-serif text-[15px] italic leading-snug text-ink-soft">
          Os membros que mais acumulam creditos nesta comunidade.
        </p>
      </header>

      <Tabs defaultValue="ranking" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-8">
          <section className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
              destaque
            </p>
            <LeaderboardPodium orgId={org.id} orgSlug={orgSlug} />
          </section>

          <section className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
              classificacao geral
            </p>
            <LeaderboardTable orgId={org.id} orgSlug={orgSlug} />
          </section>
        </TabsContent>

        <TabsContent value="activity">
          <section className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
              ultimas acoes
            </p>
            <div className="wf-box px-4 py-2">
              <ActivityFeed orgId={org.id} />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}
