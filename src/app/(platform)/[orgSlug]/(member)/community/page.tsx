import { createClient } from "@/lib/supabase/server"
import { PostList } from "./PostList"
import { CommunityHero } from "@/components/community/CommunityHero"
import { CommunityRail } from "@/components/community/CommunityRail"

export const metadata = { title: "Comunidade" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function CommunityPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, description, banner_url, created_at")
    .eq("slug", orgSlug)
    .single()

  if (!org) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [categoriesRes, totalPostsRes, memberCountRes, postsTodayRes] =
    await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("org_id", org.id)
        .order("position", { ascending: true }),
      supabase
        .from("posts")
        .select("id, category_id", { count: "exact" })
        .eq("org_id", org.id)
        .eq("published", true),
      supabase
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id)
        .eq("status", "active"),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id)
        .eq("published", true)
        .gte("created_at", todayStart.toISOString()),
    ])

  const categories = categoriesRes.data ?? []
  const totalCount = totalPostsRes.count ?? 0
  const memberCount = memberCountRes.count ?? 0
  const postsToday = postsTodayRes.count ?? 0

  const categoryCounts: Record<string, number> = {}
  for (const row of totalPostsRes.data ?? []) {
    if (row.category_id) {
      categoryCounts[row.category_id] =
        (categoryCounts[row.category_id] ?? 0) + 1
    }
  }

  // TODO: realtime presence em sprint pos-MVP.
  const onlineCount = 0

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <main className="min-w-0 space-y-6">
          <CommunityHero
            orgName={org.name}
            bannerUrl={org.banner_url}
            memberCount={memberCount}
            onlineCount={onlineCount}
            postsToday={postsToday}
          />
          <PostList
            orgId={org.id}
            orgSlug={orgSlug}
            categories={categories}
            totalCount={totalCount}
            categoryCounts={categoryCounts}
            currentUserId={user.id}
            currentUserName={profile?.full_name ?? null}
            currentUserAvatarUrl={profile?.avatar_url ?? null}
          />
        </main>
        <aside className="mt-6 hidden lg:mt-0 lg:block">
          <CommunityRail
            orgId={org.id}
            orgSlug={orgSlug}
            description={org.description}
            memberCount={memberCount}
            createdAt={org.created_at}
          />
        </aside>
      </div>
    </div>
  )
}
