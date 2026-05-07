"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Check, Loader2 } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/actions/notifications"
import { cn } from "@/lib/utils"

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

export function NotificationBell() {
  const { notifications, unreadCount, isLoading } = useNotifications(15)
  const queryClient = useQueryClient()
  const [markingAll, setMarkingAll] = useState(false)

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
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white tabular-nums">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <h3 className="text-sm font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleMarkAll}
              disabled={markingAll}
            >
              {markingAll ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Check className="size-3" />
              )}
              Marcar todas
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Sem notificações.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.read && handleMarkOne(n.id)}
                  className={cn(
                    "w-full px-3 py-2 text-left transition-colors hover:bg-muted/50",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    )}
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.body && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {n.body}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
