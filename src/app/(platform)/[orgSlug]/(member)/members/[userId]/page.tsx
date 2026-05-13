import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { ProfileGameSection } from "./ProfileGameSection"

interface Props {
  params: Promise<{ orgSlug: string; userId: string }>
}

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  moderator: "Moderador",
  member: "Membro",
}

export default async function ProfilePage({ params }: Props) {
  const { orgSlug, userId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!profile) notFound()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  const { data: membership } = org
    ? await supabase
        .from("memberships")
        .select("role, points, level, joined_at")
        .eq("user_id", userId)
        .eq("org_id", org.id)
        .single()
    : { data: null }

  const roleLabel = membership ? ROLE_LABEL[membership.role] ?? membership.role : null

  const memberSince = membership
    ? new Date(membership.joined_at).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 py-2">
      {/* Header */}
      <header className="space-y-5">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <GradientAvatar
            userId={userId}
            name={profile.full_name}
            avatarUrl={profile.avatar_url}
            size={96}
            ringClassName="ring-1 ring-line"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mid">
              perfil
            </p>
            <h1 className="font-serif text-[32px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
              {profile.full_name ?? "Sem nome"}
            </h1>
            {membership && (
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid tabular-nums">
                <span>{roleLabel}</span>
                <span className="mx-2 text-ink-low">·</span>
                <span>tier {membership.level}</span>
                <span className="mx-2 text-ink-low">·</span>
                <span>{membership.points.toLocaleString("pt-BR")} creditos</span>
              </p>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="max-w-2xl font-serif text-[16px] italic leading-relaxed tracking-[-0.005em] text-ink-soft">
            {profile.bio}
          </p>
        )}

        {memberSince && (
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-low">
            <span>membro desde</span>
            <span className="text-ink-mid">{memberSince}</span>
          </div>
        )}
      </header>

      <div className="h-px w-full bg-line" />

      {org && membership && (
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stats">Estatisticas</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>
          <ProfileGameSection orgId={org.id} userId={userId} />
        </Tabs>
      )}
    </div>
  )
}
