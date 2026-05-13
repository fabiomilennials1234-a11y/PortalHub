import Image from "next/image"

interface CommunityHeroProps {
  orgName: string
  bannerUrl: string | null
  memberCount: number
  onlineCount: number
  postsToday: number
}

export function CommunityHero({
  orgName,
  bannerUrl,
  memberCount,
  onlineCount,
  postsToday,
}: CommunityHeroProps) {
  return (
    <section className="wf-box relative overflow-hidden">
      {bannerUrl ? (
        <div className="relative h-[160px] w-full">
          <Image
            src={bannerUrl}
            alt={orgName}
            fill
            sizes="(min-width: 1024px) 680px, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-transparent" />
        </div>
      ) : null}
      <div className="flex items-end gap-5 px-5 py-5">
        <div className="flex-1">
          <span className="wf-mono">Comunidade</span>
          <h1 className="wf-hand mt-1.5 text-[32px]">{orgName}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] tabular-nums text-ink-mid">
            <span>{memberCount.toLocaleString("pt-BR")} membros</span>
            <span className="text-ink-low">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_currentColor]" />
              {onlineCount} online
            </span>
            <span className="text-ink-low">·</span>
            <span>{postsToday} posts hoje</span>
          </p>
        </div>
      </div>
    </section>
  )
}
