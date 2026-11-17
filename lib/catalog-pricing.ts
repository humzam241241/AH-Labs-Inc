import { createSupabaseServerClient } from "@/lib/supabase/server"

export type CatalogItem = {
  id: string
  item_key: string
  item_type: "card" | "printed"
  category_slug: string | null
  product_slug: string
  design_number: number | null
  name: string
  base_price_cents: number | null
  markup_percent: number
  price_cents: number | null
  active: boolean
}

export function cardCatalogKey(reference: string) {
  return `card:${reference.trim().toLowerCase()}`
}

export function printedCatalogKey(slug: string) {
  return `printed:${slug.trim().toLowerCase()}`
}

export function catalogKeyForDraft(draft: { kind?: string; reference?: string }) {
  if (draft.kind === "card" && draft.reference) return cardCatalogKey(draft.reference)
  if (draft.kind === "3d" && draft.reference) return printedCatalogKey(draft.reference)
  return ""
}

export function defaultPriceCents(itemKey: string) {
  return itemKey.startsWith("card:") ? 299 : null
}

export function formatCatalogPrice(cents: number | null) {
  return cents == null ? "Price confirmed after review" : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100)
}

export async function getCatalogItem(itemKey: string) {
  if (!itemKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from("catalog_items")
    .select("id, item_key, item_type, category_slug, product_slug, design_number, name, base_price_cents, markup_percent, price_cents, active")
    .eq("item_key", itemKey)
    .eq("active", true)
    .maybeSingle()
  return (data as CatalogItem | null) ?? null
}

export async function getCatalogItems() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [] as CatalogItem[]
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from("catalog_items")
    .select("id, item_key, item_type, category_slug, product_slug, design_number, name, base_price_cents, markup_percent, price_cents, active")
    .order("item_type")
    .order("category_slug")
    .order("design_number")
    .order("name")
  return (data as CatalogItem[] | null) ?? []
}
