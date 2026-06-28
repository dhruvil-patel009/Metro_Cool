import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js Edge Middleware
 *
 * Lightweight server-side check for protected routes.
 * Since the JWT is stored in localStorage (not cookies),
 * we can't fully validate the token here. But we CAN check
 * if the auth-storage cookie/header exists as a quick gate.
 *
 * The real guard is still client-side (ProtectedRoute, AuthGuard),
 * but this prevents the initial HTML from loading for obviously
 * unauthenticated requests — eliminating the flash.
 */

const PROTECTED_PREFIXES = ["/admin", "/technician", "/profile"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard protected routes
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for token in cookie (set by client as a signal)
  // We look for the "accessToken" cookie which the login flow sets
  const token = request.cookies.get("accessToken")?.value

  // If no token cookie, redirect to home immediately (no flash)
  if (!token || token === "null" || token === "undefined") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Basic JWT expiry check (decode without verification — edge can't use jsonwebtoken)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const isExpired = payload.exp * 1000 < Date.now()

    if (isExpired) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      // Clear the cookie
      const response = NextResponse.redirect(url)
      response.cookies.delete("accessToken")
      return response
    }
  } catch {
    // Can't decode — let client-side handle
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/technician/:path*", "/profile/:path*"],
}
