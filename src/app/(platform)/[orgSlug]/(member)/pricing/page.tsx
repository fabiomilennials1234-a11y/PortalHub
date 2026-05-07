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
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold">Planos</h1>
        <p className="text-sm text-muted-foreground">
          Escolha o plano ideal pra você em {org.name}.
        </p>
      </div>

      <PlansList orgId={org.id} orgSlug={orgSlug} />
    </div>
  )
}
