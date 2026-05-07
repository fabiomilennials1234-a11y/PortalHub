import { LoginForm } from "./LoginForm"

export const metadata = { title: "Entrar" }

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Acesse sua conta para continuar
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
