import { SignupForm } from "./SignupForm"

export const metadata = { title: "Criar conta" }

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Comece a construir sua comunidade
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
