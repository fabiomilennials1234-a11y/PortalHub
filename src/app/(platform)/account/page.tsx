import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "./ProfileForm"

export const metadata = { title: "Minha conta" }

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-10">
      <div className="space-y-1">
        <h1 className="font-heading text-lg font-semibold">Minha conta</h1>
        <p className="text-xs text-muted-foreground">
          Atualize suas informações de perfil. Visíveis em todas as comunidades.
        </p>
      </div>
      <ProfileForm
        userId={user.id}
        initialFullName={profile?.full_name ?? ""}
        initialBio={profile?.bio ?? ""}
        initialAvatarUrl={profile?.avatar_url ?? ""}
      />
    </div>
  )
}
