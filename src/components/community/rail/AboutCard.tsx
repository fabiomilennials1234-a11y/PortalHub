interface AboutCardProps {
  description: string | null
  memberCount: number
  createdAt: string
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })
}

export function AboutCard({
  description,
  memberCount,
  createdAt,
}: AboutCardProps) {
  return (
    <div className="wf-box p-4">
      <span className="wf-mono">Sobre</span>
      {description ? (
        <p className="mt-2 font-serif text-[13.5px] leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : (
        <p className="mt-2 font-serif text-[13px] italic text-ink-mid">
          Sem descrição.
        </p>
      )}
      <dl className="mt-4 space-y-1.5 text-[11.5px]">
        <div className="flex justify-between">
          <dt className="text-ink-mid">Membros</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {memberCount.toLocaleString("pt-BR")}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-mid">Criada em</dt>
          <dd className="font-medium capitalize text-foreground">
            {formatCreatedAt(createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
