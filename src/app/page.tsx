import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  MessageSquare,
  BookOpen,
  Trophy,
  Calendar,
  Sparkles,
  Lock,
  Shield,
  ArrowRight,
} from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Feed da comunidade",
    body: "Posts em rich text, comentários aninhados e reações pra conversas que importam.",
  },
  {
    icon: BookOpen,
    title: "Cursos online",
    body: "Aulas em vídeo, texto e progresso por aluno. YouTube, Vimeo e Loom embedados.",
  },
  {
    icon: Trophy,
    title: "Gamificação nativa",
    body: "Pontos, níveis, conquistas e leaderboard. Engagement loop pronto.",
  },
  {
    icon: Calendar,
    title: "Eventos ao vivo",
    body: "Crie eventos com RSVP, lembretes e links direto pro Zoom ou Discord.",
  },
  {
    icon: Sparkles,
    title: "Pagamentos integrados",
    body: "Stripe Checkout + Billing Portal. Cobrança recorrente sem fricção.",
  },
  {
    icon: Shield,
    title: "Multi-tenant seguro",
    body: "RLS no banco, isolamento por organização. Sua comunidade é só sua.",
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-dvh">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="relative mx-auto max-w-5xl px-4 py-20 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="size-3 text-amber-400" />
              Plataforma all-in-one para criadores
            </div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Comunidades + Cursos.
              <br />
              <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                Tudo num só lugar.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {APP_NAME} substitui Discord + Hotmart + Zoom com uma experiência
              unificada. Comunidade, cursos, eventos, pagamentos e gamificação
              — prontos pra você lançar.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className={buttonVariants({ size: "lg" })}>
                Começar grátis
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Entrar
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-heading text-center text-2xl font-bold sm:text-3xl">
            Tudo o que sua comunidade precisa
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Construído pra criadores que pensam em décadas, não em sprints.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card/50 p-5 transition-colors hover:bg-card"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <Lock className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">
              Pronto pra construir sua comunidade?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Sem cartão de crédito pra começar. Faça login, crie sua org e
              comece em minutos.
            </p>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "mt-6")}
            >
              Criar minha conta
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-6 space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Suas comunidades
        </h1>
        <p className="text-sm text-muted-foreground">
          Comunidades das quais você faz parte.
        </p>
      </header>

      <nav className="mb-6 flex gap-2 border-b border-border">
        <Link
          href="/"
          className="border-b-2 border-primary px-3 py-2 text-sm font-medium"
        >
          Minhas
        </Link>
        <Link
          href="/discover"
          className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
