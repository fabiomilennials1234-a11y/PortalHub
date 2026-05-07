"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, MessageSquare, BookOpen, Calendar, Trophy, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export function MobileNav({ orgSlug, orgName, orgLogoUrl, userRole }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = ["owner", "admin"].includes(userRole)

  const items = isAdmin
    ? [...NAV_ITEMS, { label: "Configurações", href: "settings", icon: Settings }]
    : NAV_ITEMS

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <nav
            className="fixed inset-y-0 left-0 w-64 border-r bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              {orgLogoUrl ? (
                <Image src={orgLogoUrl} alt={orgName} width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  {orgName[0]?.toUpperCase()}
                </div>
              )}
              <span className="truncate font-semibold">{orgName}</span>
            </div>
            <div className="space-y-1">
              {items.map((item) => {
                const href = `/${orgSlug}/${item.href}`
                const isActive = pathname.startsWith(href)
                return (
                  <Link
                    key={item.href}
                    href={href}
                    onClick={() => setOpen(false)}
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
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
