import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileGameSection } from "./ProfileGameSection"

interface Props {
  params: Promise<{ orgSlug: string; userId: string }>
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

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={profile.avatar_url ?? undefined}
            alt={profile.full_name ?? ""}
          />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.full_name ?? "Sem nome"}
          </h1>
          {membership && (
            <Badge variant="secondary" className="capitalize">
              {membership.role}
            </Badge>
          )}
        </div>
      </div>

      {profile.bio && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Bio
            </h2>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </>
      )}

      {org && membership && (
        <>
          <Separator />
          <Tabs defaultValue="stats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>
            <ProfileGameSection orgId={org.id} userId={userId} />
          </Tabs>
        </>
      )}

      {membership && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Membro desde
            </h2>
            <p className="text-sm">
              {new Date(membership.joined_at).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
