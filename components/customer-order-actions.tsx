"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

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

type FulfillmentMethod = "shipping" | "delivery"
type ShippingDetails = { name: string; address: string; city: string; province: string; postalCode: string; phone: string }
type DeliveryDetails = { name: string; address: string; phone: string; email: string; date: string; notes: string }
type Availability = { slots: { start: string; end: string; label: string }[]; travelMinutes: number; origin: string }

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

function torontoDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000)
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function dateFromSlot(value: string | null) {
  if (!value) return torontoDate(1)
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value))
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function savedFulfillment(items: unknown) {
  if (!Array.isArray(items) || !items[0] || typeof items[0] !== "object") return null
  const value = (items[0] as Record<string, unknown>).fulfillment
  return value && typeof value === "object" ? value as Record<string, unknown> : null
}

function savedSection(value: unknown) {
  return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function shippingFromLegacyNotes(notes: string) {
  const addressMatch = notes.match(/Ship to:\s*(.+?)(?:\.\s*Phone:|\.$|$)/i)
  const phoneMatch = notes.match(/Phone:\s*(.+?)(?:\.|$)/i)
  const parts = addressMatch?.[1]?.split(",").map((part) => part.trim()).filter(Boolean) || []
  if (parts.length < 5) return { name: "", address: "", city: "", province: "", postalCode: "", phone: phoneMatch?.[1] || "" }
  const name = parts.shift() || ""
  const postalCode = parts.pop() || ""
  const province = parts.pop() || ""
  const city = parts.pop() || ""
  return { name, address: parts.join(", "), city, province, postalCode, phone: phoneMatch?.[1] || "" }
}

type Props = {
  orderId: string
  orderNumber: string
  items: unknown
  deliveryAddress: string | null
  deliveryWindowStart: string | null
  orderNotes: string
  customerName: string
  customerEmail: string
}

export function CustomerOrderActions({ orderId, orderNumber, items, deliveryAddress, deliveryWindowStart, orderNotes, customerName, customerEmail }: Props) {
  const router = useRouter()
  const stored = savedFulfillment(items)
  const storedMethod = stored?.method === "delivery" || stored?.method === "shipping" ? stored.method : null
  const storedShipping = savedSection(stored?.shipping)
  const storedDelivery = savedSection(stored?.delivery)
  const legacyShipping = shippingFromLegacyNotes(orderNotes)
  const initialMethod: FulfillmentMethod = storedMethod || (deliveryAddress ? "delivery" : "shipping")
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(() => Array.isArray(items) ? items.map(normalizeLine) : [])
  const [method, setMethod] = useState<FulfillmentMethod>(initialMethod)
  const [shipping, setShipping] = useState<ShippingDetails>({
    name: String(storedShipping.name || legacyShipping.name || customerName || ""),
    address: String(storedShipping.address || legacyShipping.address || ""),
    city: String(storedShipping.city || legacyShipping.city || ""),
    province: String(storedShipping.province || legacyShipping.province || "ON"),
    postalCode: String(storedShipping.postalCode || legacyShipping.postalCode || ""),
    phone: String(storedShipping.phone || legacyShipping.phone || ""),
  })
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    name: String(storedDelivery.name || customerName || ""),
    address: String(storedDelivery.address || deliveryAddress || ""),
    phone: String(storedDelivery.phone || ""),
    email: String(storedDelivery.email || customerEmail || ""),
    date: dateFromSlot(deliveryWindowStart),
    notes: String(storedDelivery.notes || ""),
  })
  const [selectedStart, setSelectedStart] = useState(deliveryWindowStart || "")
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState("")
  const [checking, setChecking] = useState(false)
  const [busy, setBusy] = useState<"save" | "cancel" | "">("")
  const [message, setMessage] = useState("")
  const today = useMemo(() => torontoDate(), [])
  const maxDate = useMemo(() => torontoDate(60), [])

  function updateLine(index: number, field: keyof Line, value: string) {
    setLines((current) => current.map((line, lineIndex) => lineIndex !== index ? line : {
      ...line,
      [field]: field === "quantity" ? Math.min(28, Math.max(1, Math.round(Number(value) || 1))) : value,
    }))
  }

  function updateDelivery(field: keyof DeliveryDetails, value: string) {
    setDelivery((current) => ({ ...current, [field]: value }))
    if (field === "address" || field === "date") {
      setAvailability(null)
      setAvailabilityStatus("")
      setSelectedStart("")
    }
  }

  async function checkAvailability() {
    if (delivery.address.trim().length < 8 || !delivery.date) {
      setAvailabilityStatus("Enter the complete delivery address and choose a date.")
      return
    }
    setChecking(true)
    setAvailabilityStatus("Checking travel time and the shared calendar…")
    try {
      const response = await fetch("/api/delivery/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: delivery.address, date: delivery.date }),
      })
      const result = await response.json() as Availability & { message?: string }
      if (!response.ok) throw new Error(result.message || "Availability could not be checked.")
      setAvailability(result)
      setSelectedStart("")
      setAvailabilityStatus(result.slots.length ? "Choose a new 30-minute delivery window." : "No windows are open on this date.")
    } catch (error) {
      setAvailability(null)
      setAvailabilityStatus(error instanceof Error ? error.message : "Availability could not be checked.")
    } finally {
      setChecking(false)
    }
  }

  async function save() {
    if (method === "shipping" && (!shipping.name.trim() || shipping.address.trim().length < 8 || !shipping.city.trim() || !shipping.province.trim() || !shipping.postalCode.trim())) {
      setMessage("Complete the recipient name, shipping address, city, province, and postal code.")
      return
    }
    if (method === "delivery" && (!delivery.name.trim() || delivery.address.trim().length < 8 || (!delivery.phone.trim() && !delivery.email.trim()) || !selectedStart)) {
      setMessage("Complete the delivery name, address, contact information, and delivery window.")
      return
    }

    setBusy("save")
    setMessage("")
    try {
      const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `edit-${Date.now()}`
      const fulfillment = method === "shipping"
        ? { method, shipping }
        : { method, delivery: { ...delivery, slotStart: selectedStart }, requestId }
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, fulfillment }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        setMessage(result.calendarReleased === false
          ? "Order updated. AH Gifts will manually clear the old delivery calendar entry."
          : "Order, fulfillment details, total, and HST were updated.")
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
      <div><p className="eyebrow">Editable while pending</p><h4>{orderNumber}</h4><p>Change your order, shipping address, or fulfillment method before payment is confirmed.</p></div>
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

      <fieldset className="customer-fulfillment-editor" disabled={Boolean(busy)}><legend>Shipping or delivery</legend>
        <div className="fulfillment-choice" role="radiogroup" aria-label="Fulfillment method">
          <label className={method === "shipping" ? "fulfillment-option selected" : "fulfillment-option"}><input type="radio" name={`fulfillment-${orderId}`} checked={method === "shipping"} onChange={() => setMethod("shipping")} /><span><strong>Shipping</strong><small>Edit the complete mailing address.</small></span></label>
          <label className={method === "delivery" ? "fulfillment-option selected" : "fulfillment-option"}><input type="radio" name={`fulfillment-${orderId}`} checked={method === "delivery"} onChange={() => setMethod("delivery")} /><span><strong>Local delivery</strong><small>Choose a live 30-minute window.</small></span></label>
        </div>
        {method === "shipping" ? <div className="customer-order-fields">
          <label><span>Recipient name</span><input value={shipping.name} maxLength={100} autoComplete="name" onChange={(event) => setShipping({ ...shipping, name: event.target.value })} /></label>
          <label><span>Phone (optional)</span><input value={shipping.phone} maxLength={40} autoComplete="tel" onChange={(event) => setShipping({ ...shipping, phone: event.target.value })} /></label>
          <label className="customer-order-wide"><span>Street address</span><input value={shipping.address} maxLength={240} autoComplete="street-address" onChange={(event) => setShipping({ ...shipping, address: event.target.value })} /></label>
          <label><span>City</span><input value={shipping.city} maxLength={100} autoComplete="address-level2" onChange={(event) => setShipping({ ...shipping, city: event.target.value })} /></label>
          <label><span>Province</span><input value={shipping.province} maxLength={40} autoComplete="address-level1" onChange={(event) => setShipping({ ...shipping, province: event.target.value })} /></label>
          <label><span>Postal code</span><input value={shipping.postalCode} maxLength={20} autoComplete="postal-code" onChange={(event) => setShipping({ ...shipping, postalCode: event.target.value })} /></label>
        </div> : <div className="customer-order-fields">
          <label><span>Your name</span><input value={delivery.name} maxLength={100} autoComplete="name" onChange={(event) => updateDelivery("name", event.target.value)} /></label>
          <label><span>Phone</span><input value={delivery.phone} maxLength={40} autoComplete="tel" onChange={(event) => updateDelivery("phone", event.target.value)} /></label>
          <label className="customer-order-wide"><span>Email</span><input type="email" value={delivery.email} maxLength={200} autoComplete="email" onChange={(event) => updateDelivery("email", event.target.value)} /></label>
          <label className="customer-order-wide"><span>Complete delivery address</span><input value={delivery.address} maxLength={240} autoComplete="street-address" onChange={(event) => updateDelivery("address", event.target.value)} /></label>
          <label><span>Preferred date</span><input type="date" min={today} max={maxDate} value={delivery.date} onChange={(event) => updateDelivery("date", event.target.value)} /></label>
          <label><span>Availability</span><button type="button" className="button-secondary availability-button" disabled={checking || delivery.address.trim().length < 8 || !delivery.date} onClick={checkAvailability}>{checking ? "Checking…" : "Show new times"}</button></label>
          {selectedStart && !availability && <p className="customer-order-wide availability-status">Current window: {new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" }).format(new Date(selectedStart))}</p>}
          {availability && <div className="customer-order-wide checkout-availability">{availability.slots.length ? <div className="slot-grid" role="radiogroup" aria-label="Available delivery times">{availability.slots.map((slot) => <label className={selectedStart === slot.start ? "slot-option selected" : "slot-option"} key={slot.start}><input type="radio" name={`delivery-slot-${orderId}`} checked={selectedStart === slot.start} onChange={() => setSelectedStart(slot.start)} /><span>{slot.label}</span></label>)}</div> : <p className="availability-empty">No delivery windows are open for this date.</p>}</div>}
          {availabilityStatus && <p className="customer-order-wide availability-status" role="status">{availabilityStatus}</p>}
          <label className="customer-order-wide"><span>Delivery notes (optional)</span><textarea rows={2} value={delivery.notes} maxLength={800} onChange={(event) => updateDelivery("notes", event.target.value)} /></label>
        </div>}
      </fieldset>

      <div className="customer-order-editor-footer"><small>Saving recalculates the subtotal, promo discount, and 13% HST. Delivery calendar changes are reserved immediately.</small><button type="button" className="button-primary" disabled={Boolean(busy)} onClick={save}>{busy === "save" ? "Saving…" : "Save changes"}</button></div>
    </div>}
    {message && <p className="form-status" role="status">{message}</p>}
  </div>
}
