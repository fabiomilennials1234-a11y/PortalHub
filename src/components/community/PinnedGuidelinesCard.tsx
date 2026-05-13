import Link from "next/link"

interface PinnedGuidelinesCardProps {
  orgSlug: string
}

export function PinnedGuidelinesCard({ orgSlug }: PinnedGuidelinesCardProps) {
  return (
    <Link
      href={`/${orgSlug}/community/guidelines`}
      className="wf-box wf-box--hover block border-ink bg-gold-bg/40 p-3"
    >
      <div className="flex items-center gap-3">
        <span className="wf-pill wf-pill--gold shrink-0">Fixado</span>
        <span className="flex-1 truncate font-serif text-[17px] leading-snug text-foreground sm:text-[18px]">
          Diretrizes da comunidade · leia antes de postar
        </span>
        <span className="wf-mono shrink-0 !text-ink-mid">3d</span>
      </div>
    </Link>
  )
}
