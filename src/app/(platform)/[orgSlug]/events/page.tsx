import { Calendar } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata = { title: "Eventos" }

export default function EventsPage() {
  return (
    <EmptyState
      icon={Calendar}
      title="Eventos"
      description="Calendário, RSVP e links de reunião aparecerão aqui. Disponível na Sprint 6."
    />
  )
}
