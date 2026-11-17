"use client"

import { useState } from "react"

type Item = {
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

const currency = (cents: number | null) => cents == null ? "—" : `$${(cents / 100).toFixed(2)}`

export function CatalogEditor({ items }: { items: Item[] }) {
  const [rows, setRows] = useState(items)
  const [message, setMessage] = useState("")
  const [busyKey, setBusyKey] = useState("")

  function patch(key: string, field: keyof Item, value: string) {
    setRows((current) => current.map((row) => row.item_key === key ? { ...row, [field]: value === "" ? null : field === "markup_percent" ? Number(value) : Math.round(Number(value) * 100) } : row))
  }

  async function save(row: Item) {
    setBusyKey(row.item_key)
    setMessage("")
    const response = await fetch("/api/master/catalog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemKey: row.item_key,
        basePriceCents: row.base_price_cents,
        markupPercent: row.markup_percent,
        priceCents: row.price_cents,
      }),
    })
    const result = await response.json().catch(() => ({}))
    setMessage(response.ok ? `${row.name} saved.` : result.message || "Could not save this price.")
    setBusyKey("")
  }

  function applyMarkup(row: Item) {
    const base = row.base_price_cents
    if (base == null) return
    const price = Math.round(base * (1 + (Number(row.markup_percent) || 0) / 100))
    setRows((current) => current.map((item) => item.item_key === row.item_key ? { ...item, price_cents: price } : item))
  }

  return <section className="master-section master-catalog-section">
    <div className="section-heading"><div><p className="eyebrow">Catalog controls</p><h2>Edit every item</h2></div><p>Set a base amount, markup, and final customer price for each card or 3D gift.</p></div>
    <div className="catalog-editor-table">
      {rows.map((row) => <article className="catalog-editor-row" key={row.item_key}>
        <div className="catalog-editor-name"><strong>{row.name}</strong><span>{row.item_key}</span></div>
        <label><span>Base</span><div className="money-input"><b>$</b><input inputMode="decimal" value={row.base_price_cents == null ? "" : (row.base_price_cents / 100).toFixed(2)} onChange={(event) => patch(row.item_key, "base_price_cents", event.target.value)} placeholder="—" /></div></label>
        <label><span>Markup %</span><input inputMode="decimal" value={row.markup_percent ?? 0} onChange={(event) => patch(row.item_key, "markup_percent", event.target.value)} placeholder="0" /></label>
        <label><span>Sell price</span><div className="money-input"><b>$</b><input inputMode="decimal" value={row.price_cents == null ? "" : (row.price_cents / 100).toFixed(2)} onChange={(event) => patch(row.item_key, "price_cents", event.target.value)} placeholder="Quote" /></div></label>
        <div className="catalog-editor-actions"><button className="button-primary" type="button" disabled={busyKey === row.item_key} onClick={() => applyMarkup(row)}>Apply markup</button><button className="button-secondary" type="button" disabled={busyKey === row.item_key} onClick={() => save(row)}>{busyKey === row.item_key ? "Saving…" : "Save item"}</button></div>
      </article>)}
    </div>
    {message && <p className="form-status" role="status">{message}</p>}
  </section>
}
