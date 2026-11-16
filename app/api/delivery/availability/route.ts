import { NextResponse } from "next/server"
import { callDeliveryCalendar, cleanText, validDate } from "@/lib/delivery-booking"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>
    const date = cleanText(body.date, 10)
    const address = cleanText(body.address, 240)
    if (!validDate(date)) return NextResponse.json({ message: "Choose a valid delivery date." }, { status: 400 })
    if (address.length < 8) return NextResponse.json({ message: "Enter the complete delivery address, including city and postal code." }, { status: 400 })
    const result = await callDeliveryCalendar("availability", { date, address })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Availability could not be checked."
    return NextResponse.json({ message }, { status: message.includes("not configured") ? 503 : 502 })
  }
}
