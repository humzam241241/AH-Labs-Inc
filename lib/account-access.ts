import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server"

const OWNER_EMAIL = "mystrey827@gmail.com"

export type AccountProfile = {
  id: string
  email: string | null
  full_name: string | null
  status: "pending" | "approved" | "rejected" | "suspended"
  role: "customer" | "master"
}

export async function currentAccount() {
  const auth = createSupabaseServerClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return { user: null, profile: null as AccountProfile | null }

  const { data } = await auth
    .from("profiles")
    .select("id, email, full_name, status, role")
    .eq("id", user.id)
    .maybeSingle()

  if (data) return { user, profile: data as AccountProfile }

  // Self-heal users created before the profile trigger was installed, or when
  // a trigger insert failed. Otherwise the account page looks pending while
  // the master desk has no profile row to display.
  const isOwner = user.email?.toLowerCase() === OWNER_EMAIL
  const admin = createSupabaseAdminClient()
  const { data: created } = await admin
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      status: isOwner ? "approved" : "pending",
      role: isOwner ? "master" : "customer",
      approved_at: isOwner ? new Date().toISOString() : null,
    }, { onConflict: "id" })
    .select("id, email, full_name, status, role")
    .single()

  if (created) {
    await admin
      .from("loyalty_accounts")
      .upsert({ customer_id: user.id, points_balance: 0 }, { onConflict: "customer_id" })
  }

  return { user, profile: (created as AccountProfile | null) }
}

export async function requireApprovedCustomer() {
  const account = await currentAccount()
  if (!account.user) return { error: "Sign in before placing an order.", status: 401 as const }
  if (!account.profile || account.profile.status !== "approved") {
    return { error: "Your AH Gifts account is awaiting approval.", status: 403 as const }
  }
  return { account }
}

export async function requireMasterAccount() {
  const account = await currentAccount()
  if (!account.user || account.profile?.role !== "master" || account.profile.status !== "approved") {
    return { error: "Master account access is required.", status: 403 as const }
  }
  return { account }
}