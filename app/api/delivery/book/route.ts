import { NextResponse } from "next/server"
import { callDeliveryCalendar, cleanText, validIsoDateTime } from "@/lib/delivery-booking"
import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { calculateCheckoutPricing, CheckoutPricing, CheckoutPricingError } from "@/lib/checkout-pricing"
import { requireApprovedCustomer } from "@/lib/account-access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function cleanOrderDraft(input: unknown) {
  if (!input || typeof input !== "object") return null
  const draft = input as Record<string, unknown>
  const kind = draft.kind === "card" || draft.kind === "3d" ? draft.kind : null
  const productName = cleanText(draft.productName, 160)
  if (!kind || !productName) return null
  return {
    version: 1,
    kind,
    productName,
    reference: cleanText(draft.reference, 120),
    categoryName: cleanText(draft.categoryName, 120),
    dimensions: cleanText(draft.dimensions, 120),
    customDimensions: cleanText(draft.customDimensions, 120),
    quality: cleanText(draft.quality, 80),
    message: cleanText(draft.message, 1200),
    designOption: cleanText(draft.designOption, 160),
    sizeOption: cleanText(draft.sizeOption, 160),
    personalization: cleanText(draft.personalization, 120),
    colour: cleanText(draft.colour, 80),
    details: cleanText(draft.details, 1500),
    referenceFileName: cleanText(draft.referenceFileName, 160),
    quantity: Math.min(28, Math.max(1, Math.round(Number(draft.quantity) || 1))),
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireApprovedCustomer()
    if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
    const body = await request.json() as Record<string, unknown>
    if (cleanText(body.website, 200)) return NextResponse.json({ ok: true })

    const customerName = cleanText(body.customerName, 100)
    const phone = cleanText(body.phone, 40)
    const email = cleanText(body.email, 200)
    const address = cleanText(body.address, 240)
    const order = cleanText(body.order, 160)
    const orderDraft = cleanOrderDraft(body.orderDraft)
    const notes = cleanText(body.notes, 800)
    const slotStart = cleanText(body.slotStart, 40)
    const requestId = cleanText(body.requestId, 80)

    if (customerName.length < 2) return NextResponse.json({ message: "Enter your name." }, { status: 400 })
    if (phone.length < 7 && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "Enter a phone number or email address." }, { status: 400 })
    if (address.length < 8) return NextResponse.json({ message: "Enter the complete delivery address." }, { status: 400 })
    if (!validIsoDateTime(slotStart)) return NextResponse.json({ message: "Choose an available delivery time." }, { status: 400 })
    if (!requestId) return NextResponse.json({ message: "Refresh the page and try again." }, { status: 400 })
    if (!orderDraft) return NextResponse.json({ message: "Your order details are incomplete." }, { status: 400 })

    const pricing = await calculateCheckoutPricing(access.account.user.id, orderDraft, body.promoCode)
    const result = await callDeliveryCalendar("book", { customerName, phone, email, address, order, notes, slotStart, requestId })
    const orderNumber = await saveCustomerOrder({ customerId: access.account.user.id, customerName, phone, email, address, orderDraft, notes, slotStart, result, pricing })
    return NextResponse.json({ ...result, orderNumber, pricing })
  } catch (error) {
    const message = error instanceof Error ? error.message : "The delivery could not be booked."
    const conflict = /no longer available|already booked|conflict/i.test(message)
    const status = error instanceof CheckoutPricingError ? 400 : conflict ? 409 : message.includes("not configured") ? 503 : 502
    return NextResponse.json({ message }, { status })
  }
}

async function saveCustomerOrder(input: { customerId: string; customerName: string; phone: string; email: string; address: string; orderDraft: Record<string, unknown>; notes: string; slotStart: string; result: Record<string, unknown>; pricing: CheckoutPricing }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error("Order storage is not configured.")
  const admin = createSupabaseAdminClient()
  const orderNumber = `AH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  const pricedItem = {
    ...input.orderDraft,
    catalogItemKey: input.pricing.catalogItemKey,
    quantity: input.pricing.quantity,
    unitPriceCents: input.pricing.unitPriceCents,
    lineSubtotalCents: input.pricing.subtotalCents,
    lineTotalCents: input.pricing.totalCents,
    pricing: input.pricing,
    fulfillment: {
      method: "delivery",
      delivery: {
        name: input.customerName,
        phone: input.phone,
        email: input.email,
        address: input.address,
        notes: input.notes,
        slotStart: input.slotStart,
      },
    },
  }
  const { error } = await admin.from("orders").insert({
    customer_id: input.customerId,
    order_number: orderNumber,
    status: "pending",
    items: [pricedItem],
    total_cents: input.pricing.totalCents,
    currency: "CAD",
    delivery_address: input.address,
    delivery_window_start: input.slotStart,
    booking_reference: input.result.bookingId ?? null,
    notes: [
      "Awaiting Interac e-Transfer confirmation.",
      input.pricing.promoCode ? `Promo: ${input.pricing.promoCode} (${input.pricing.promoLabel}).` : "",
      input.pricing.taxCents == null ? "HST will be calculated after the custom quote." : `HST (13%): $${(input.pricing.taxCents / 100).toFixed(2)}.`,
      input.notes,
    ].filter(Boolean).join(" "),
  })
  if (error) {
    console.error("Could not save customer order", error.message)
    throw new Error("The delivery was reserved, but the order number could not be saved. Contact AH Gifts before trying again.")
  }
  return orderNumber
}
