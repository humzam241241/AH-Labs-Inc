import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/account"
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const destination = new URL(safeNext(request.nextUrl.searchParams.get("next")), request.url)
  const response = NextResponse.redirect(destination)

  if (!code) {
    response.headers.set("Location", new URL("/account?auth=failed", request.url).toString())
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""

  const supabase = createServerClient(supabaseUrl, publicKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    response.headers.set("Location", new URL("/account?auth=failed", request.url).toString())
  }

  return response
}
