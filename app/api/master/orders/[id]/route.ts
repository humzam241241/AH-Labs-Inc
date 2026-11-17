import { NextResponse } from "next/server"
import { requireMasterAccount } from "@/lib/account-access"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type OrderLine = Record<string, unknown>

const allowedStatuses = new Set(["pending", "awaiting_payment", "paid", "in_production", "ready", "delivered", "completed", "cancelled", "refunded"])

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
    const quantity = Math.min(28, Math.max(1, Math.round(Number(line.quantity) || 1)))
    const rawUnitPrice = line.unitPriceCents
    const unitPriceCents = rawUnitPrice === null || rawUnitPrice === undefined || rawUnitPrice === ""
      ? null
      : Math.min(10_000_000, Math.max(0, Math.round(Number(rawUnitPrice) || 0)))
    lines.push({
      ...line,
      productName,
      quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents === null ? null : unitPriceCents * quantity,
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
  if (status && !allowedStatuses.has(status)) return NextResponse.json({ message: "That order status is not supported." }, { status: 400 })
  const orderNumber = cleanText(body?.orderNumber, 80)
  const totalCents = lines.some((line) => line.unitPriceCents === null)
    ? null
    : lines.reduce((sum, line) => sum + Number(line.lineTotalCents || 0), 0)

  const update: Record<string, unknown> = { items: lines, total_cents: totalCents }
  if (status) update.status = status
  if (orderNumber) update.order_number = orderNumber

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("orders")
    .update(update)
    .eq("id", params.id)
    .select("id, order_number, status, items, total_cents, currency")
    .maybeSingle()

  if (error) {
    console.error("Could not update order", error.message)
    return NextResponse.json({ message: "Could not save this order." }, { status: 500 })
  }
  if (!data) return NextResponse.json({ message: "Order was not found." }, { status: 404 })

  let invoiceSynced = false
  if (totalCents !== null) {
    const { error: invoiceError } = await admin
      .from("invoices")
      .update({ total_cents: totalCents })
      .eq("order_id", params.id)
      .eq("status", "issued")
    invoiceSynced = !invoiceError
    if (invoiceError) console.error("Could not sync issued invoice", invoiceError.message)
  }

  return NextResponse.json({ ok: true, invoiceSynced, order: data })
}
