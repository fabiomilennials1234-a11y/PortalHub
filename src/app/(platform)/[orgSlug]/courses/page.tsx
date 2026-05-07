import { BookOpen } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata = { title: "Cursos" }

export default function CoursesPage() {
  return (
    <EmptyState
      icon={BookOpen}
      title="Cursos"
      description="Módulos, aulas e progresso aparecerão aqui. Disponível na Sprint 3."
    />
  )
}
