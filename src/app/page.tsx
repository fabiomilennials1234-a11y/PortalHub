import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-muted-foreground">
          Plataforma all-in-one de comunidades e cursos online
        </p>
        <div className="flex gap-3">
          <Link href="/login" className={buttonVariants()}>
            Entrar
          </Link>
          <Link href="/signup" className={buttonVariants({ variant: "outline" })}>
            Criar conta
          </Link>
        </div>
      </div>
    )
  }

  const { data: memberships } = await supabase
    .from("memberships")
    .select(
      `
      org_id,
      role,
      organizations:org_id (
        name,
        slug,
        logo_url,
        description
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "active")

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Suas comunidades
        </h1>
        <Link href="/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nova comunidade
        </Link>
      </div>
      {!memberships?.length ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Você ainda não faz parte de nenhuma comunidade.
          </p>
          <Link
            href="/new"
            className={buttonVariants({ variant: "outline", className: "mt-4" })}
          >
            Criar sua primeira comunidade
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {memberships.map((m) => {
            const org = m.organizations as unknown as {
              name: string
              slug: string
              logo_url: string | null
              description: string | null
            }
            return (
              <Link
                key={m.org_id}
                href={`/${org.slug}/community`}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                {org.logo_url ? (
                  <Image
                    src={org.logo_url}
                    alt={org.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    {org.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">{org.name}</p>
                  {org.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {org.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
