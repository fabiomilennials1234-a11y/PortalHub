import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pin, Lock } from "lucide-react"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { PostDetailClient } from "./PostDetailClient"

interface Props {
  params: Promise<{ orgSlug: string; postId: string }>
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export async function generateMetadata({ params }: Props) {
  const { postId } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("title")
    .eq("id", postId)
    .single()
  return { title: post?.title ?? "Post" }
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select(
      "*, profiles:author_id(full_name, avatar_url), categories:category_id(name, slug, color)",
    )
    .eq("id", postId)
    .single()

  if (!post) notFound()

  const profile = post.profiles as { full_name: string | null; avatar_url: string | null }
  const category = post.categories as { name: string; slug: string; color: string } | null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <article className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            {profile.avatar_url && (
              <AvatarImage src={profile.avatar_url} />
            )}
            <AvatarFallback>
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {profile.full_name ?? "Anônimo"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {post.pinned && <Pin className="size-4 text-amber-500" />}
            {post.locked && <Lock className="size-4 text-muted-foreground" />}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold">{post.title}</h1>
            {category && (
              <Badge
                variant="secondary"
                style={
                  {
                    backgroundColor: `color-mix(in oklch, ${category.color} 15%, transparent)`,
                    color: category.color,
                  } as React.CSSProperties
                }
              >
                {category.name}
              </Badge>
            )}
          </div>
          <RichTextRenderer content={post.body} />
        </div>
      </article>

      <PostDetailClient postId={postId} locked={post.locked} />
    </div>
  )
}
