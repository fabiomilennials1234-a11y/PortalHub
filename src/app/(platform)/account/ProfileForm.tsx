"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile } from "@/actions/profile"
import { Save, Loader2, Check } from "lucide-react"

interface ProfileFormProps {
  userId: string
  initialFullName: string
  initialBio: string
  initialAvatarUrl: string
}

function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback className="text-lg">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium">Foto de perfil</p>
          <p className="text-xs text-muted-foreground">
            Cole uma URL pública de imagem.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">URL da foto</Label>
        <Input
          id="avatar"
          type="url"
          value={avatarUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvatarUrl(e.target.value)
          }
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
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
        <Label htmlFor="bio">Bio</Label>
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
        <p className="text-[10px] text-muted-foreground tabular-nums">
          {bio.length}/500
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleSave}
          disabled={isPending || !fullName.trim()}
        >
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
