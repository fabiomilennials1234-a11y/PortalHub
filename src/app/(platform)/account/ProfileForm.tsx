"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { updateProfile } from "@/actions/profile"
import { Save, Loader2, Check } from "lucide-react"

interface ProfileFormProps {
  userId: string
  initialFullName: string
  initialBio: string
  initialAvatarUrl: string
}

export function ProfileForm({
  initialFullName,
  initialBio,
  initialAvatarUrl,
}: ProfileFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState(initialFullName)
  const [bio, setBio] = useState(initialBio)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", fullName)
      formData.set("bio", bio)
      formData.set("avatar_url", avatarUrl)
      const result = await updateProfile(formData)
      if (result.data) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      }
    })
  }

  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid"

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className={labelClass}>Foto de perfil</Label>
        <div className="max-w-[200px]">
          <ImageUpload
            bucket="avatars"
            value={avatarUrl}
            onChange={(url) => setAvatarUrl(url ?? "")}
            aspectRatio="square"
            label="Avatar"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className={labelClass}>
          Nome completo
        </Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFullName(e.target.value)
          }
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className={labelClass}>
          Bio
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setBio(e.target.value)
          }
          maxLength={500}
          rows={3}
          placeholder="Conte um pouco sobre você..."
        />
        <p className="font-mono text-[10px] tabular-nums text-ink-low">
          {bio.length}/500
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={isPending || !fullName.trim()}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : saved ? (
            <Check className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {saved ? "Salvo" : "Salvar"}
        </Button>
      </div>
    </div>
  )
}
