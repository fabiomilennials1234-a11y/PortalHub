"use client"

import Image from "next/image"
import { useMemo } from "react"
import { cn, gradientFromId, getInitials } from "@/lib/utils"

interface GradientAvatarProps {
  userId: string
  name: string | null
  avatarUrl?: string | null
  size?: number
  ringClassName?: string
  className?: string
}

export function GradientAvatar({
  userId,
  name,
  avatarUrl,
  size = 40,
  ringClassName,
  className,
}: GradientAvatarProps) {
  const gradient = useMemo(() => gradientFromId(userId), [userId])
  const initials = useMemo(() => getInitials(name), [name])
  const fontPx = Math.max(10, Math.floor(size * 0.4))

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        ringClassName,
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={name ?? "Usuário"}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name ?? "Avatar"}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-semibold text-white"
          style={{
            background: gradient,
            fontSize: `${fontPx}px`,
            letterSpacing: "-0.01em",
          }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}
