import { MessageSquare } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata = { title: "Comunidade" }

export default function CommunityPage() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Feed da comunidade"
      description="Posts, discussões e anúncios aparecerão aqui. Disponível na Sprint 2."
    />
  )
}
