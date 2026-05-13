export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1320px] grid-cols-1 lg:grid-cols-2">
        {/* Left: form */}
        <div className="flex flex-col justify-between border-r border-line bg-paper px-6 py-10 sm:px-12 lg:px-14 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-ink bg-gold-bg font-serif text-[22px] font-bold text-ink">
              P
            </div>
            <span className="wf-hand text-[18px]">PortalHub</span>
          </div>

          <div className="flex w-full max-w-[420px] flex-col">
            {children}
          </div>

          <div className="flex items-center justify-between text-[11px] wf-mono">
            <span>portalhub · {new Date().getFullYear()}</span>
            <span>plataforma editorial</span>
          </div>
        </div>

        {/* Right: manifesto */}
        <div className="relative hidden flex-col justify-between bg-paper-2 px-12 py-12 lg:flex">
          <div className="wf-mono">// manifesto</div>

          <div className="space-y-10">
            <h2 className="wf-hand text-[44px] leading-[1.05] tracking-tight">
              Pipeline e treinamento
              <br />
              no <span className="wf-underline-soft">mesmo lugar</span>.
            </h2>
            <p className="max-w-md font-serif text-[15.5px] leading-relaxed text-ink-soft">
              A comunidade que ensina, distribui e remunera. Cursos, eventos e
              creditos como infraestrutura unica — nao quatro apps soltos.
            </p>

            <ul className="space-y-3 max-w-md">
              {[
                ["01", "Feed", "discussoes editoriais com creditos por contribuicao"],
                ["02", "Cursos", "trilhas com progresso, certificados e gating por TIER"],
                ["03", "Creditos", "engajamento mensuravel, leaderboard, recompensas"],
                ["04", "Eventos", "lives e encontros com RSVP e check-in"],
              ].map(([n, label, desc]) => (
                <li
                  key={n}
                  className="flex items-baseline gap-4 border-b border-line-faint pb-3"
                >
                  <span className="wf-mono shrink-0">{n}</span>
                  <span className="font-serif text-[14.5px] font-medium text-foreground">
                    {label}
                  </span>
                  <span className="hidden text-[12.5px] text-ink-mid xl:inline">
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="wf-mono text-ink-low">
            // construido pra times que pensam em decadas
          </div>
        </div>
      </div>
    </div>
  )
}
