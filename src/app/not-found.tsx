import Link from "next/link"
import { Compass } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Compass className="size-12 text-muted-foreground" />
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold">
          Página não encontrada
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
      </div>
      <Link href="/" className={buttonVariants()}>
        Voltar ao início
      </Link>
    </div>
  )
}
