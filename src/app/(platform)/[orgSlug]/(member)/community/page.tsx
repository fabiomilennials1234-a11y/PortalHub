import { createClient } from "@/lib/supabase/server"
import { PostList } from "./PostList"

export const metadata = { title: "Comunidade" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function CommunityPage({ params }: Props) {
  const { orgSlug } = await params
  const supabase = await createClient()

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (!org) return null

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("org_id", org.id)
    .order("position", { ascending: true })

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="font-heading text-lg font-semibold">Comunidade</h1>
      <PostList
        orgId={org.id}
        orgSlug={orgSlug}
        categories={categories ?? []}
      />
    </div>
  )
}
