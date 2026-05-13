import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { LevelBadge } from "@/components/gamification/LevelBadge"

export const metadata = { title: "Membros" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  moderator: "Moderador",
  member: "Membro",
}

export default async function MembersPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) return null

  const { data: members } = await supabase
    .from("memberships")
    .select(
      `
      id,
      user_id,
      role,
      points,
      level,
      joined_at,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `,
    )
    .eq("org_id", org.id)
    .eq("status", "active")
    .order("points", { ascending: false })

  const total = members?.length ?? 0

  return (
    <div className="space-y-8 py-2">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mid">
            comunidade
          </p>
          <h1 className="font-serif text-[36px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
            Membros
          </h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid tabular-nums">
          {total.toLocaleString("pt-BR")} ativos
        </p>
      </header>

      {total === 0 ? (
        <div className="wf-box py-16 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
          nenhum membro ativo ainda
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members?.map((member) => {
            const profile = member.profiles as unknown as {
              full_name: string | null
              avatar_url: string | null
            }
            const roleLabel = ROLE_LABEL[member.role] ?? member.role

            return (
              <Link
                key={member.id}
                href={`/${orgSlug}/members/${member.user_id}`}
                className="wf-box wf-box--hover flex items-center gap-4 p-4"
              >
                <GradientAvatar
                  userId={member.user_id}
                  name={profile?.full_name ?? null}
                  avatarUrl={profile?.avatar_url ?? null}
                  size={48}
                  ringClassName="ring-1 ring-line"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-serif text-[16px] font-semibold leading-tight tracking-[-0.005em] text-foreground">
                    {profile?.full_name ?? "Sem nome"}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
                    {roleLabel} · tier {member.level}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-low tabular-nums">
                    {member.points.toLocaleString("pt-BR")} creditos
                  </p>
                </div>
                <LevelBadge level={member.level} size="sm" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
