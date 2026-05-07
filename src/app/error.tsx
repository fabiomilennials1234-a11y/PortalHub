"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="size-12 text-amber-500" />
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold">
          Algo deu errado
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Encontramos um erro inesperado. Tente novamente ou volte para a
          página inicial.
        </p>
        {error.digest && (
          <p className="font-mono text-[10px] text-muted-foreground/60">
            ref: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
