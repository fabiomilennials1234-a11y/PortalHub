import { UserMenu } from "./UserMenu"
import { MobileNav } from "./MobileNav"
import { NotificationBell } from "@/components/notifications/NotificationBell"

interface Props {
  orgSlug: string
  orgName: string
  orgLogoUrl: string | null
  userRole: string
  fullName: string | null
  avatarUrl: string | null
  userId: string
}

export function Header({
  orgSlug,
  orgName,
  orgLogoUrl,
  userRole,
  fullName,
  avatarUrl,
  userId,
}: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav
          orgSlug={orgSlug}
          orgName={orgName}
          orgLogoUrl={orgLogoUrl}
          userRole={userRole}
        />
      </div>
      <div className="flex items-center gap-2">
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
