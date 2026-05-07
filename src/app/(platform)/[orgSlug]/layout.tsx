import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

interface Props {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}

/**
 * Root [orgSlug] layout. Verifies user is authenticated and the org exists.
 * Membership check happens in (member)/layout.tsx so /join can render
 * without requiring membership (avoiding redirect loops).
 */
export default async function OrgLayout({ children, params }: Props) {
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

  return <>{children}</>
}
