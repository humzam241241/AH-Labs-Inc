import { NextResponse } from "next/server"
import { requireMasterAccount } from "@/lib/account-access"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type OrderLine = Record<string, unknown>

function cleanText(value: unknown, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function cleanLines(value: unknown) {
  if (!Array.isArray(value)) return null
  const lines: OrderLine[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue
    const line = raw as Record<string, unknown>
    const productName = cleanText(line.productName || line.name, 180)
    if (!productName) continue
    const quantity = Math.min(999, Math.max(1, Math.round(Number(line.quantity) || 1)))
    const unitPriceCents = Math.max(0, Math.round(Number(line.unitPriceCents) || 0))
    lines.push({
      ...line,
      productName,
      quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * quantity,
    })
  }
  return lines
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const access = await requireMasterAccount()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })

  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const lines = cleanLines(body?.items)
  if (!lines || !lines.length) return NextResponse.json({ message: "Add at least one order item." }, { status: 400 })
  const status = typeof body?.status === "string" ? body.status.trim().slice(0, 40) : null
  const orderNumber = cleanText(body?.orderNumber, 80)
  const totalCents = lines.reduce((sum, line) => sum + Number(line.lineTotalCents || 0), 0)

  const update: Record<string, unknown> = { items: lines, total_cents: totalCents }
  if (status) update.status = status
  if (orderNumber) update.order_number = orderNumber

  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .update(update)
    .eq("id", params.id)
    .select("id, order_number, status, items, total_cents, currency, updated_at")
    .maybeSingle()

  if (error) {
    console.error("Could not update order", error.message)
    return NextResponse.json({ message: "Could not save this order." }, { status: 500 })
  }
  if (!data) return NextResponse.json({ message: "Order was not found." }, { status: 404 })
  return NextResponse.json({ ok: true, order: data })
}
