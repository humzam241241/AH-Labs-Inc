"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

type Draft = {
  kind: "card" | "3d"
  productName: string
  reference?: string
  categoryName?: string
  dimensions?: string
  customDimensions?: string
  quality?: string
  message?: string
  designOption?: string
  sizeOption?: string
  personalization?: string
  colour?: string
  details?: string
  referenceFileName?: string
  quantity?: number
}

type Fulfillment = "shipping" | "delivery"
type Availability = { slots: { start: string; end: string; label: string }[]; travelMinutes: number; origin: string }

const PENDING_ORDER_KEY = "ah-gifts:pending-order"

function torontoDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000)
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export default function PaymentsPage() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [orderNumber, setOrderNumber] = useState("")
  const [status, setStatus] = useState("")
  const [busy, setBusy] = useState(false)
  const [fulfillment, setFulfillment] = useState<Fulfillment>("shipping")
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", province: "ON", postalCode: "", phone: "" })
  const [delivery, setDelivery] = useState({ name: "", address: "", phone: "", email: "", date: torontoDate(1), notes: "" })
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [selectedStart, setSelectedStart] = useState("")
  const [checking, setChecking] = useState(false)

  const today = useMemo(() => torontoDate(), [])
  const maxDate = useMemo(() => torontoDate(60), [])
  const interacEmail = process.env.NEXT_PUBLIC_INTERAC_EMAIL || ""

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PENDING_ORDER_KEY)
      if (stored) setDraft(JSON.parse(stored) as Draft)
    } catch {
      setStatus("Your saved specifications could not be read. Return to the product page and try again.")
    }
  }, [])

  function updateDelivery(key: keyof typeof delivery, value: string) {
    setDelivery((current) => ({ ...current, [key]: value }))
    if (key === "address" || key === "date") {
      setAvailability(null)
      setSelectedStart("")
    }
  }

  async function checkAvailability() {
    if (delivery.address.trim().length < 8) {
      setStatus("Enter the complete delivery address, including city and postal code.")
      return
    }
    setChecking(true)
    setStatus("Calculating travel time and checking the calendar…")
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
      setStatus(result.slots.length ? "Choose an available 30-minute window below." : "No windows are open on this date. Try another day.")
    } catch (error) {
      setAvailability(null)
      setStatus(error instanceof Error ? error.message : "Availability could not be checked.")
    } finally {
      setChecking(false)
    }
  }

  async function placeOrder() {
    if (!draft) return
    if (fulfillment === "shipping") {
      if (!shipping.name.trim() || shipping.address.trim().length < 8 || !shipping.city.trim() || !shipping.postalCode.trim()) {
        setStatus("Complete the shipping name, address, city, and postal code.")
        return
      }
    } else if (!delivery.name.trim() || delivery.address.trim().length < 8 || !selectedStart) {
      setStatus("Complete the delivery details and choose an available time.")
      return
    }

    setBusy(true)
    setStatus(fulfillment === "delivery" ? "Reserving your delivery window and saving the order…" : "Saving your order…")
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.assign(`/account?next=${encodeURIComponent("/payments")}`)
      return
    }

    try {
      let response: Response
      if (fulfillment === "delivery") {
        const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `web-${Date.now()}`
        response = await fetch("/api/delivery/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: delivery.name,
            phone: delivery.phone,
            email: delivery.email || user.email || "",
            address: delivery.address,
            order: draft.productName,
            orderDraft: draft,
            notes: delivery.notes,
            slotStart: selectedStart,
            requestId,
          }),
        })
      } else {
        response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft, fulfillmentMethod: "shipping", shipping }),
        })
      }
      const result = await response.json() as { message?: string; orderNumber?: string }
      if (!response.ok) throw new Error(result.message || "The order could not be saved.")
      setOrderNumber(result.orderNumber || "")
      sessionStorage.removeItem(PENDING_ORDER_KEY)
      setStatus(fulfillment === "delivery" ? "Delivery reserved. Send the e-Transfer using the reference below." : "Order saved. Send the e-Transfer using the reference below.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The order could not be saved. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  if (orderNumber) return <section className="payment-page site-shell">
    <p className="eyebrow">Interac e-Transfer</p>
    <h1>Thank you — your order is in.</h1>
    <div className="payment-confirmation">
      <p>Use this order reference in the e-Transfer message so we can match your payment.</p>
      <strong>{orderNumber}</strong>
      <div className="payment-recipient"><span>Send to</span><b>{interacEmail || "Interac email is being configured"}</b></div>
      <p className="payment-muted">{fulfillment === "delivery" ? "Your delivery window is reserved. AH Gifts will confirm the final amount and delivery details before production." : "AH Gifts will confirm the final amount, design details, and shipping timing before production."}</p>
      <Link href="/account" className="round-button">View my account <span className="css-arrow" /></Link>
    </div>
  </section>

  return <section className="payment-page site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Interac e-Transfer</span></div>
    <div className="payment-header">
      <p className="eyebrow">Secure order handoff</p>
      <h1>Review your order, then choose how it reaches you.</h1>
      <p>Your specifications stay attached to your customer account. An account is required before the order is placed.</p>
    </div>

    {draft ? <div className="payment-grid">
      <div className="payment-summary">
        <p className="eyebrow">Your specifications</p>
        <h2>{draft.productName}</h2>
        <dl>
          {draft.reference && <div><dt>Reference</dt><dd>{draft.reference}</dd></div>}
          {draft.categoryName && <div><dt>Category</dt><dd>{draft.categoryName}</dd></div>}
          {draft.dimensions && <div><dt>Dimensions</dt><dd>{draft.dimensions}{draft.customDimensions ? ` · ${draft.customDimensions}` : ""}</dd></div>}
          {draft.quality && <div><dt>Quality</dt><dd>{draft.quality}</dd></div>}
          {draft.designOption && <div><dt>Design</dt><dd>{draft.designOption}</dd></div>}
          {draft.sizeOption && <div><dt>Size</dt><dd>{draft.sizeOption}{draft.customDimensions ? ` · ${draft.customDimensions}` : ""}</dd></div>}
          {draft.message && <div><dt>Message</dt><dd>{draft.message}</dd></div>}
          {draft.personalization && <div><dt>Name or text</dt><dd>{draft.personalization}</dd></div>}
          {draft.colour && <div><dt>Colour</dt><dd>{draft.colour}</dd></div>}
          {draft.details && <div><dt>Details</dt><dd>{draft.details}</dd></div>}
          {draft.referenceFileName && <div><dt>Reference file</dt><dd>{draft.referenceFileName}</dd></div>}
          {draft.quantity && <div><dt>Quantity</dt><dd>{draft.quantity}</dd></div>}
        </dl>
      </div>

      <div className="payment-instructions">
        <p className="eyebrow">Fulfillment</p>
        <div className="fulfillment-choice" role="radiogroup" aria-label="Fulfillment method">
          <label className={fulfillment === "shipping" ? "fulfillment-option selected" : "fulfillment-option"}><input type="radio" name="fulfillment" checked={fulfillment === "shipping"} onChange={() => setFulfillment("shipping")} /><span><strong>Shipping</strong><small>We confirm the shipping details and cost with you.</small></span></label>
          <label className={fulfillment === "delivery" ? "fulfillment-option selected" : "fulfillment-option"}><input type="radio" name="fulfillment" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")} /><span><strong>Local delivery</strong><small>Choose an open 30-minute window from the shared calendar.</small></span></label>
        </div>

        {fulfillment === "shipping" ? <div className="fulfillment-panel">
          <h3>Shipping details</h3>
          <div className="form-row">
            <label className="form-field"><span>Recipient name <small>required</small></span><input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} autoComplete="name" /></label>
            <label className="form-field"><span>Phone <small>optional</small></span><input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} autoComplete="tel" /></label>
          </div>
          <label className="form-field"><span>Street address <small>required</small></span><input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} autoComplete="street-address" /></label>
          <div className="form-row">
            <label className="form-field"><span>City <small>required</small></span><input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} autoComplete="address-level2" /></label>
            <label className="form-field"><span>Province <small>required</small></span><input value={shipping.province} onChange={(e) => setShipping({ ...shipping, province: e.target.value })} autoComplete="address-level1" /></label>
          </div>
          <label className="form-field"><span>Postal code <small>required</small></span><input value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} autoComplete="postal-code" /></label>
        </div> : <div className="fulfillment-panel">
          <h3>Delivery details</h3>
          <p className="payment-muted">The calendar checks your address, drive time from Pickering, and every existing booking before showing times.</p>
          <div className="form-row">
            <label className="form-field"><span>Your name <small>required</small></span><input value={delivery.name} onChange={(e) => updateDelivery("name", e.target.value)} autoComplete="name" /></label>
            <label className="form-field"><span>Phone <small>optional</small></span><input value={delivery.phone} onChange={(e) => updateDelivery("phone", e.target.value)} autoComplete="tel" /></label>
          </div>
          <label className="form-field"><span>Email <small>optional</small></span><input type="email" value={delivery.email} onChange={(e) => updateDelivery("email", e.target.value)} autoComplete="email" placeholder="Used for delivery updates" /></label>
          <label className="form-field"><span>Complete delivery address <small>required</small></span><input value={delivery.address} onChange={(e) => updateDelivery("address", e.target.value)} autoComplete="street-address" placeholder="Street, city, province, postal code" /></label>
          <div className="form-row">
            <label className="form-field"><span>Preferred date <small>required</small></span><input type="date" min={today} max={maxDate} value={delivery.date} onChange={(e) => updateDelivery("date", e.target.value)} /></label>
            <div className="form-field"><span>Availability</span><button className="button-secondary availability-button" type="button" onClick={checkAvailability} disabled={checking}>{checking ? "Checking calendar…" : "Show available times"}</button></div>
          </div>
          {availability && <div className="checkout-availability"><p><strong>{availability.travelMinutes} min each way</strong><small>From {availability.origin}</small></p><div className="slot-grid" role="radiogroup" aria-label="Available delivery times">{availability.slots.map((slot) => <label className={selectedStart === slot.start ? "slot-option selected" : "slot-option"} key={slot.start}><input type="radio" name="checkoutSlot" value={slot.start} checked={selectedStart === slot.start} onChange={() => setSelectedStart(slot.start)} /><span>{slot.label}</span></label>)}</div></div>}
          <label className="form-field"><span>Delivery notes <small>optional</small></span><textarea value={delivery.notes} onChange={(e) => updateDelivery("notes", e.target.value)} maxLength={800} rows={3} placeholder="Unit number, buzzer, or anything useful" /></label>
        </div>}

        <div className="payment-how-to-pay">
          <p className="eyebrow">How to pay</p>
          <ol><li>Press place order to save the specifications to your account.</li><li>Send an Interac e-Transfer to <strong>{interacEmail || "the business email shown after setup"}</strong>.</li><li>Include the order reference in the transfer message.</li></ol>
          <p className="payment-muted">Do not send payment until AH Gifts confirms the final amount for your custom request.</p>
          <button className="round-button" onClick={placeOrder} disabled={busy}>{busy ? "Saving order…" : "Place order and show e-Transfer details"}<span className="css-arrow" /></button>
          {status && <p className="form-status" role="status">{status}</p>}
        </div>
      </div>
    </div> : <div className="payment-empty"><h2>No saved order yet.</h2><p>Choose a card or 3D-printed gift first, then continue to checkout.</p><Link href="/gifts" className="round-button">Browse AH Gifts <span className="css-arrow" /></Link></div>}
  </section>
}
