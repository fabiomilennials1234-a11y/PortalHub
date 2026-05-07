import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">Página não encontrada</p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Voltar ao início
      </Link>
    </div>
  )
}
