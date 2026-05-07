import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Plus, Compass, Users } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export const metadata = { title: "Descobrir comunidades" }

interface OrgRow {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
}

export default async function DiscoverPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // List all orgs (RLS policy "Anyone can view organizations" allows it)
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, slug, description, logo_url")
    .order("name", { ascending: true })

  const { data: myMemberships } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .eq("status", "active")

  const myOrgIds = new Set((myMemberships ?? []).map((m) => m.org_id))
  const allOrgs = (orgs ?? []) as OrgRow[]
  const otherOrgs = allOrgs.filter((o) => !myOrgIds.has(o.id))

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="mb-8 space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Descobrir comunidades
        </h1>
        <p className="text-sm text-muted-foreground">
          Outras comunidades neste PortalHub. Entre nas que te interessam.
        </p>
      </header>

      <nav className="mb-6 flex gap-2 border-b border-border">
        <Link
          href="/"
          className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Minhas
        </Link>
        <Link
          href="/discover"
          className="border-b-2 border-primary px-3 py-2 text-sm font-medium"
        >
          Descobrir
        </Link>
        <Link
          href="/new"
          className={buttonVariants({
            size: "sm",
            variant: "outline",
            className: "ml-auto mb-2",
          })}
        >
          <Plus className="size-4" />
          Nova
        </Link>
      </nav>

      {otherOrgs.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center">
          <Compass className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma outra comunidade disponível no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {otherOrgs.map((org) => (
            <Link
              key={org.id}
              href={`/${org.slug}/community`}
              className="group flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              {org.logo_url ? (
                <Image
                  src={org.logo_url}
                  alt={org.name}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  {org.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <p className="font-heading text-sm font-semibold">{org.name}</p>
                {org.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {org.description}
                  </p>
                )}
                <div className="flex items-center gap-1 pt-1 text-[10px] text-muted-foreground">
                  <Users className="size-3" />
                  Pública
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
