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
  Shield,
  ArrowRight,
} from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FEATURES = [
  { id: "01", title: "Feed", body: "Organizado por contexto comercial — categorias, RLS, reactions." },
  { id: "02", title: "Cursos", body: "Módulos, vídeo nativo, progresso por aluno, certificação rastreável." },
  { id: "03", title: "Créditos", body: "Sinalizam senioridade. Pontos viram TIERs. Nada de Duolingo." },
  { id: "04", title: "Eventos", body: "Lives, AMAs e workshops por convite — com RSVP e replay." },
  { id: "05", title: "Pagamentos", body: "Stripe nativo. Billing portal. Assinaturas recorrentes." },
  { id: "06", title: "Governança", body: "Multi-tenant com RLS no banco. SSO e audit log." },
]

const PRODUCT_HIGHLIGHTS: { feature: typeof FEATURES[number]; icon: React.ReactNode }[] = [
  { feature: FEATURES[0], icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { feature: FEATURES[1], icon: <BookOpen className="h-3.5 w-3.5" /> },
  { feature: FEATURES[2], icon: <Trophy className="h-3.5 w-3.5" /> },
  { feature: FEATURES[3], icon: <Calendar className="h-3.5 w-3.5" /> },
  { feature: FEATURES[4], icon: <Sparkles className="h-3.5 w-3.5" /> },
  { feature: FEATURES[5], icon: <Shield className="h-3.5 w-3.5" /> },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        {/* Top nav */}
        <header className="border-b border-line-soft border-dashed">
          <div className="mx-auto flex max-w-6xl items-center px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink bg-ink font-serif text-[18px] font-semibold text-gold">
                P
              </div>
              <span className="font-serif text-[17px] tracking-tight sm:text-[19px]">
                {APP_NAME}
              </span>
            </div>
            <nav className="ml-auto hidden items-center gap-7 md:flex">
              {["Por quê", "Produto", "Preços", "Histórias", "Docs"].map((l) => (
                <span
                  key={l}
                  className="text-[13px] font-medium text-ink-soft hover:text-foreground"
                >
                  {l}
                </span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1.5 md:ml-6 sm:gap-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden sm:inline-flex",
                )}
              >
                Criar comunidade
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 text-center sm:px-6 sm:pt-16 lg:px-10 lg:pt-24">
          <span className="wf-pill wf-pill--gold mb-6">
            Plataforma de aprendizagem corporativa
          </span>
          <h1 className="font-serif text-[30px] font-medium leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[44px] lg:text-[60px] lg:leading-[1.02]">
            Pipeline e treinamento{" "}
            <span className="wf-underline">no mesmo lugar</span>,
            <br className="hidden sm:block" />{" "}
            para times comerciais B2B.
          </h1>
          <p className="mx-auto mt-5 max-w-[540px] text-[14.5px] leading-[1.65] text-ink-mid sm:mt-7 sm:text-[15.5px]">
            Comunidade executiva, cursos certificados, mentorias e eventos —
            em uma plataforma única, projetada para líderes de vendas, RevOps e
            fundadores B2B.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Solicitar acesso
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Agendar demo
            </Link>
          </div>
        </section>

        {/* Product preview placeholder */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="wf-box relative overflow-hidden bg-paper-2">
            <div className="absolute inset-x-0 top-0 flex items-center gap-2 border-b border-border px-3 py-2 sm:px-4 sm:py-2.5">
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ink-low/40" />
                <span className="h-2 w-2 rounded-full bg-ink-low/40" />
                <span className="h-2 w-2 rounded-full bg-ink-low/40" />
              </span>
              <span className="wf-mono ml-2 truncate !text-[10px] sm:!text-[10.5px]">portalhub.app · polaris/exec-circle</span>
              <span className="ml-auto wf-mono !text-[10px] !text-ink-low">⌘K</span>
            </div>
            <div className="grid grid-cols-1 gap-3 px-3 pb-5 pt-10 sm:px-4 md:grid-cols-[140px_1fr] md:pt-12 lg:grid-cols-[140px_1fr_160px]">
              <div className="wf-box hidden p-3 md:block">
                <div className="wf-mono !text-[10px]">Nav</div>
                <div className="mt-2 space-y-1.5 text-[12px]">
                  {["Feed", "Cursos", "Eventos", "Ranking", "Membros"].map(
                    (item, idx) => (
                      <div
                        key={item}
                        className={cn(
                          "flex items-center gap-2 rounded-sm px-1.5 py-1",
                          idx === 0
                            ? "bg-paper-2 font-semibold"
                            : "text-ink-soft",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            idx === 0 ? "bg-gold" : "bg-ink-low/40",
                          )}
                        />
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {[
                  {
                    a: "MR",
                    n: "Maria · VP Sales",
                    t: "Como vocês fazem discovery em deals de R$ 500k+?",
                    m: "12 ↑   8 resp.",
                  },
                  {
                    a: "JS",
                    n: "João · Head of GTM",
                    t: "Refiz o playbook de discovery — feedback?",
                    m: "51 ↑   23 resp.",
                  },
                  {
                    a: "DK",
                    n: "Davi · CEO",
                    t: "Q3 — programa de certificação entrou em campo",
                    m: "88 ↑   live",
                  },
                ].map((p) => (
                  <div
                    key={p.a}
                    className="wf-box flex gap-3 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-paper">
                      {p.a}
                    </span>
                    <div className="min-w-0 flex-1 text-[12px]">
                      <div className="truncate font-semibold">{p.n}</div>
                      <div className="mt-0.5 truncate text-ink-mid">{p.t}</div>
                      <div className="wf-mono mt-1.5 !text-[10px] !text-ink-low">
                        {p.m}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wf-box hidden p-3 lg:block">
                <div className="wf-mono !text-[10px]">Ranking</div>
                <div className="mt-2 space-y-1.5 text-[12px]">
                  {[
                    ["1", "Maria", "2.1k"],
                    ["2", "João", "1.8k"],
                    ["3", "Davi", "1.4k"],
                    ["4", "Bia", "1.1k"],
                  ].map(([p, n, pts]) => (
                    <div key={p} className="flex items-center gap-2">
                      <span className="font-serif text-[14px] text-gold-dk">
                        {p}
                      </span>
                      <span className="flex-1">{n}</span>
                      <span className="wf-mono !text-[10px]">{pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust row */}
        <section className="mx-auto mt-10 max-w-6xl px-4 sm:mt-12 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-4 border-y border-border py-4 sm:justify-between sm:gap-6 sm:py-5">
            <span className="wf-mono w-full text-center !text-[10.5px] sm:w-auto sm:text-left">
              Em uso em times comerciais de:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 opacity-70 sm:gap-6">
              {["acme.", "orbital", "NORTH", "pivot", "fern&fig", "kraken"].map(
                (l) => (
                  <span
                    key={l}
                    className="font-serif text-[15px] text-ink-mid sm:text-[18px]"
                  >
                    {l}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Features as headline grid */}
        <section className="mx-auto mt-12 max-w-6xl px-4 sm:mt-16 sm:px-6 lg:px-10">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <span className="wf-mono">Capacidades</span>
            <h2 className="mt-3 font-serif text-[26px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[36px]">
              Tudo o que sua comunidade B2B precisa — sem juntar três SaaS.
            </h2>
          </div>
          <div className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_HIGHLIGHTS.map(({ feature, icon }, i) => (
              <div
                key={feature.id}
                className={cn(
                  "border-b border-border px-5 py-6 sm:px-7 sm:py-7",
                  i % 2 === 0 && "sm:border-r",
                  "lg:!border-b-0 lg:[&:nth-child(-n+3)]:border-b",
                  "lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r",
                  i === PRODUCT_HIGHLIGHTS.length - 1 && "border-b-0",
                )}
              >
                <div className="flex items-center gap-2 text-gold-dk">
                  <span className="wf-mono !text-[10px] !text-ink-low">
                    {feature.id}
                  </span>
                  {icon}
                </div>
                <h3 className="wf-hand mt-2 text-[22px] sm:text-[24px]">{feature.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.55] text-ink-soft">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto mt-16 max-w-3xl px-4 pb-14 text-center sm:mt-20 sm:px-6 sm:pb-20 lg:px-10">
          <span className="wf-mono">Implantação em 14 dias</span>
          <h2 className="mt-4 font-serif text-[28px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[40px]">
            Pronto para tratar sua rede como{" "}
            <span className="wf-underline-soft">pipeline</span>?
          </h2>
          <p className="mt-4 text-[14px] text-ink-mid">
            Sem cartão. Crie sua org e comece em minutos. Falamos quando
            precisar de SSO ou contrato anual.
          </p>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "mt-7")}
          >
            Criar minha conta
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <footer className="border-t border-border py-5 sm:py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:gap-0 sm:px-6 lg:px-10">
            <span className="wf-mono">
              {APP_NAME} · edição n° 014 · maio 2026
            </span>
            <span className="wf-mono !text-ink-low text-center">
              feito por times comerciais, para times comerciais
            </span>
          </div>
        </footer>
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
      <header className="mb-7 space-y-2">
        <span className="wf-mono">Suas comunidades</span>
        <h1 className="font-serif text-[32px] font-medium leading-[1.05] tracking-[-0.02em]">
          Bem-vindo de volta.
        </h1>
      </header>

      <nav className="mb-6 flex gap-2 border-b border-border">
        <Link
          href="/"
          className="border-b-2 border-foreground px-3 py-2 text-[13px] font-medium"
        >
          Minhas
        </Link>
        <Link
          href="/discover"
          className="px-3 py-2 text-[13px] text-ink-mid transition-colors hover:text-foreground"
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
          <Plus className="h-4 w-4" />
          Nova
        </Link>
      </nav>

      {!memberships?.length ? (
        <div className="wf-box p-10 text-center">
          <p className="font-serif text-[18px] text-ink-mid">
            Você ainda não faz parte de nenhuma comunidade.
          </p>
          <Link
            href="/new"
            className={cn(buttonVariants({ variant: "outline" }), "mt-5")}
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
                className="wf-box wf-box--hover flex items-center gap-4 p-4 transition-colors"
              >
                {org.logo_url ? (
                  <Image
                    src={org.logo_url}
                    alt={org.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-sm object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-ink font-serif text-[22px] font-semibold text-gold">
                    {org.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-serif text-[17px] font-medium text-foreground">
                    {org.name}
                  </p>
                  {org.description && (
                    <p className="line-clamp-1 text-[13px] text-ink-mid">
                      {org.description}
                    </p>
                  )}
                </div>
                <span className="wf-mono">{m.role}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
