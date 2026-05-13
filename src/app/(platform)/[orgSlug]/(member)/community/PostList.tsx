"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { usePosts } from "@/hooks/usePosts"
import { PostCard } from "@/components/community/PostCard"
import { PostCardSkeleton } from "@/components/community/PostCardSkeleton"
import { CategoryFilter } from "@/components/community/CategoryFilter"
import { Composer } from "@/components/community/Composer"
import { PinnedGuidelinesCard } from "@/components/community/PinnedGuidelinesCard"
import type { Category } from "@/types/database.types"

interface PostListProps {
  orgId: string
  orgSlug: string
  categories: Category[]
  totalCount?: number
  categoryCounts?: Record<string, number>
  currentUserId: string
  currentUserName: string | null
  currentUserAvatarUrl: string | null
}

export function PostList({
  orgId,
  orgSlug,
  categories,
  totalCount,
  categoryCounts,
  currentUserId,
  currentUserName,
  currentUserAvatarUrl,
}: PostListProps) {
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
    <div className="space-y-5">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        counts={categoryCounts}
        totalCount={totalCount}
      />

      <Composer
        orgId={orgId}
        categories={categories}
        userId={currentUserId}
        fullName={currentUserName}
        avatarUrl={currentUserAvatarUrl}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.length > 0 && <PinnedGuidelinesCard orgSlug={orgSlug} />}
          <AnimatePresence mode="popLayout" initial={false}>
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                  delay: Math.min(i * 0.04, 0.3),
                }}
              >
                <PostCard post={post} orgSlug={orgSlug} />
              </motion.div>
            ))}
          </AnimatePresence>

          {posts.length === 0 && (
            <div className="wf-box border-dashed py-16 text-center">
              <p className="font-serif text-[17px] italic text-ink-mid">
                Nenhum post ainda. Seja o primeiro a publicar.
              </p>
            </div>
          )}
        </div>
      )}

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-ink-low" />
        </div>
      )}
    </div>
  )
}
