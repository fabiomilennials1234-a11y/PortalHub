const ALLOWED_VIDEO_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "vimeo.com",
  "www.vimeo.com",
  "loom.com",
  "www.loom.com",
]

export function isAllowedVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_VIDEO_HOSTS.includes(parsed.hostname)
  } catch {
    return false
  }
}

export function extractVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname === "/watch"
    ) {
      const videoId = parsed.searchParams.get("v")
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1)
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const match = parsed.pathname.match(/\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }

    if (parsed.hostname.includes("loom.com")) {
      const match = parsed.pathname.match(/\/share\/([a-zA-Z0-9]+)/)
      if (match) return `https://www.loom.com/embed/${match[1]}`
    }

    return null
  } catch {
    return null
  }
}
