import { catalogKeyForDraft, defaultPriceCents, getCatalogItem } from "@/lib/catalog-pricing"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type CheckoutPricing = {
  catalogItemKey: string | null
  unitPriceCents: number | null
  quantity: number
  subtotalCents: number | null
  discountCents: number | null
  taxableCents: number | null
  taxRate: number
  taxCents: number | null
  totalCents: number | null
  promoCode: string | null
  promoLabel: string | null
  discountPercent: number | null
  discountFixedCents: number | null
}

export class CheckoutPricingError extends Error {}

type Draft = { kind?: unknown; reference?: unknown; quantity?: unknown }

function promoDiscount(label: string, subtotalCents: number) {
  const percentMatch = label.match(/(\d+(?:\.\d+)?)\s*%/)
  if (percentMatch) {
    const percent = Math.min(100, Math.max(0, Number(percentMatch[1])))
    return { cents: Math.round(subtotalCents * percent / 100), percent, fixedCents: null as number | null }
  }
  const fixedMatch = label.match(/\$\s*(\d+(?:\.\d+)?)/)
  if (fixedMatch) {
    const fixedCents = Math.max(0, Math.round(Number(fixedMatch[1]) * 100))
    return { cents: Math.min(subtotalCents, fixedCents), percent: null as number | null, fixedCents }
  }
  throw new CheckoutPricingError("This promo code needs a percentage or dollar discount configured before it can be used.")
}

export async function calculateCheckoutPricing(userId: string, draft: Draft, rawPromoCode: unknown): Promise<CheckoutPricing> {
  const quantity = Math.min(28, Math.max(1, Math.round(Number(draft.quantity) || 1)))
  const catalogItemKey = catalogKeyForDraft({
    kind: draft.kind === "card" || draft.kind === "3d" ? draft.kind : undefined,
    reference: typeof draft.reference === "string" ? draft.reference : undefined,
  })
  const catalogItem = catalogItemKey ? await getCatalogItem(catalogItemKey) : null
  const unitPriceCents = catalogItem?.price_cents ?? defaultPriceCents(catalogItemKey)
  const promoCode = typeof rawPromoCode === "string" ? rawPromoCode.trim().toUpperCase().slice(0, 40) : ""

  if (unitPriceCents == null) {
    if (promoCode) throw new CheckoutPricingError("Promo codes can be applied after the custom item receives a price.")
    return {
      catalogItemKey: catalogItemKey || null,
      unitPriceCents: null,
      quantity,
      subtotalCents: null,
      discountCents: null,
      taxableCents: null,
      taxRate: 0.13,
      taxCents: null,
      totalCents: null,
      promoCode: null,
      promoLabel: null,
      discountPercent: null,
      discountFixedCents: null,
    }
  }

  const subtotalCents = unitPriceCents * quantity
  let discountCents = 0
  let promoLabel: string | null = null
  let discountPercent: number | null = null
  let discountFixedCents: number | null = null

  if (promoCode) {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase
      .from("customer_promos")
      .select("code, discount_label, active, expires_at, redeemed_at")
      .eq("customer_id", userId)
      .eq("active", true)
    if (error) throw new CheckoutPricingError("Promo codes are temporarily unavailable.")
    const promo = (data ?? []).find((row) => String(row.code).toUpperCase() === promoCode)
    if (!promo || promo.redeemed_at || (promo.expires_at && new Date(promo.expires_at).getTime() <= Date.now())) {
      throw new CheckoutPricingError("That promo code is invalid or no longer available.")
    }
    promoLabel = promo.discount_label
    const discount = promoDiscount(promo.discount_label, subtotalCents)
    discountCents = discount.cents
    discountPercent = discount.percent
    discountFixedCents = discount.fixedCents
  }

  const taxableCents = Math.max(0, subtotalCents - discountCents)
  const taxCents = Math.round(taxableCents * 0.13)
  const totalCents = taxableCents + taxCents

  return {
    catalogItemKey: catalogItemKey || null,
    unitPriceCents,
    quantity,
    subtotalCents,
    discountCents,
    taxableCents,
    taxRate: 0.13,
    taxCents,
    totalCents,
    promoCode: promoCode || null,
    promoLabel,
    discountPercent,
    discountFixedCents,
  }
}
