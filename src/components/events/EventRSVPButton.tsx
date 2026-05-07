"use client"

import { useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Check, UserPlus, Loader2 } from "lucide-react"
import {
  registerForEvent,
  unregisterFromEvent,
} from "@/actions/events"
import { useEvent } from "@/hooks/useEvent"

interface EventRSVPButtonProps {
  eventId: string
}

export function EventRSVPButton({ eventId }: EventRSVPButtonProps) {
  const { isRegistered } = useEvent(eventId)
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  function handleClick() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("event_id", eventId)

      if (isRegistered) {
        await unregisterFromEvent(formData)
      } else {
        await registerForEvent(formData)
      }

      queryClient.invalidateQueries({ queryKey: ["event-registration", eventId] })
      queryClient.invalidateQueries({ queryKey: ["event", eventId] })
      queryClient.invalidateQueries({ queryKey: ["events"] })
    })
  }

  return (
    <Button
      variant={isRegistered ? "secondary" : "default"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isRegistered ? (
        <Check className="size-4" />
      ) : (
        <UserPlus className="size-4" />
      )}
      {isRegistered ? "Inscrito" : "Inscrever-se"}
    </Button>
  )
}
