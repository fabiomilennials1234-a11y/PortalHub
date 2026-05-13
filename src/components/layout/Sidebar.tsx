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
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  orgSlug: string
  orgName: string
  orgLogoUrl: string | null
  userRole: string
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { label: "Comunidade", href: "community", icon: MessageSquare },
  { label: "Cursos", href: "courses", icon: BookOpen },
  { label: "Eventos", href: "events", icon: Calendar },
  { label: "Ranking", href: "leaderboard", icon: Trophy },
  { label: "Membros", href: "members", icon: Users },
]

const ADMIN_ITEMS: NavItem[] = [
  { label: "Configurações", href: "settings", icon: Settings },
]

export function Sidebar({ orgSlug, orgName, orgLogoUrl, userRole }: Props) {
  const pathname = usePathname()
  const isAdmin = ["owner", "admin"].includes(userRole)

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-border bg-paper lg:block xl:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          {orgLogoUrl ? (
            <Image
              src={orgLogoUrl}
              alt={orgName}
              width={28}
              height={28}
              className="h-7 w-7 rounded-sm object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-ink font-serif text-[15px] font-semibold text-gold">
              {orgName[0]?.toUpperCase() ?? "P"}
            </div>
          )}
          <span className="truncate font-serif text-[14.5px] font-medium tracking-tight text-foreground">
            {orgName}
          </span>
        </div>

        <nav className="flex-1 space-y-[2px] p-3">
          <div className="wf-mono mb-2 px-2 !text-[10px]">Navegação</div>
          {NAV_ITEMS.map((item) => {
            const href = `/${orgSlug}/${item.href}`
            const isActive = pathname.startsWith(href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-sm px-2.5 py-[7px] text-[13.5px] transition-colors",
                  isActive
                    ? "bg-paper-2 font-semibold text-foreground"
                    : "text-ink-soft hover:bg-paper-2/60 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    isActive ? "bg-gold" : "bg-ink-low/60",
                  )}
                />
                <Icon
                  className={cn(
                    "h-[15px] w-[15px] transition-colors",
                    isActive ? "text-gold-dk" : "text-ink-low",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {isAdmin && (
            <>
              <div className="wf-mono mb-2 mt-5 px-2 !text-[10px]">Admin</div>
              {ADMIN_ITEMS.map((item) => {
                const href = `/${orgSlug}/${item.href}`
                const isActive = pathname.startsWith(href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-sm px-2.5 py-[7px] text-[13.5px] transition-colors",
                      isActive
                        ? "bg-paper-2 font-semibold text-foreground"
                        : "text-ink-soft hover:bg-paper-2/60 hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        isActive ? "bg-gold" : "bg-ink-low/60",
                      )}
                    />
                    <Icon className="h-[15px] w-[15px] text-ink-low" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <div className="border-t border-border p-3">
          <div className="wf-mono mb-1 !text-[10px]">Edição</div>
          <p className="font-serif text-[13px] italic text-ink-mid">
            Comunidade · maio 2026
          </p>
        </div>
      </div>
    </aside>
  )
}
