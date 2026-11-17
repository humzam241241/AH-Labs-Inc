"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Line = Record<string, unknown> & {
  productName: string
  quantity: number
  dimensions: string
  customDimensions: string
  quality: string
  message: string
  designOption: string
  sizeOption: string
  personalization: string
  colour: string
  details: string
}

function normalizeLine(value: unknown): Line {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {}
  return {
    ...raw,
    productName: String(raw.productName || raw.name || "Custom item").slice(0, 180),
    quantity: Math.min(28, Math.max(1, Math.round(Number(raw.quantity) || 1))),
    dimensions: String(raw.dimensions || "").slice(0, 120),
    customDimensions: String(raw.customDimensions || "").slice(0, 120),
    quality: String(raw.quality || "").slice(0, 80),
    message: String(raw.message || "").slice(0, 1200),
    designOption: String(raw.designOption || "").slice(0, 160),
    sizeOption: String(raw.sizeOption || "").slice(0, 160),
    personalization: String(raw.personalization || "").slice(0, 120),
    colour: String(raw.colour || "").slice(0, 80),
    details: String(raw.details || "").slice(0, 1500),
  }
}

export function CustomerOrderActions({ orderId, orderNumber, items }: { orderId: string; orderNumber: string; items: unknown }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(() => Array.isArray(items) ? items.map(normalizeLine) : [])
  const [busy, setBusy] = useState<"save" | "cancel" | "">("")
  const [message, setMessage] = useState("")

  function updateLine(index: number, field: keyof Line, value: string) {
    setLines((current) => current.map((line, lineIndex) => lineIndex !== index ? line : {
      ...line,
      [field]: field === "quantity" ? Math.min(28, Math.max(1, Math.round(Number(value) || 1))) : value,
    }))
  }

  async function save() {
    setBusy("save")
    setMessage("")
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        setMessage("Order updated. Your total and HST were recalculated.")
        router.refresh()
      } else setMessage(result.message || "The order could not be updated.")
    } catch {
      setMessage("The order could not be updated. Check your connection and try again.")
    } finally {
      setBusy("")
    }
  }

  async function cancel() {
    if (!window.confirm(`Cancel order ${orderNumber}? This keeps it in your order history but stops it from being processed.`)) return
    setBusy("cancel")
    setMessage("")
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        setMessage(result.calendarReleased === false ? "Order cancelled. AH Gifts will release the delivery calendar manually." : "Order cancelled.")
        router.refresh()
      } else setMessage(result.message || "The order could not be cancelled.")
    } catch {
      setMessage("The order could not be cancelled. Check your connection and try again.")
    } finally {
      setBusy("")
    }
  }

  return <div className="customer-order-manager">
    <div className="customer-order-buttons">
      <button type="button" className="choice-link customer-edit-toggle" aria-expanded={open} onClick={() => { setOpen((current) => !current); setMessage("") }}>{open ? "Close editor" : "Edit order"} <i className="css-arrow" aria-hidden="true" /></button>
      <button type="button" className="customer-cancel-button" disabled={Boolean(busy)} onClick={cancel}>{busy === "cancel" ? "Cancelling…" : "Cancel order"}</button>
    </div>
    {open && <div className="customer-order-editor">
      <div><p className="eyebrow">Editable while pending</p><h4>{orderNumber}</h4><p>Change quantities and personalization below. To choose a different product or design, cancel this order and create a new one.</p></div>
      {lines.map((line, index) => <fieldset key={index} disabled={Boolean(busy)}><legend>{line.productName}</legend>
        <div className="customer-order-fields">
          <label><span>Quantity (1–28)</span><input type="number" min={1} max={28} value={line.quantity} onChange={(event) => updateLine(index, "quantity", event.target.value)} /></label>
          {line.sizeOption && <label><span>Size</span><input value={line.sizeOption} maxLength={160} onChange={(event) => updateLine(index, "sizeOption", event.target.value)} /></label>}
          {line.dimensions && <label><span>Dimensions</span><input value={line.dimensions} maxLength={120} onChange={(event) => updateLine(index, "dimensions", event.target.value)} /></label>}
          <label><span>Custom dimensions</span><input value={line.customDimensions} maxLength={120} placeholder="Optional" onChange={(event) => updateLine(index, "customDimensions", event.target.value)} /></label>
          {line.quality && <label><span>Quality</span><input value={line.quality} maxLength={80} onChange={(event) => updateLine(index, "quality", event.target.value)} /></label>}
          {line.colour && <label><span>Colour</span><input value={line.colour} maxLength={80} onChange={(event) => updateLine(index, "colour", event.target.value)} /></label>}
          <label className="customer-order-wide"><span>Name or personalization</span><input value={line.personalization} maxLength={120} placeholder="Optional" onChange={(event) => updateLine(index, "personalization", event.target.value)} /></label>
          <label className="customer-order-wide"><span>Message</span><textarea rows={3} value={line.message} maxLength={1200} placeholder="Optional" onChange={(event) => updateLine(index, "message", event.target.value)} /></label>
          <label className="customer-order-wide"><span>Additional details</span><textarea rows={3} value={line.details} maxLength={1500} placeholder="Optional" onChange={(event) => updateLine(index, "details", event.target.value)} /></label>
        </div>
      </fieldset>)}
      <div className="customer-order-editor-footer"><small>Saving recalculates any quantity-based subtotal, promo discount, and 13% HST.</small><button type="button" className="button-primary" disabled={Boolean(busy)} onClick={save}>{busy === "save" ? "Saving…" : "Save changes"}</button></div>
    </div>}
    {message && <p className="form-status" role="status">{message}</p>}
  </div>
}
