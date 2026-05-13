import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

interface Props {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}

export default async function MemberLayout({ children, params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch org first (needed for membership lookup by org_id)
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, logo_url")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  // Parallelize membership + profile fetches
  const [membershipRes, profileRes] = await Promise.all([
    supabase
      .from("memberships")
      .select("role, status, points, level")
      .eq("user_id", user.id)
      .eq("org_id", org.id)
      .single(),
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single(),
  ])

  const membership = membershipRes.data
  const profile = profileRes.data

  if (!membership || membership.status !== "active") {
    redirect(`/${orgSlug}/join`)
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar
        orgSlug={orgSlug}
        orgName={org.name}
        orgLogoUrl={org.logo_url}
        userRole={membership.role}
      />
      <div className="flex flex-1 flex-col">
        <Header
          orgSlug={orgSlug}
          orgName={org.name}
          orgLogoUrl={org.logo_url}
          userRole={membership.role}
          fullName={profile?.full_name ?? null}
          avatarUrl={profile?.avatar_url ?? null}
          userId={user.id}
          points={membership.points ?? 0}
          level={membership.level ?? 1}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
