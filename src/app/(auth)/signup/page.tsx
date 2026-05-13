import { SignupForm } from "./SignupForm"

export const metadata = { title: "Criar conta" }

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="wf-pill wf-pill--gold">comeca em 30 segundos</span>
        <h1 className="wf-hand text-[44px] leading-[1.02]">
          Cria sua
          <br />
          <span className="text-gold-dk">conta.</span>
        </h1>
        <p className="max-w-sm font-serif text-[15px] leading-relaxed text-ink-soft">
          Sem formulario de 12 campos. So o essencial — voce pode completar seu
          perfil depois.
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
