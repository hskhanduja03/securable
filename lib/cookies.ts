import { NextResponse } from "next/server";

export function setRefreshCookie(res: Response | NextResponse, token: string) {
  const cookie = `refreshToken=${token}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=${
    30 * 24 * 60 * 60
  }`;
  // In Next.js route handlers, you can return NextResponse and set headers.
  // Example: res.headers.append('Set-Cookie', cookie)
}
