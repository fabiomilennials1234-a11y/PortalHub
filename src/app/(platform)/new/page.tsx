import { CreateOrgForm } from "./CreateOrgForm"

export const metadata = { title: "Nova comunidade" }

export default function NewOrgPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Criar comunidade
          </h1>
          <p className="text-sm text-muted-foreground">
            Dê um nome, escolha um slug e comece a construir
          </p>
        </div>
        <CreateOrgForm />
      </div>
    </div>
  )
}
