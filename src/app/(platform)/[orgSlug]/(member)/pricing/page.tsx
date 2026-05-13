import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PlansList } from "@/components/payments/PlansList"

export const metadata = { title: "Planos" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function PricingPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 py-4">
      <header className="space-y-5 text-center">
        <span className="wf-pill wf-pill--gold inline-flex text-[10px] uppercase tracking-[0.08em]">
          Preços honestos · sem trial enganador
        </span>
        <h1 className="font-serif text-[48px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[64px]">
          Comece <span className="wf-underline">grátis</span>.
          <br />
          Pague quando crescer.
        </h1>
        <p className="mx-auto max-w-xl font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
          Planos disponíveis em {org.name}
        </p>
      </header>

      <PlansList orgId={org.id} orgSlug={orgSlug} />
    </div>
  )
}
