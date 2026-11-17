import { NextResponse } from "next/server"
import { requireMasterAccount } from "@/lib/account-access"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function numberOrNull(value: unknown, { integer = false } = {}) {
  if (value === "" || value == null) return null
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) return null
  return integer ? Math.round(number) : number
}

export async function PATCH(request: Request) {
  const access = await requireMasterAccount()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })

  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const itemKey = typeof body?.itemKey === "string" ? body.itemKey.trim().toLowerCase() : ""
  if (!itemKey) return NextResponse.json({ message: "A catalog item is required." }, { status: 400 })

  const basePriceCents = numberOrNull(body?.basePriceCents, { integer: true })
  const markupPercent = numberOrNull(body?.markupPercent)
  const priceCents = numberOrNull(body?.priceCents, { integer: true })
  if (body?.basePriceCents !== "" && body?.basePriceCents != null && basePriceCents == null) return NextResponse.json({ message: "Base price must be a non-negative number." }, { status: 400 })
  if (body?.markupPercent !== "" && body?.markupPercent != null && markupPercent == null) return NextResponse.json({ message: "Markup must be a non-negative number." }, { status: 400 })
  if (body?.priceCents !== "" && body?.priceCents != null && priceCents == null) return NextResponse.json({ message: "Selling price must be a non-negative number." }, { status: 400 })

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("catalog_items")
    .update({
      base_price_cents: basePriceCents,
      markup_percent: markupPercent ?? 0,
      price_cents: priceCents,
      updated_at: new Date().toISOString(),
    })
    .eq("item_key", itemKey)
    .select("item_key, base_price_cents, markup_percent, price_cents, active")
    .maybeSingle()

  if (error) {
    console.error("Could not update catalog item", error.message)
    return NextResponse.json({ message: "Could not save this catalog price." }, { status: 500 })
  }
  if (!data) return NextResponse.json({ message: "Catalog item was not found." }, { status: 404 })
  return NextResponse.json({ ok: true, item: data })
}
