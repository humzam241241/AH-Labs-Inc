import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

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
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user && process.env.SUPABASE_SECRET_KEY) {
    const isOwner = user.email?.toLowerCase() === "mystrey827@gmail.com"
    const admin = createSupabaseAdminClient()
    const { error: profileError } = await admin.from("profiles").upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      status: isOwner ? "approved" : "pending",
      role: isOwner ? "master" : "customer",
      approved_at: isOwner ? new Date().toISOString() : null,
    }, { onConflict: "id", ignoreDuplicates: true })
    if (profileError) console.error("Could not create AH Gifts profile after Google sign-in", profileError.message)
    const { error: loyaltyError } = await admin.from("loyalty_accounts").upsert({ customer_id: user.id, points_balance: 0 }, { onConflict: "customer_id", ignoreDuplicates: true })
    if (loyaltyError) console.error("Could not create AH Gifts loyalty account", loyaltyError.message)
  }

  return response
}
