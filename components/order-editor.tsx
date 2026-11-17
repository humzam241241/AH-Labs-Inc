"use client"

import { useState } from "react"

type Line = Record<string, unknown> & {
  productName: string
  quantity: number
  unitPriceCents: number | null
  message: string
  details: string
}

type Props = {
  orderId: string
  orderNumber: string
  status: string | null
  items: unknown
  totalCents: number | null
  currency: string
  paid: boolean
}

function money(cents: number | null, currency: string) {
  return cents == null ? "Quote pending" : new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(cents / 100)
}

function normalizeLine(value: unknown): Line {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {}
  const price = raw.unitPriceCents === null || raw.unitPriceCents === undefined || raw.unitPriceCents === ""
    ? null
    : Math.max(0, Math.round(Number(raw.unitPriceCents) || 0))
  return {
    ...raw,
    productName: String(raw.productName || raw.name || "Custom item").slice(0, 180),
    quantity: Math.min(28, Math.max(1, Math.round(Number(raw.quantity) || 1))),
    unitPriceCents: price,
    message: String(raw.message || "").slice(0, 1200),
    details: String(raw.details || raw.specifications || "").slice(0, 1500),
  }
}

function initialLines(items: unknown) {
  const lines = Array.isArray(items) ? items.map(normalizeLine) : []
  return lines.length ? lines : [normalizeLine({ productName: "Custom item", quantity: 1, unitPriceCents: null })]
}

export function OrderEditor({ orderId, orderNumber, status, items, totalCents, currency, paid }: Props) {
  const [lines, setLines] = useState<Line[]>(() => initialLines(items))
  const [savedTotal, setSavedTotal] = useState<number | null>(totalCents)
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  function updateLine(index: number, field: "productName" | "quantity" | "unitPriceCents" | "message" | "details", value: string) {
    setLines((current) => current.map((line, lineIndex) => {
      if (lineIndex !== index) return line
      if (field === "quantity") return { ...line, quantity: Math.min(28, Math.max(1, Math.round(Number(value) || 1))) }
      if (field === "unitPriceCents") return { ...line, unitPriceCents: value.trim() === "" ? null : Math.max(0, Math.round(Number(value) * 100)) }
      return { ...line, [field]: value }
    }))
  }

  function lineTotal(line: Line) {
    return line.unitPriceCents === null ? null : line.unitPriceCents * line.quantity
  }

  async function save() {
    setBusy(true)
    setMessage("")
    const response = await fetch(`/api/master/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines, status }),
    })
    const result = await response.json().catch(() => ({}))
    if (response.ok) {
      setSavedTotal(result.order?.total_cents ?? null)
      setMessage(result.invoiceSynced ? "Order and any unpaid invoice updated." : "Order updated. Paid invoices stay unchanged.")
    } else {
      setMessage(result.message || "Could not save this order.")
    }
    setBusy(false)
  }

  return <div className="order-editor">
    <div className="order-editor-heading"><div><p className="eyebrow">Editable order</p><h3>{orderNumber}</h3></div><div className="order-editor-total"><span>Account total</span><strong>{money(savedTotal, currency)}</strong></div></div>
    {paid && <p className="order-editor-note">This order is marked paid. Its order history can be corrected, but paid invoices and loyalty entries are preserved.</p>}
    <div className="order-editor-lines">{lines.map((line, index) => <article className="order-editor-line" key={index}>
      <div className="order-editor-line-top"><strong>Item {index + 1}</strong><span>{money(lineTotal(line), currency)}</span></div>
      <div className="order-editor-fields">
        <label><span>Product / item</span><input value={line.productName} maxLength={180} onChange={(event) => updateLine(index, "productName", event.target.value)} /></label>
        <label><span>Quantity (1–28)</span><input type="number" min={1} max={28} value={line.quantity} onChange={(event) => updateLine(index, "quantity", event.target.value)} /></label>
        <label><span>Unit price (CAD)</span><input inputMode="decimal" value={line.unitPriceCents === null ? "" : (line.unitPriceCents / 100).toFixed(2)} placeholder="Quote" onChange={(event) => updateLine(index, "unitPriceCents", event.target.value)} /></label>
        <label className="order-editor-wide"><span>Customer message</span><textarea rows={2} value={line.message} maxLength={1200} onChange={(event) => updateLine(index, "message", event.target.value)} /></label>
        <label className="order-editor-wide"><span>Specifications / notes</span><textarea rows={2} value={line.details} maxLength={1500} onChange={(event) => updateLine(index, "details", event.target.value)} /></label>
      </div>
    </article>)}</div>
    <div className="order-editor-footer"><small>Changes appear in the customer account after saving. Quantity is capped at 28.</small><button type="button" className="button-primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save order changes"}</button></div>
    {message && <p className="form-status" role="status">{message}</p>}
  </div>
}
