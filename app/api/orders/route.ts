import { NextResponse } from "next/server"
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_TEXT = 500

function text(value: unknown, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

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
    quantity: Math.min(50, Math.max(1, Number(draft.quantity) || 1)),
  }
}

export async function POST(request: Request) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ message: "Sign in before placing an order." }, { status: 401 })

    const body = await request.json() as { draft?: unknown }
    const items = cleanDraft(body.draft)
    if (!items) return NextResponse.json({ message: "Your order details are incomplete. Please return to the product page." }, { status: 400 })

    const orderNumber = `AH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
    const admin = createSupabaseAdminClient()
    const { error } = await admin.from("orders").insert({
      customer_id: user.id,
      order_number: orderNumber,
      status: "pending",
      items: [items],
      notes: "Awaiting Interac e-Transfer confirmation.",
    })

    if (error) {
      console.error("Could not save customer order", error.message)
      return NextResponse.json({ message: "We could not save this order yet. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ ok: true, orderNumber })
  } catch (error) {
    console.error("Order creation failed", error)
    return NextResponse.json({ message: "We could not save this order yet. Please try again." }, { status: 500 })
  }
}
