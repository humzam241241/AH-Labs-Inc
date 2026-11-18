import { NextResponse } from "next/server"
import { requireApprovedCustomer } from "@/lib/account-access"
import { callDeliveryCalendar, validIsoDateTime } from "@/lib/delivery-booking"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const editableStatuses = new Set(["pending", "awaiting_payment"])

type CustomerEditableItem = Record<string, unknown> & {
  quantity: number
  dimensions: string
  customDimensions: string
  quality: string
  message: string
  designOption: string
  sizeOption: string
  personalization: string
  colour: string
  details: string
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function finiteNumber(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function cleanShipping(input: unknown) {
  if (!input || typeof input !== "object") return null
  const value = input as Record<string, unknown>
  const shipping = {
    name: cleanText(value.name, 100),
    address: cleanText(value.address, 240),
    city: cleanText(value.city, 100),
    province: cleanText(value.province, 40),
    postalCode: cleanText(value.postalCode, 20),
    phone: cleanText(value.phone, 40),
  }
  return shipping.name && shipping.address.length >= 8 && shipping.city && shipping.province && shipping.postalCode ? shipping : null
}

function cleanDelivery(input: unknown) {
  if (!input || typeof input !== "object") return null
  const value = input as Record<string, unknown>
  const delivery = {
    name: cleanText(value.name, 100),
    address: cleanText(value.address, 240),
    phone: cleanText(value.phone, 40),
    email: cleanText(value.email, 200),
    date: cleanText(value.date, 10),
    notes: cleanText(value.notes, 800),
    slotStart: cleanText(value.slotStart, 40),
  }
  const validContact = delivery.phone.length >= 7 || /^\S+@\S+\.\S+$/.test(delivery.email)
  return delivery.name.length >= 2 && delivery.address.length >= 8 && validContact && validIsoDateTime(delivery.slotStart) ? delivery : null
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
    } as CustomerEditableItem
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
    .select("id, customer_id, order_number, status, items, total_cents, paid_at, booking_reference, delivery_address, delivery_window_start, notes")
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

  const body = await request.json().catch(() => null) as { items?: unknown; fulfillment?: unknown } | null
  const cleaned = cleanCustomerItems(body?.items, order.items)
  if (!cleaned) return NextResponse.json({ message: "The order specifications are incomplete." }, { status: 400 })

  const fulfillment = body?.fulfillment && typeof body.fulfillment === "object" ? body.fulfillment as Record<string, unknown> : null
  if (!fulfillment || (fulfillment.method !== "shipping" && fulfillment.method !== "delivery")) {
    return NextResponse.json({ message: "Choose shipping or local delivery." }, { status: 400 })
  }

  const oldBookingReference = cleanText(order.booking_reference, 200)
  const oldAddress = cleanText(order.delivery_address, 240)
  const oldSlotStart = cleanText(order.delivery_window_start, 40)
  let newBookingReference = ""
  let deliveryAddress: string | null = null
  let deliveryWindowStart: string | null = null
  let storedFulfillment: Record<string, unknown>

  if (fulfillment.method === "shipping") {
    const shipping = cleanShipping(fulfillment.shipping)
    if (!shipping) return NextResponse.json({ message: "Complete the shipping name, address, city, province, and postal code." }, { status: 400 })
    storedFulfillment = { method: "shipping", shipping }
  } else {
    const delivery = cleanDelivery(fulfillment.delivery)
    const requestId = cleanText(fulfillment.requestId, 80)
    if (!delivery || !requestId) return NextResponse.json({ message: "Complete the delivery address, contact information, and delivery window." }, { status: 400 })
    deliveryAddress = delivery.address
    deliveryWindowStart = delivery.slotStart
    const unchangedBooking = Boolean(oldBookingReference && oldAddress === delivery.address && oldSlotStart === delivery.slotStart)
    if (unchangedBooking) {
      newBookingReference = oldBookingReference
    } else {
      try {
        const firstItem = cleaned.items[0] as Record<string, unknown>
        const result = await callDeliveryCalendar("book", {
          customerName: delivery.name,
          phone: delivery.phone,
          email: delivery.email,
          address: delivery.address,
          order: cleanText(firstItem?.productName, 160) || order.order_number,
          notes: delivery.notes,
          slotStart: delivery.slotStart,
          requestId,
        })
        newBookingReference = cleanText(result.bookingId, 200)
        if (!newBookingReference) throw new Error("The calendar did not return a booking reference.")
      } catch (calendarError) {
        const message = calendarError instanceof Error ? calendarError.message : "The delivery window could not be reserved."
        const status = /no longer available|already booked|conflict/i.test(message) ? 409 : 502
        return NextResponse.json({ message }, { status })
      }
    }
    storedFulfillment = { method: "delivery", delivery }
  }

  cleaned.items[0] = { ...cleaned.items[0], fulfillment: storedFulfillment }

  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .update({
      items: cleaned.items,
      total_cents: cleaned.totalCents,
      delivery_address: deliveryAddress,
      delivery_window_start: deliveryWindowStart,
      booking_reference: newBookingReference || null,
    })
    .eq("id", order.id)
    .eq("customer_id", access.account.user.id)
    .is("paid_at", null)
    .in("status", ["pending", "awaiting_payment"])
    .select("id, order_number, status, items, total_cents, currency, delivery_address, delivery_window_start")
    .maybeSingle()
  if (error) {
    console.error("Could not update customer order", error.message)
    if (newBookingReference && newBookingReference !== oldBookingReference) {
      await callDeliveryCalendar("cancel", { bookingId: newBookingReference, orderNumber: order.order_number }).catch((calendarError) => {
        console.error("Could not release replacement delivery booking after order update failed", calendarError instanceof Error ? calendarError.message : calendarError)
      })
    }
    return NextResponse.json({ message: "The order could not be updated." }, { status: 500 })
  }
  if (!data) {
    if (newBookingReference && newBookingReference !== oldBookingReference) {
      await callDeliveryCalendar("cancel", { bookingId: newBookingReference, orderNumber: order.order_number }).catch((calendarError) => {
        console.error("Could not release replacement delivery booking after order changed", calendarError instanceof Error ? calendarError.message : calendarError)
      })
    }
    return NextResponse.json({ message: "This order can no longer be edited." }, { status: 409 })
  }

  let calendarReleased = true
  if (oldBookingReference && oldBookingReference !== newBookingReference) {
    try {
      await callDeliveryCalendar("cancel", { bookingId: oldBookingReference, orderNumber: order.order_number })
    } catch (calendarError) {
      calendarReleased = false
      console.error("Order updated but old delivery calendar release needs review", calendarError instanceof Error ? calendarError.message : calendarError)
    }
  }
  return NextResponse.json({ ok: true, calendarReleased, order: data })
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
