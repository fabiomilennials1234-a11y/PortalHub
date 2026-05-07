import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

interface Props {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}

export default async function OrgLayout({ children, params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  const { data: membership } = await supabase
    .from("memberships")
    .select("role, status")
    .eq("user_id", user.id)
    .eq("org_id", org.id)
    .single()

  if (!membership || membership.status !== "active") {
    redirect(`/${orgSlug}/join`)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex min-h-dvh">
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
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
