import { NextResponse } from "next/server"
import { requireApprovedCustomer } from "@/lib/account-access"
import { callDeliveryCalendar } from "@/lib/delivery-booking"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const editableStatuses = new Set(["pending", "awaiting_payment"])

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function finiteNumber(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function cleanCustomerItems(requested: unknown, existing: unknown) {
  if (!Array.isArray(requested) || !Array.isArray(existing) || requested.length !== existing.length || !existing.length) return null
  const items = existing.map((raw, index) => {
    const original = raw && typeof raw === "object" ? raw as Record<string, unknown> : {}
    const incoming = requested[index] && typeof requested[index] === "object" ? requested[index] as Record<string, unknown> : {}
    return {
      ...original,
      quantity: Math.min(28, Math.max(1, Math.round(Number(incoming.quantity) || 1))),
      dimensions: cleanText(incoming.dimensions, 120),
      customDimensions: cleanText(incoming.customDimensions, 120),
      quality: cleanText(incoming.quality, 80),
      message: cleanText(incoming.message, 1200),
      designOption: cleanText(incoming.designOption, 160),
      sizeOption: cleanText(incoming.sizeOption, 160),
      personalization: cleanText(incoming.personalization, 120),
      colour: cleanText(incoming.colour, 80),
      details: cleanText(incoming.details, 1500),
    }
  })

  const priced = items.every((item) => finiteNumber(item.unitPriceCents) !== null)
  if (!priced) return { items, totalCents: null as number | null }

  const subtotalCents = items.reduce((sum, item) => sum + Math.max(0, Math.round(finiteNumber(item.unitPriceCents) || 0)) * Number(item.quantity), 0)
  const originalPricing = items[0]?.pricing && typeof items[0].pricing === "object" ? items[0].pricing as Record<string, unknown> : {}
  const discountPercent = finiteNumber(originalPricing.discountPercent)
  const discountFixedCents = finiteNumber(originalPricing.discountFixedCents)
  const discountCents = discountPercent !== null
    ? Math.round(subtotalCents * Math.min(100, Math.max(0, discountPercent)) / 100)
    : discountFixedCents !== null
      ? Math.min(subtotalCents, Math.max(0, Math.round(discountFixedCents)))
      : 0
  const taxableCents = Math.max(0, subtotalCents - discountCents)
  const taxCents = Math.round(taxableCents * 0.13)
  const totalCents = taxableCents + taxCents

  const repriced = items.map((item, index) => {
    const unitPriceCents = Math.max(0, Math.round(finiteNumber(item.unitPriceCents) || 0))
    const lineSubtotalCents = unitPriceCents * Number(item.quantity)
    return {
      ...item,
      lineSubtotalCents,
      lineTotalCents: index === 0 ? totalCents : lineSubtotalCents,
      ...(index === 0 ? { pricing: { ...originalPricing, quantity: Number(item.quantity), subtotalCents, discountCents, taxableCents, taxRate: 0.13, taxCents, totalCents } } : {}),
    }
  })
  return { items: repriced, totalCents }
}

async function ownedEditableOrder(id: string, customerId: string) {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("orders")
    .select("id, customer_id, order_number, status, items, total_cents, paid_at, booking_reference, notes")
    .eq("id", id)
    .eq("customer_id", customerId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const access = await requireApprovedCustomer()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
  const order = await ownedEditableOrder(params.id, access.account.user.id).catch((error) => {
    console.error("Could not load customer order", error instanceof Error ? error.message : error)
    return null
  })
  if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 })
  if (order.paid_at || !editableStatuses.has(String(order.status || "pending").toLowerCase())) {
    return NextResponse.json({ message: "Only pending, unpaid orders can be edited." }, { status: 409 })
  }

  const body = await request.json().catch(() => null) as { items?: unknown } | null
  const cleaned = cleanCustomerItems(body?.items, order.items)
  if (!cleaned) return NextResponse.json({ message: "The order specifications are incomplete." }, { status: 400 })

  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .update({ items: cleaned.items, total_cents: cleaned.totalCents })
    .eq("id", order.id)
    .eq("customer_id", access.account.user.id)
    .is("paid_at", null)
    .in("status", ["pending", "awaiting_payment"])
    .select("id, order_number, status, items, total_cents, currency")
    .maybeSingle()
  if (error) {
    console.error("Could not update customer order", error.message)
    return NextResponse.json({ message: "The order could not be updated." }, { status: 500 })
  }
  if (!data) return NextResponse.json({ message: "This order can no longer be edited." }, { status: 409 })
  return NextResponse.json({ ok: true, order: data })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const access = await requireApprovedCustomer()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
  const order = await ownedEditableOrder(params.id, access.account.user.id).catch((error) => {
    console.error("Could not load customer order for cancellation", error instanceof Error ? error.message : error)
    return null
  })
  if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 })
  if (order.paid_at || !editableStatuses.has(String(order.status || "pending").toLowerCase())) {
    return NextResponse.json({ message: "Only pending, unpaid orders can be cancelled online." }, { status: 409 })
  }

  const cancelledAt = new Date().toISOString()
  const cancellationNote = `Cancelled by customer on ${cancelledAt}.`
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .update({ status: "cancelled", notes: [order.notes, cancellationNote].filter(Boolean).join(" ") })
    .eq("id", order.id)
    .eq("customer_id", access.account.user.id)
    .is("paid_at", null)
    .in("status", ["pending", "awaiting_payment"])
    .select("id, order_number, status")
    .maybeSingle()
  if (error) {
    console.error("Could not cancel customer order", error.message)
    return NextResponse.json({ message: "The order could not be cancelled." }, { status: 500 })
  }
  if (!data) return NextResponse.json({ message: "This order can no longer be cancelled." }, { status: 409 })

  let calendarReleased = !order.booking_reference
  if (order.booking_reference) {
    try {
      await callDeliveryCalendar("cancel", { bookingId: order.booking_reference, orderNumber: order.order_number })
      calendarReleased = true
    } catch (calendarError) {
      console.error("Order cancelled but delivery calendar release needs review", calendarError instanceof Error ? calendarError.message : calendarError)
    }
  }
  return NextResponse.json({ ok: true, calendarReleased, order: data })
}
