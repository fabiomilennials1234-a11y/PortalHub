import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { SubscriptionStatus } from "@/components/payments/SubscriptionStatus"
import { PaymentHistory } from "@/components/payments/PaymentHistory"

export const metadata = { title: "Cobrança" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function BillingPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) notFound()

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-line pb-6">
        <p className="wf-mono">Faturamento · Stripe</p>
        <h1 className="font-serif text-[32px] font-semibold leading-none tracking-tight text-foreground">
          Cobrança
        </h1>
        <p className="wf-mono">assinaturas e pagamentos da organização</p>
      </header>

      <SubscriptionStatus orgId={org.id} orgSlug={orgSlug} />

      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-line-soft pb-2">
          <h2 className="font-serif text-[18px] font-semibold text-foreground">
            Histórico de pagamentos
          </h2>
          <p className="wf-mono">cronológico</p>
        </div>
        <PaymentHistory orgId={org.id} />
      </section>
    </div>
  )
}
