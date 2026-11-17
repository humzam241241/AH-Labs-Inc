import { NextResponse } from "next/server"
import { requireMasterAccount } from "@/lib/account-access"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const access = await requireMasterAccount()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
  const body = await request.json().catch(() => null) as { status?: unknown } | null
  const status = body?.status
  if (status !== "approved" && status !== "rejected") return NextResponse.json({ message: "Choose approve or decline." }, { status: 400 })
  const admin = createSupabaseAdminClient()
  const { data: updated, error } = await admin
    .from("profiles")
    .update({
      status,
      approved_at: status === "approved" ? new Date().toISOString() : null,
      approved_by: status === "approved" ? access.account.user.id : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("role", "customer")
    .select("id, status")
    .maybeSingle()

  if (error) {
    console.error("Could not update customer application", error.message)
    return NextResponse.json({ message: "Could not update the application." }, { status: 500 })
  }
  if (!updated) return NextResponse.json({ message: "That customer application no longer exists." }, { status: 404 })
  return NextResponse.json({ ok: true, status: updated.status })
}