import { createSupabaseServerClient } from "@/lib/supabase/server"

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

  return { user, profile: data as AccountProfile | null }
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