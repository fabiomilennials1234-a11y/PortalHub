import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const AUTH_ROUTES = ["/login", "/signup"]
const PUBLIC_PREFIXES = ["/api/", "/auth/"]
const PUBLIC_PATHS = new Set(["/", "/pricing", "/robots.txt", "/sitemap.xml"])

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))

  if (!user && !isAuthRoute && !isPublic) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
