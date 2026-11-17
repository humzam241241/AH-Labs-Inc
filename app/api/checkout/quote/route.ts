import { NextResponse } from "next/server"
import { requireApprovedCustomer } from "@/lib/account-access"
import { calculateCheckoutPricing, CheckoutPricingError } from "@/lib/checkout-pricing"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const access = await requireApprovedCustomer()
  if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
  const body = await request.json().catch(() => null) as { draft?: unknown; promoCode?: unknown } | null
  if (!body?.draft || typeof body.draft !== "object") return NextResponse.json({ message: "Your order details are incomplete." }, { status: 400 })
  try {
    const pricing = await calculateCheckoutPricing(access.account.user.id, body.draft as Record<string, unknown>, body.promoCode)
    return NextResponse.json({ ok: true, pricing })
  } catch (error) {
    const message = error instanceof Error ? error.message : "The order total could not be calculated."
    return NextResponse.json({ message }, { status: error instanceof CheckoutPricingError ? 400 : 500 })
  }
}
