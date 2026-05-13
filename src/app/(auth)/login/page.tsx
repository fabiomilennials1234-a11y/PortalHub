import { LoginForm } from "./LoginForm"

export const metadata = { title: "Entrar" }

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="wf-mono">// acesso</span>
        <h1 className="wf-hand text-[44px] leading-[1.02]">
          Bem-vindo
          <br />
          <span className="text-gold-dk">de volta.</span>
        </h1>
        <p className="max-w-sm font-serif text-[15px] leading-relaxed text-ink-soft">
          Sua comunidade nao parou. Entre pra continuar de onde voce parou.
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
