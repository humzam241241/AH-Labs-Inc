import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { calculateCheckoutPricing, CheckoutPricingError } from "@/lib/checkout-pricing"
import { requireApprovedCustomer } from "@/lib/account-access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const text = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : ""

function cleanDraft(input: unknown) {
  if (!input || typeof input !== "object") return null
  const draft = input as Record<string, unknown>
  const kind = draft.kind === "card" || draft.kind === "3d" ? draft.kind : null
  const productName = text(draft.productName, 160)
  if (!kind || !productName) return null
  return {
    version: 1,
    kind,
    productName,
    reference: text(draft.reference, 120),
    categoryName: text(draft.categoryName, 120),
    dimensions: text(draft.dimensions, 120),
    customDimensions: text(draft.customDimensions, 120),
    quality: text(draft.quality, 80),
    message: text(draft.message, 1200),
    designOption: text(draft.designOption, 160),
    sizeOption: text(draft.sizeOption, 160),
    personalization: text(draft.personalization, 120),
    colour: text(draft.colour, 80),
    details: text(draft.details, 1500),
    referenceFileName: text(draft.referenceFileName, 160),
    quantity: Math.min(28, Math.max(1, Math.round(Number(draft.quantity) || 1))),
  }
}

function cleanShipping(input: unknown) {
  if (!input || typeof input !== "object") return null
  const shipping = input as Record<string, unknown>
  const result = {
    name: text(shipping.name, 100),
    address: text(shipping.address, 240),
    city: text(shipping.city, 100),
    province: text(shipping.province, 40),
    postalCode: text(shipping.postalCode, 20),
    phone: text(shipping.phone, 40),
  }
  return result.name && result.address && result.city && result.province && result.postalCode ? result : null
}

export async function POST(request: Request) {
  try {
    const access = await requireApprovedCustomer()
    if ("error" in access) return NextResponse.json({ message: access.error }, { status: access.status })
    const body = await request.json() as { draft?: unknown; fulfillmentMethod?: unknown; shipping?: unknown; promoCode?: unknown }
    const item = cleanDraft(body.draft)
    if (!item) return NextResponse.json({ message: "Your order details are incomplete. Please return to the product page." }, { status: 400 })
    const shipping = cleanShipping(body.shipping)
    if (body.fulfillmentMethod !== "shipping" || !shipping) return NextResponse.json({ message: "Complete the shipping details before placing this order." }, { status: 400 })

    const pricing = await calculateCheckoutPricing(access.account.user.id, item, body.promoCode)
    const orderNumber = `AH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
    const pricedItem = {
      ...item,
      catalogItemKey: pricing.catalogItemKey,
      unitPriceCents: pricing.unitPriceCents,
      lineSubtotalCents: pricing.subtotalCents,
      lineTotalCents: pricing.totalCents,
      pricing,
    }
    const notes = [
      "Awaiting Interac e-Transfer confirmation.",
      "Fulfillment: shipping.",
      pricing.promoCode ? `Promo: ${pricing.promoCode} (${pricing.promoLabel}).` : "",
      pricing.taxCents == null ? "HST will be calculated after the custom quote." : `HST (13%): $${(pricing.taxCents / 100).toFixed(2)}.`,
      `Ship to: ${shipping.name}, ${shipping.address}, ${shipping.city}, ${shipping.province}, ${shipping.postalCode}.`,
      shipping.phone ? `Phone: ${shipping.phone}.` : "",
    ].filter(Boolean).join(" ")

    const { error } = await createSupabaseAdminClient().from("orders").insert({
      customer_id: access.account.user.id,
      order_number: orderNumber,
      status: "pending",
      items: [pricedItem],
      total_cents: pricing.totalCents,
      currency: "CAD",
      notes,
    })
    if (error) {
      console.error("Could not save shipping order", error.message)
      return NextResponse.json({ message: "The order number could not be created. Please try again." }, { status: 500 })
    }
    return NextResponse.json({ ok: true, orderNumber, pricing })
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not save this order yet."
    return NextResponse.json({ message }, { status: error instanceof CheckoutPricingError ? 400 : 500 })
  }
}
