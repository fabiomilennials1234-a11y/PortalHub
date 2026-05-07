"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePosts } from "@/hooks/usePosts"
import { PostCard } from "@/components/community/PostCard"
import { CategoryFilter } from "@/components/community/CategoryFilter"
import { PostForm } from "@/components/community/PostForm"
import { Loader2 } from "lucide-react"
import type { Category } from "@/types/database.types"

interface PostListProps {
  orgId: string
  orgSlug: string
  categories: Category[]
}

export function PostList({ orgId, orgSlug, categories }: PostListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePosts({ orgId, categoryId: selectedCategory })

  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "200px",
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersect])

  const posts = data?.pages.flat() ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <PostForm orgId={orgId} categories={categories} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} orgSlug={orgSlug} />
        ))}
      </div>

      {!isLoading && posts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum post ainda. Seja o primeiro a publicar!
          </p>
        </div>
      )}

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
