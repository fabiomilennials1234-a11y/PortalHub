"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { UserMenu } from "./UserMenu"
import { MobileNav } from "./MobileNav"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import { cn } from "@/lib/utils"

interface Props {
  orgSlug: string
  orgName: string
  orgLogoUrl: string | null
  userRole: string
  fullName: string | null
  avatarUrl: string | null
  userId: string
  points: number
  level: number
}

interface TabItem {
  label: string
  segment: string
}

const TABS: TabItem[] = [
  { label: "Feed", segment: "community" },
  { label: "Cursos", segment: "courses" },
  { label: "Eventos", segment: "events" },
  { label: "Membros", segment: "members" },
  { label: "Ranking", segment: "leaderboard" },
]

export function Header({
  orgSlug,
  orgName,
  orgLogoUrl,
  userRole,
  fullName,
  avatarUrl,
  userId,
  points,
  level,
}: Props) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3 px-4 transition-[background-color,border-color,backdrop-filter] duration-200 sm:px-6",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNav
          orgSlug={orgSlug}
          orgName={orgName}
          orgLogoUrl={orgLogoUrl}
          userRole={userRole}
        />
      </div>

      <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
        {orgLogoUrl ? (
          <Image
            src={orgLogoUrl}
            alt={orgName}
            width={26}
            height={26}
            className="h-6 w-6 rounded-sm object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-ink text-[14px] font-semibold leading-none text-gold font-serif">
            P
          </div>
        )}
        <span className="hidden font-serif text-[15px] font-medium tracking-tight text-foreground xl:inline">
          <span className="text-ink-soft">{orgName}</span>
        </span>
      </div>

      <nav
        aria-label="Seções"
        className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
      >
        {TABS.map((tab) => {
          const href = `/${orgSlug}/${tab.segment}`
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={tab.segment}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-sm px-3 py-1.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "text-ink-mid hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-1 items-center justify-center px-1 sm:px-2 lg:flex-none lg:justify-end lg:px-0">
        <button
          type="button"
          aria-label="Buscar"
          className="group inline-flex h-8 max-w-md flex-1 items-center gap-2 rounded-sm border border-border bg-paper px-2.5 text-left transition-colors hover:border-ink-low/60 sm:px-3 lg:w-44 lg:flex-none xl:w-56"
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-ink-low" />
          <span className="truncate text-xs text-ink-mid">
            <span className="sm:hidden">Buscar…</span>
            <span className="hidden sm:inline lg:hidden xl:inline">Buscar membros, cursos, posts…</span>
            <span className="hidden lg:inline xl:hidden">Buscar…</span>
          </span>
          <span className="wf-mono ml-auto hidden md:inline lg:hidden xl:inline">⌘K</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <span className="hidden items-center gap-1.5 rounded-sm border border-gold px-2 py-[3px] md:inline-flex">
          <span className="h-[5px] w-[5px] rounded-full bg-gold" />
          <span className="wf-mono !text-[10.5px] !text-gold-dk">
            {points.toLocaleString("pt-BR")} <span className="hidden xl:inline">créditos</span>
          </span>
          <span className="wf-mono !text-[10px] !text-ink-low hidden xl:inline">·</span>
          <span className="wf-mono !text-[10.5px] !text-gold-dk hidden xl:inline">
            TIER {level}
          </span>
        </span>
        <NotificationBell />
        <UserMenu
          orgSlug={orgSlug}
          fullName={fullName}
          avatarUrl={avatarUrl}
          userId={userId}
        />
      </div>
    </header>
  )
}
