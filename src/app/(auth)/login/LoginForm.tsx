"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signInWithOAuth, signInWithMagicLink } from "@/actions/auth"
import { Loader2, Mail } from "lucide-react"

export function LoginForm() {
  const [mode, setMode] = useState<"password" | "magic-link">("password")
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [pending, setPending] = useState(false)

  async function handlePasswordLogin(formData: FormData) {
    setPending(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  async function handleMagicLink(formData: FormData) {
    setPending(true)
    setError(null)
    const result = await signInWithMagicLink(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setMagicLinkSent(true)
    }
    setPending(false)
  }

  async function handleGoogle() {
    setPending(true)
    setError(null)
    const result = await signInWithOAuth("google")
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="wf-box p-8 text-center">
        <Mail className="mx-auto mb-4 h-10 w-10 text-gold-dk" />
        <h2 className="wf-hand text-[22px]">Verifique seu email</h2>
        <p className="mt-2 font-serif text-[14px] leading-relaxed text-ink-soft">
          Enviamos um link de acesso. Clica nele pra entrar.
        </p>
        <p className="wf-mono mt-4 text-ink-low">link valido por 1h</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        className="w-full border-line bg-paper hover:border-ink-low hover:bg-paper-2"
        onClick={handleGoogle}
        disabled={pending}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="font-medium">Continuar com Google</span>
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line-soft" />
        <span className="wf-mono text-ink-low">ou</span>
        <div className="h-px flex-1 bg-line-soft" />
      </div>

      {mode === "password" ? (
        <form action={handlePasswordLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="wf-mono">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="voce@trabalho.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="wf-mono">
                Senha
              </Label>
              <button
                type="button"
                onClick={() => setMode("magic-link")}
                className="wf-mono text-gold-dk hover:underline"
              >
                Esqueci a senha
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="border-l-2 border-destructive pl-3 font-serif text-[13.5px] italic text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
          <button
            type="button"
            onClick={() => setMode("magic-link")}
            className="wf-mono block w-full text-center text-ink-mid hover:text-gold-dk"
          >
            ou entrar com link magico
          </button>
        </form>
      ) : (
        <form action={handleMagicLink} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="wf-mono">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="voce@trabalho.com"
              required
              autoComplete="email"
            />
          </div>
          {error && (
            <p className="border-l-2 border-destructive pl-3 font-serif text-[13.5px] italic text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar link magico
          </Button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className="wf-mono block w-full text-center text-ink-mid hover:text-gold-dk"
          >
            voltar pra entrar com senha
          </button>
        </form>
      )}

      <div className="border-t border-line-faint pt-5 text-center font-serif text-[14px] text-ink-soft">
        Nao tem conta?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:text-gold-dk hover:underline"
        >
          Cria uma
        </Link>
      </div>
    </div>
  )
}
