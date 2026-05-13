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
    <div className="mx-auto max-w-xl space-y-8 px-4 py-12">
      <header className="space-y-2 border-b border-line pb-6">
        <p className="wf-mono">Perfil · global</p>
        <h1 className="font-serif text-[32px] font-semibold leading-none tracking-tight text-foreground">
          Minha conta
        </h1>
        <p className="wf-mono">visível em todas as comunidades</p>
      </header>
      <section className="wf-box p-6">
        <ProfileForm
          userId={user.id}
          initialFullName={profile?.full_name ?? ""}
          initialBio={profile?.bio ?? ""}
          initialAvatarUrl={profile?.avatar_url ?? ""}
        />
      </section>
    </div>
  )
}
