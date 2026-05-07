"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { joinOrganization } from "@/actions/memberships"
import { Loader2 } from "lucide-react"

interface Props {
  orgId: string
  orgSlug: string
}

export function JoinButton({ orgId, orgSlug }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function handleJoin() {
    setPending(true)
    setError(null)
    const formData = new FormData()
    formData.set("org_id", orgId)
    const result = await joinOrganization(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else {
      router.push(`/${orgSlug}/community`)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleJoin} disabled={pending} className="w-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Entrar na comunidade
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
