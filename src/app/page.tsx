import { APP_NAME } from "@/lib/constants"

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
      <p className="text-muted-foreground">
        Plataforma all-in-one de comunidades e cursos online
      </p>
    </div>
  )
}
