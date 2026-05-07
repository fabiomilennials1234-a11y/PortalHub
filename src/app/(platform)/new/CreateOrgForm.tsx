"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOrganization } from "@/actions/organizations"
import { Loader2 } from "lucide-react"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
}

export function CreateOrgForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManual, setSlugManual] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugManual) setSlug(slugify(value))
  }

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    try {
      const result = await createOrganization(formData)
      if (result?.error) {
        setError(result.error)
        setPending(false)
        return
      }
      if (result?.data?.slug) {
        router.push(`/${result.data.slug}/community`)
        router.refresh()
        return
      }
      setPending(false)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao criar org",
      )
      setPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome da comunidade</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Minha Comunidade"
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug">URL</Label>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>portalhub.com/</span>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugManual(true)
            }}
            placeholder="minha-comunidade"
            required
            maxLength={50}
            pattern="^[a-z0-9-]+$"
            className="flex-1"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Sobre o que é essa comunidade?"
          maxLength={500}
          rows={3}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Criar comunidade
      </Button>
    </form>
  )
}
