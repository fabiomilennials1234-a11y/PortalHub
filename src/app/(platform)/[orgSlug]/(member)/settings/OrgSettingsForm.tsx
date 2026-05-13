"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateOrganization } from "@/actions/organizations"
import { Loader2 } from "lucide-react"
import type { Organization } from "@/types/database.types"

interface Props {
  org: Organization
}

export function OrgSettingsForm({ org }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    setSuccess(false)
    formData.set("org_id", org.id)
    const result = await updateOrganization(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setPending(false)
  }

  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid"

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className={labelClass}>
          Nome
        </Label>
        <Input id="name" name="name" defaultValue={org.name} maxLength={100} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className={labelClass}>
          Descrição
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={org.description ?? ""}
          maxLength={500}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logo_url" className={labelClass}>
          URL do logo
        </Label>
        <Input
          id="logo_url"
          name="logo_url"
          defaultValue={org.logo_url ?? ""}
          placeholder="https://..."
        />
      </div>
      {error && (
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-success">
          Salvo com sucesso
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar
      </Button>
    </form>
  )
}
