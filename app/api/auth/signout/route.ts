import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()

  if (request.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
  }

  const response = NextResponse.redirect(new URL("/account?signed_out=1", request.url), 303)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function GET(request: Request) {
  return POST(request)
}
