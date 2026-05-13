import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Diretrizes da comunidade" }

interface Props {
  params: Promise<{ orgSlug: string }>
}

export default async function GuidelinesPage({ params }: Props) {
  const { orgSlug } = await params

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div>
        <Link
          href={`/${orgSlug}/community`}
          className="wf-mono inline-flex items-center gap-2 !text-ink-mid transition-colors hover:!text-foreground"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          VOLTAR PARA O FEED
        </Link>
      </div>

      <header className="space-y-3 border-b border-line-soft pb-6">
        <span className="wf-mono">FIXADO · 3D</span>
        <h1 className="wf-hand text-[42px] sm:text-[52px]">
          Diretrizes da comunidade
        </h1>
        <p className="wf-mono">LEIA ANTES DE POSTAR</p>
      </header>

      <article className="wf-box border-ink bg-gold-bg/40 space-y-5 p-6 sm:p-8">
        <p className="font-serif text-[18px] leading-[1.6] text-foreground">
          Este é um espaço de prática. Postar aqui é praticar — em voz alta,
          com gente que te leva a sério. Trate cada thread como se valesse seu
          tempo, porque vale o tempo dos outros.
        </p>

        <div className="space-y-2">
          <h2 className="wf-mono !text-ink-soft">O QUE VALORIZAMOS</h2>
          <ul className="space-y-2 pl-5 font-serif text-[16px] leading-[1.65] text-ink-soft [&_li]:list-disc">
            <li>Contexto antes de pergunta. Quem é você, onde tá travando, o que já tentou.</li>
            <li>Respostas com substância. "Concordo" sem por quê não soma.</li>
            <li>Casos reais. Números, prints, antes/depois. Específico ganha de genérico.</li>
            <li>Desacordo respeitoso. Discorda da ideia, não da pessoa.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="wf-mono !text-ink-soft">O QUE NÃO TEM ESPAÇO</h2>
          <ul className="space-y-2 pl-5 font-serif text-[16px] leading-[1.65] text-ink-soft [&_li]:list-disc">
            <li>Auto-promo crua. Tem categoria certa pra isso — use.</li>
            <li>Pergunta repetida sem buscar. Use a busca antes.</li>
            <li>Conteúdo plágio ou gerado em massa por IA sem curadoria.</li>
            <li>Qualquer forma de ataque pessoal, assédio ou discurso de ódio.</li>
          </ul>
        </div>

        <p className="border-t border-line-soft pt-5 font-serif text-[15px] italic leading-[1.6] text-ink-mid">
          Moderação é leve mas firme. Quem soma ganha visibilidade. Quem só
          ruidaria some.
        </p>
      </article>
    </div>
  )
}
