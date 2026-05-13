import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <h1 className="font-serif text-[88px] font-semibold leading-none tracking-tight text-gold-dk sm:text-[120px]">
          404
        </h1>
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-mid">
          Página não encontrada
        </p>
        <p className="mx-auto max-w-md font-serif text-[18px] leading-snug text-ink-soft">
          A página que você procura não existe, foi movida, ou nunca foi
          publicada.
        </p>
      </div>
      <Link href="/" className={buttonVariants()}>
        Voltar pro início
      </Link>
    </div>
  )
}
