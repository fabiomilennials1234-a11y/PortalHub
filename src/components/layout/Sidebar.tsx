"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  BookOpen,
  Calendar,
  Trophy,
  Users,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  orgSlug: string
  orgName: string
  orgLogoUrl: string | null
  userRole: string
}

const NAV_ITEMS = [
  { label: "Comunidade", href: "community", icon: MessageSquare },
  { label: "Cursos", href: "courses", icon: BookOpen },
  { label: "Eventos", href: "events", icon: Calendar },
  { label: "Leaderboard", href: "leaderboard", icon: Trophy },
  { label: "Membros", href: "members", icon: Users },
]

const ADMIN_ITEMS = [
  { label: "Configurações", href: "settings", icon: Settings },
]

export function Sidebar({ orgSlug, orgName, orgLogoUrl, userRole }: Props) {
  const pathname = usePathname()
  const isAdmin = ["owner", "admin"].includes(userRole)

  const items = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-3 border-b px-4">
          {orgLogoUrl ? (
            <Image
              src={orgLogoUrl}
              alt={orgName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              {orgName[0]?.toUpperCase()}
            </div>
          )}
          <span className="truncate font-semibold">{orgName}</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const href = `/${orgSlug}/${item.href}`
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
