import { Trophy } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata = { title: "Leaderboard" }

export default function LeaderboardPage() {
  return (
    <EmptyState
      icon={Trophy}
      title="Leaderboard"
      description="Rankings, pontos e conquistas aparecerão aqui. Disponível na Sprint 4."
    />
  )
}
