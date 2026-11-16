import { NextResponse } from "next/server"
import { callDeliveryCalendar, cleanText, validIsoDateTime } from "@/lib/delivery-booking"
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>
    if (cleanText(body.website, 200)) return NextResponse.json({ ok: true })

    const customerName = cleanText(body.customerName, 100)
    const phone = cleanText(body.phone, 40)
    const email = cleanText(body.email, 200)
    const address = cleanText(body.address, 240)
    const order = cleanText(body.order, 160)
    const notes = cleanText(body.notes, 800)
    const slotStart = cleanText(body.slotStart, 40)
    const requestId = cleanText(body.requestId, 80)

    if (customerName.length < 2) return NextResponse.json({ message: "Enter your name." }, { status: 400 })
    if (phone.length < 7 && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "Enter a phone number or email address." }, { status: 400 })
    if (address.length < 8) return NextResponse.json({ message: "Enter the complete delivery address." }, { status: 400 })
    if (!validIsoDateTime(slotStart)) return NextResponse.json({ message: "Choose an available delivery time." }, { status: 400 })
    if (!requestId) return NextResponse.json({ message: "Refresh the page and try again." }, { status: 400 })

    const result = await callDeliveryCalendar("book", { customerName, phone, email, address, order, notes, slotStart, requestId })
    await saveCustomerOrder({ customerName, phone, email, address, order, notes, slotStart, result })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "The delivery could not be booked."
    const conflict = /no longer available|already booked|conflict/i.test(message)
    return NextResponse.json({ message }, { status: conflict ? 409 : message.includes("not configured") ? 503 : 502 })
  }
}

async function saveCustomerOrder(input: { customerName: string; phone: string; email: string; address: string; order: string; notes: string; slotStart: string; result: Record<string, unknown> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) return
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return
  const admin = createSupabaseAdminClient()
  const orderNumber = `AH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const { error } = await admin.from("orders").insert({
    customer_id: user.id,
    order_number: orderNumber,
    status: "confirmed",
    items: input.order ? [{ name: input.order }] : [],
    delivery_address: input.address,
    delivery_window_start: input.slotStart,
    booking_reference: input.result.bookingId ?? null,
    notes: input.notes || null,
  })
  if (error) console.error("Could not save customer order", error.message)
}
