export const DELIVERY_ORIGIN = "Durham Regional Police West Division, 1710 Kingston Road East, Pickering, ON L1V 1C6"
export const DELIVERY_TIME_ZONE = "America/Toronto"

export type DeliverySlot = {
  start: string
  end: string
  label: string
}

export type AvailabilityResponse = {
  date: string
  address: string
  origin: string
  travelMinutes: number
  slots: DeliverySlot[]
}

export type BookingResponse = {
  bookingId: string
  customerWindow: string
  departureTime: string
  estimatedReturnTime: string
  travelMinutes: number
}

export async function callDeliveryCalendar(action: "availability" | "book", payload: Record<string, unknown>) {
  const url = process.env.DELIVERY_BOOKING_SCRIPT_URL
  const secret = process.env.DELIVERY_BOOKING_SECRET
  if (!url || !secret) throw new Error("Delivery calendar connection is not configured.")

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, secret, ...payload }),
    redirect: "follow",
    cache: "no-store",
  })
  const result = await response.json().catch(() => null) as ({ ok?: boolean; error?: string } & Record<string, unknown>) | null
  if (!response.ok || !result?.ok) throw new Error(result?.error || "The delivery calendar could not be reached.")
  return result
}

export function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, maxLength)
}

export function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function validIsoDateTime(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
}
