import { NextRequest, NextResponse } from "next/server"

const CACHE_COOKIE = "_medusa_cache_id"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (!request.cookies.has(CACHE_COOKIE)) {
    response.cookies.set(CACHE_COOKIE, crypto.randomUUID(), {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
