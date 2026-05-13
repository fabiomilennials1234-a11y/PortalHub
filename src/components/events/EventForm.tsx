"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createEvent } from "@/actions/events"
import { Save, Loader2 } from "lucide-react"

interface EventFormProps {
  orgId: string
  orgSlug: string
}

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid"

export function EventForm({ orgId, orgSlug }: EventFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [locationUrl, setLocationUrl] = useState("")
  const [locationLabel, setLocationLabel] = useState("")
  const [maxAttendees, setMaxAttendees] = useState("")

  function handleSubmit() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("org_id", orgId)
      formData.set("title", title)
      formData.set("description", description)
      formData.set("starts_at", new Date(startsAt).toISOString())
      formData.set("ends_at", new Date(endsAt).toISOString())
      if (locationUrl) formData.set("location_url", locationUrl)
      if (locationLabel) formData.set("location_label", locationLabel)
      if (maxAttendees) formData.set("max_attendees", maxAttendees)

      const result = await createEvent(formData)
      if (result.data) {
        router.push(`/${orgSlug}/events/${result.data.id}`)
      }
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="event-title" className={labelClass}>
          Título
        </Label>
        <Input
          id="event-title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          maxLength={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-desc" className={labelClass}>
          Descrição
        </Label>
        <Textarea
          id="event-desc"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          rows={4}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-start" className={labelClass}>
            Início
          </Label>
          <Input
            id="event-start"
            type="datetime-local"
            value={startsAt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStartsAt(e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-end" className={labelClass}>
            Fim
          </Label>
          <Input
            id="event-end"
            type="datetime-local"
            value={endsAt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEndsAt(e.target.value)
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-location" className={labelClass}>
          Local · rótulo
        </Label>
        <Input
          id="event-location"
          value={locationLabel}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocationLabel(e.target.value)
          }
          placeholder="Ex: Zoom, Discord"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-url" className={labelClass}>
          URL do encontro
        </Label>
        <Input
          id="event-url"
          type="url"
          value={locationUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocationUrl(e.target.value)
          }
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-max" className={labelClass}>
          Limite de inscritos · opcional
        </Label>
        <Input
          id="event-max"
          type="number"
          min="1"
          value={maxAttendees}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMaxAttendees(e.target.value)
          }
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isPending || !title.trim() || !startsAt || !endsAt}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Criar evento
      </Button>
    </div>
  )
}
