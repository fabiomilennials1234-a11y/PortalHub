"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <h1 className="font-serif text-[88px] font-semibold leading-none tracking-tight text-gold-dk sm:text-[120px]">
          500
        </h1>
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-mid">
          Algo deu errado
        </p>
        <p className="mx-auto max-w-md font-serif text-[18px] leading-snug text-ink-soft">
          Encontramos um erro inesperado. Tente novamente, ou volte para o
          início.
        </p>
        {error.digest && (
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-low">
            ref: {error.digest}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Voltar pro início
        </Link>
      </div>
    </div>
  )
}
