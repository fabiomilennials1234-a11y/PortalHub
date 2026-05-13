"use client"

import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Check,
  Loader2,
  Heart,
  MessageSquare,
  Trophy,
  Calendar,
  AtSign,
  Bell as BellIcon,
} from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/actions/notifications"
import { cn } from "@/lib/utils"
import type { NotificationType } from "@/types/domain"

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "agora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

function iconForType(type: NotificationType | string) {
  switch (type) {
    case "post_reply":
    case "comment_reply":
      return MessageSquare
    case "mention":
      return AtSign
    case "achievement":
      return Trophy
    case "event_reminder":
      return Calendar
    case "course_update":
      return Heart
    default:
      return BellIcon
  }
}

export function NotificationBell() {
  const { notifications, unreadCount, isLoading } = useNotifications(15)
  const queryClient = useQueryClient()
  const [markingAll, setMarkingAll] = useState(false)
  const [pulse, setPulse] = useState(false)
  const prevUnreadRef = useRef(unreadCount)

  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 1200)
      prevUnreadRef.current = unreadCount
      return () => clearTimeout(t)
    }
    prevUnreadRef.current = unreadCount
  }, [unreadCount])

  async function handleMarkOne(id: string) {
    const formData = new FormData()
    formData.set("notification_id", id)
    await markNotificationRead(formData)
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
  }

  async function handleMarkAll() {
    setMarkingAll(true)
    await markAllNotificationsRead()
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
    setMarkingAll(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative text-ink-soft hover:text-foreground"
          >
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center">
                {pulse && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
                )}
                <span className="relative flex size-4 items-center justify-center rounded-full bg-destructive font-mono text-[10px] font-medium tabular-nums text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="space-y-0.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
              Caixa
            </p>
            <h3 className="font-serif text-[15px] font-semibold leading-none text-foreground">
              Notificações
            </h3>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleMarkAll}
              disabled={markingAll}
              className="font-mono text-[10px] uppercase tracking-[0.06em] text-gold-dk"
            >
              {markingAll ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Check className="size-3" />
              )}
              Marcar tudo
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-4 animate-spin text-ink-low" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="py-10 text-center font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mid">
              Sem notificações
            </p>
          ) : (
            <div className="divide-y divide-line-soft">
              {notifications.map((n) => {
                const Icon = iconForType(n.type)
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => !n.read && handleMarkOne(n.id)}
                    className={cn(
                      "block w-full px-4 py-3 text-left transition-colors hover:bg-paper-2",
                      !n.read && "bg-gold-bg/40",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 size-3.5 shrink-0 text-ink-low" />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p
                          className={cn(
                            "truncate text-[13px] leading-snug text-foreground",
                            !n.read && "font-medium",
                          )}
                        >
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="line-clamp-2 text-[12px] leading-snug text-ink-mid">
                            {n.body}
                          </p>
                        )}
                      </div>
                      <span className="wf-mono shrink-0 self-start">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
