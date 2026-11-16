import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return response
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => { request.cookies.set(name, value); response = NextResponse.next({ request }); response.cookies.set(name, value, options) }) } })
  await supabase.auth.getUser()
  return response
}

export const config = { matcher: ["/account/:path*", "/auth/callback"] }
