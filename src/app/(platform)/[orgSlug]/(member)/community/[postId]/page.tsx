import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Pin, Lock, ArrowLeft } from "lucide-react"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { PostDetailClient } from "./PostDetailClient"

interface Props {
  params: Promise<{ orgSlug: string; postId: string }>
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "agora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return `${Math.floor(days / 30)}mo`
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
  const { orgSlug, postId } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select(
      "*, profiles:author_id(full_name, avatar_url), categories:category_id(name, slug, color)",
    )
    .eq("id", postId)
    .single()

  if (!post) notFound()

  const profile = post.profiles as {
    full_name: string | null
    avatar_url: string | null
  }
  const category = post.categories as
    | { name: string; slug: string; color: string }
    | null

  const tier = Math.max(
    1,
    Math.min(
      15,
      Math.floor((post.likes_count + post.comments_count) / 5) + 1,
    ),
  )

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Breadcrumb */}
      <Link
        href={`/${orgSlug}/community`}
        className="wf-mono inline-flex items-center gap-1.5 text-ink-mid transition-colors hover:text-gold-dk"
      >
        <ArrowLeft className="h-3 w-3" />
        voltar pro feed
      </Link>

      <article className="mt-6 space-y-7">
        {/* Header meta */}
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <span className="wf-pill !text-[10.5px]">{category.name}</span>
          )}
          {post.pinned && (
            <span className="wf-pill wf-pill--gold !text-[10px]">
              <Pin className="h-2.5 w-2.5" />
              Fixado
            </span>
          )}
          {post.locked && (
            <span className="wf-pill !text-[10px]">
              <Lock className="h-2.5 w-2.5" />
              Trancado
            </span>
          )}
          <span className="wf-mono ml-auto">{timeAgo(post.created_at)}</span>
        </div>

        {/* Title */}
        <h1 className="wf-hand text-[32px] leading-[1.1] tracking-tight sm:text-[36px]">
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center gap-3 border-b border-line-soft pb-5">
          <GradientAvatar
            userId={post.author_id}
            name={profile.full_name}
            avatarUrl={profile.avatar_url}
            size={40}
            ringClassName="ring-1 ring-border"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-serif text-[15px] font-medium text-foreground">
              {profile.full_name ?? "Anonimo"}
            </span>
            <span className="wf-mono">
              Membro · TIER {tier}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="wf-box p-6 sm:p-8">
          <RichTextRenderer content={post.body} />
        </div>
      </article>

      <div className="mt-8 space-y-8">
        <PostDetailClient postId={postId} locked={post.locked} />
      </div>
    </div>
  )
}
