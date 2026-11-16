import { NextResponse } from "next/server"
import { callDeliveryCalendar, cleanText, validIsoDateTime } from "@/lib/delivery-booking"
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server"

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
    quantity: Math.min(50, Math.max(1, Number(draft.quantity) || 1)),
  }
}

export async function POST(request: Request) {
  try {
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

    const result = await callDeliveryCalendar("book", { customerName, phone, email, address, order, notes, slotStart, requestId })
    const orderNumber = await saveCustomerOrder({ address, order, orderDraft, notes, slotStart, result })
    return NextResponse.json({ ...result, orderNumber })
  } catch (error) {
    const message = error instanceof Error ? error.message : "The delivery could not be booked."
    const conflict = /no longer available|already booked|conflict/i.test(message)
    return NextResponse.json({ message }, { status: conflict ? 409 : message.includes("not configured") ? 503 : 502 })
  }
}

async function saveCustomerOrder(input: { address: string; order: string; orderDraft: Record<string, unknown> | null; notes: string; slotStart: string; result: Record<string, unknown> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) return ""
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return ""

  const admin = createSupabaseAdminClient()
  const orderNumber = `AH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const { error } = await admin.from("orders").insert({
    customer_id: user.id,
    order_number: orderNumber,
    status: "pending",
    items: input.orderDraft ? [input.orderDraft] : input.order ? [{ name: input.order }] : [],
    delivery_address: input.address,
    delivery_window_start: input.slotStart,
    booking_reference: input.result.bookingId ?? null,
    notes: ["Awaiting Interac e-Transfer confirmation.", input.notes].filter(Boolean).join(" "),
  })
  if (error) {
    console.error("Could not save customer order", error.message)
    return ""
  }
  return orderNumber
}
