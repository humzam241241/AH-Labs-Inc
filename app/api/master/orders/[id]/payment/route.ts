import { NextResponse } from "next/server"
import { requireMasterAccount } from "@/lib/account-access"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const access = await requireMasterAccount()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
  const body = await request.json().catch(() => null) as { totalCents?: unknown } | null
  const totalCents = Math.round(Number(body?.totalCents))
  if (!Number.isInteger(totalCents) || totalCents < 1 || totalCents > 10_000_000) return NextResponse.json({ message: "Enter a valid paid amount." }, { status: 400 })

  const admin = createSupabaseAdminClient()
  const { data: order, error: orderError } = await admin.from("orders").select("id, customer_id, order_number, paid_at, currency").eq("id", params.id).maybeSingle()
  if (orderError || !order) return NextResponse.json({ message: "Order not found." }, { status: 404 })
  if (order.paid_at) return NextResponse.json({ message: "This order has already been marked paid." }, { status: 409 })

  const paidAt = new Date().toISOString()
  const invoiceNumber = `AHI-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  const points = Math.floor(totalCents / 100)
  const { error: updateError } = await admin.from("orders").update({ status: "paid", paid_at: paidAt, total_cents: totalCents, currency: order.currency || "CAD" }).eq("id", order.id).is("paid_at", null)
  if (updateError) return NextResponse.json({ message: "Could not mark this payment as confirmed." }, { status: 500 })
  const { error: invoiceError } = await admin.from("invoices").insert({ order_id: order.id, customer_id: order.customer_id, invoice_number: invoiceNumber, status: "paid", total_cents: totalCents, currency: order.currency || "CAD", issued_at: paidAt, paid_at: paidAt })
  if (invoiceError) return NextResponse.json({ message: "Payment was saved, but the invoice needs review." }, { status: 500 })
  const { error: pointsError } = await admin.from("loyalty_ledger").insert({ customer_id: order.customer_id, order_id: order.id, points, reason: "Paid AH Gifts purchase", created_by: access.account.user.id })
  if (pointsError) return NextResponse.json({ message: "Invoice saved, but loyalty points need review." }, { status: 500 })
  return NextResponse.json({ ok: true, invoiceNumber, points })
}