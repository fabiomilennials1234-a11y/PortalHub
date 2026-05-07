import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata = { title: "Membros" }

interface Props {
  params: Promise<{ orgSlug: string }>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Membros</h1>
        <span className="text-sm text-muted-foreground">
          {members?.length ?? 0} membros
        </span>
      </div>
      <div className="divide-y rounded-lg border">
        {members?.map((member) => {
          const profile = member.profiles as unknown as {
            full_name: string | null
            avatar_url: string | null
          }
          const initials = profile?.full_name
            ? profile.full_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "?"

          return (
            <Link
              key={member.id}
              href={`/${orgSlug}/members/${member.user_id}`}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
            >
              <Avatar>
                <AvatarImage
                  src={profile?.avatar_url ?? undefined}
                  alt={profile?.full_name ?? ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name ?? "Sem nome"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Nível {member.level} · {member.points} pts
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {member.role}
              </Badge>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
