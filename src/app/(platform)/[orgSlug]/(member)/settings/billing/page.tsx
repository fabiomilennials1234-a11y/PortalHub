import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
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
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-heading text-lg font-semibold">Cobrança</h1>

      <SubscriptionStatus orgId={org.id} orgSlug={orgSlug} />

      <Separator />

      <div className="space-y-3">
        <h2 className="font-heading text-sm font-semibold">
          Histórico de pagamentos
        </h2>
        <PaymentHistory orgId={org.id} />
      </div>
    </div>
  )
}
