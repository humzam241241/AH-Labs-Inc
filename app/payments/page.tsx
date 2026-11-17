"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
type Pricing = {
  quantity: number
  unitPriceCents: number | null
  subtotalCents: number | null
  discountCents: number | null
  taxableCents: number | null
  taxCents: number | null
  totalCents: number | null
  promoCode: string | null
  promoLabel: string | null
}

const PENDING_ORDER_KEY = "ah-gifts:pending-order"
const AVAILABILITY_CACHE_PREFIX = "ah-gifts:delivery-availability:"
const AVAILABILITY_CACHE_MS = 45_000
const money = (cents: number | null) => cents == null ? "Pending quote" : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100)

function torontoDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000)
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function deliveryAvailabilityKey(address: string, date: string) {
  return `${date}:${address.trim().toLowerCase().replace(/\s+/g, " ")}`
}

function readCachedAvailability(key: string) {
  try {
    const raw = sessionStorage.getItem(`${AVAILABILITY_CACHE_PREFIX}${key}`)
    if (!raw) return null
    const cached = JSON.parse(raw) as { savedAt?: number; data?: Availability }
    if (!cached.savedAt || !cached.data || Date.now() - cached.savedAt > AVAILABILITY_CACHE_MS) {
      sessionStorage.removeItem(`${AVAILABILITY_CACHE_PREFIX}${key}`)
      return null
    }
    return cached.data
  } catch {
    return null
  }
}

function cacheAvailability(key: string, data: Availability) {
  try {
    sessionStorage.setItem(`${AVAILABILITY_CACHE_PREFIX}${key}`, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // Availability still works when browser storage is blocked.
  }
}

export default function PaymentsPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [status, setStatus] = useState("")
  const [busy, setBusy] = useState(false)
  const [fulfillment, setFulfillment] = useState<Fulfillment>("shipping")
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", province: "ON", postalCode: "", phone: "" })
  const [delivery, setDelivery] = useState({ name: "", address: "", phone: "", email: "", date: torontoDate(1), notes: "" })
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState("")
  const [selectedStart, setSelectedStart] = useState("")
  const [checking, setChecking] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [pricingBusy, setPricingBusy] = useState(false)
  const [promoStatus, setPromoStatus] = useState("")
  const availabilityAbortRef = useRef<AbortController | null>(null)
  const shownAvailabilityKeyRef = useRef("")

  const today = useMemo(() => torontoDate(), [])
  const maxDate = useMemo(() => torontoDate(60), [])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PENDING_ORDER_KEY)
      if (stored) setDraft(JSON.parse(stored) as Draft)
    } catch {
      setStatus("Your saved specifications could not be read. Return to the product page and try again.")
    }
  }, [])

  useEffect(() => () => availabilityAbortRef.current?.abort(), [])

  useEffect(() => {
    if (!draft) return
    void loadQuote("")
    // The draft is intentionally the only automatic trigger. Promo codes use the Apply button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  async function loadQuote(code = promoCode) {
    if (!draft) return
    setPricingBusy(true)
    setPromoStatus(code ? "Checking code…" : "")
    try {
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, promoCode: code }),
      })
      const result = await response.json() as { pricing?: Pricing; message?: string }
      if (!response.ok || !result.pricing) throw new Error(result.message || "The order total could not be calculated.")
      setPricing(result.pricing)
      setPromoStatus(code ? `Applied ${result.pricing.promoCode}.` : "")
    } catch (error) {
      setPromoStatus(error instanceof Error ? error.message : "The promo code could not be checked.")
      if (!code) setPricing(null)
    } finally {
      setPricingBusy(false)
    }
  }

  function updateDelivery(key: keyof typeof delivery, value: string) {
    const next = { ...delivery, [key]: value }
    setDelivery(next)
    if (key === "address" || key === "date") {
      const nextKey = deliveryAvailabilityKey(next.address, next.date)
      if (shownAvailabilityKeyRef.current && shownAvailabilityKeyRef.current !== nextKey) {
        availabilityAbortRef.current?.abort()
        shownAvailabilityKeyRef.current = ""
        setAvailability(null)
        setAvailabilityStatus("")
        setSelectedStart("")
      }
    }
  }

  async function checkAvailability(forceRefresh = false) {
    const address = delivery.address.trim().replace(/\s+/g, " ")
    const date = delivery.date
    if (address.length < 8) {
      setAvailabilityStatus("Enter the complete delivery address, including city and postal code.")
      return
    }
    const requestKey = deliveryAvailabilityKey(address, date)
    const cached = forceRefresh ? null : readCachedAvailability(requestKey)
    if (cached) {
      shownAvailabilityKeyRef.current = requestKey
      setAvailability(cached)
      setSelectedStart("")
      setAvailabilityStatus(cached.slots.length ? "Times updated just now. Choose a window." : "No windows are open on this date. Try another day.")
      return
    }

    availabilityAbortRef.current?.abort()
    const controller = new AbortController()
    availabilityAbortRef.current = controller
    shownAvailabilityKeyRef.current = requestKey
    setChecking(true)
    setAvailabilityStatus("Checking travel time and the shared calendar…")
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000)
    try {
      const response = await fetch("/api/delivery/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, date }),
        signal: controller.signal,
      })
      const result = await response.json() as Availability & { message?: string }
      if (!response.ok) throw new Error(result.message || "Availability could not be checked.")
      if (availabilityAbortRef.current !== controller) return
      cacheAvailability(requestKey, result)
      shownAvailabilityKeyRef.current = requestKey
      setAvailability(result)
      setSelectedStart("")
      setAvailabilityStatus(result.slots.length ? "Live times are ready. Choose a 30-minute window." : "No windows are open on this date. Try another day.")
    } catch (error) {
      if (controller.signal.aborted && availabilityAbortRef.current !== controller) return
      setAvailability(null)
      shownAvailabilityKeyRef.current = ""
      setAvailabilityStatus(controller.signal.aborted ? "The calendar took too long to respond. Try again." : error instanceof Error ? error.message : "Availability could not be checked.")
    } finally {
      window.clearTimeout(timeoutId)
      if (availabilityAbortRef.current === controller) {
        availabilityAbortRef.current = null
        setChecking(false)
      }
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
    setStatus(fulfillment === "delivery" ? "Reserving your delivery window and creating the order number…" : "Creating your order number…")
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
            promoCode,
          }),
        })
      } else {
        response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft, fulfillmentMethod: "shipping", shipping, promoCode }),
        })
      }
      const result = await response.json() as { message?: string; orderNumber?: string }
      if (!response.ok) {
        if (fulfillment === "delivery" && response.status === 409) {
          setSelectedStart("")
          await checkAvailability(true)
          throw new Error("That delivery time was just taken. The calendar has been refreshed—choose another open time.")
        }
        throw new Error(result.message || "The order could not be saved.")
      }
      if (!result.orderNumber) throw new Error("The order was not assigned a reference number. Please try again.")
      sessionStorage.removeItem(PENDING_ORDER_KEY)
      router.push(`/checkout/${encodeURIComponent(result.orderNumber)}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The order could not be saved. Please try again.")
      setBusy(false)
    }
  }

  return <section className="payment-page site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Checkout</span></div>
    <div className="payment-header">
      <p className="eyebrow">Quick checkout</p>
      <h1>Review, choose fulfillment, and place your order.</h1>
      <p>Your specifications stay attached to your approved customer account.</p>
    </div>

    {draft ? <div className="payment-grid">
      <aside className="payment-summary">
        <p className="eyebrow">Your order</p>
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
          <div><dt>Quantity</dt><dd>{draft.quantity || 1}</dd></div>
        </dl>
        <div className="checkout-totals" aria-live="polite">
          <div><span>Subtotal</span><strong>{pricingBusy && !pricing ? "Calculating…" : money(pricing?.subtotalCents ?? null)}</strong></div>
          {!!pricing?.discountCents && <div className="checkout-discount"><span>Promo {pricing.promoCode}</span><strong>−{money(pricing.discountCents)}</strong></div>}
          <div><span>HST (13%)</span><strong>{money(pricing?.taxCents ?? null)}</strong></div>
          <div className="checkout-total"><span>Total</span><strong>{money(pricing?.totalCents ?? null)}</strong></div>
          {pricing?.totalCents == null && <small>Custom items receive a final quote before payment. HST will be calculated on that quote.</small>}
        </div>
      </aside>

      <div className="payment-instructions">
        <section className="checkout-step">
          <span className="checkout-step-number">1</span><div><p className="eyebrow">Promo code</p><h2>Have a code?</h2></div>
          <div className="promo-entry"><input value={promoCode} onChange={(event) => { setPromoCode(event.target.value.toUpperCase()); setPromoStatus("") }} placeholder="Enter promo code" maxLength={40} /><button type="button" className="button-secondary" onClick={() => loadQuote()} disabled={pricingBusy || !promoCode.trim()}>{pricingBusy ? "Checking…" : "Apply"}</button></div>
          {promoStatus && <p className="form-status" role="status">{promoStatus}</p>}
        </section>

        <section className="checkout-step">
          <span className="checkout-step-number">2</span><div><p className="eyebrow">Fulfillment</p><h2>How should it reach you?</h2></div>
          <div className="fulfillment-choice" role="radiogroup" aria-label="Fulfillment method">
            <label className={fulfillment === "shipping" ? "fulfillment-option selected" : "fulfillment-option"}><input type="radio" name="fulfillment" checked={fulfillment === "shipping"} onChange={() => setFulfillment("shipping")} /><span><strong>Shipping</strong><small>We confirm the shipping cost with you.</small></span></label>
            <label className={fulfillment === "delivery" ? "fulfillment-option selected" : "fulfillment-option"}><input type="radio" name="fulfillment" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")} /><span><strong>Local delivery</strong><small>Choose a live 30-minute calendar window.</small></span></label>
          </div>

          {fulfillment === "shipping" ? <div className="fulfillment-panel">
            <h3>Shipping details</h3>
            <div className="form-row"><label className="form-field"><span>Recipient name <small>required</small></span><input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} autoComplete="name" /></label><label className="form-field"><span>Phone <small>optional</small></span><input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} autoComplete="tel" /></label></div>
            <label className="form-field"><span>Street address <small>required</small></span><input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} autoComplete="street-address" /></label>
            <div className="form-row"><label className="form-field"><span>City <small>required</small></span><input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} autoComplete="address-level2" /></label><label className="form-field"><span>Province <small>required</small></span><input value={shipping.province} onChange={(e) => setShipping({ ...shipping, province: e.target.value })} autoComplete="address-level1" /></label></div>
            <label className="form-field"><span>Postal code <small>required</small></span><input value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} autoComplete="postal-code" /></label>
          </div> : <div className="fulfillment-panel">
            <h3>Delivery details</h3>
            <p className="payment-muted">Times account for the shared calendar and travel from Pickering.</p>
            <div className="form-row"><label className="form-field"><span>Your name <small>required</small></span><input value={delivery.name} onChange={(e) => updateDelivery("name", e.target.value)} autoComplete="name" /></label><label className="form-field"><span>Phone <small>optional</small></span><input value={delivery.phone} onChange={(e) => updateDelivery("phone", e.target.value)} autoComplete="tel" /></label></div>
            <label className="form-field"><span>Email <small>optional</small></span><input type="email" value={delivery.email} onChange={(e) => updateDelivery("email", e.target.value)} autoComplete="email" placeholder="Used for delivery updates" /></label>
            <label className="form-field"><span>Complete delivery address <small>required</small></span><input value={delivery.address} onChange={(e) => updateDelivery("address", e.target.value)} autoComplete="street-address" placeholder="Street, city, province, postal code" /></label>
            <div className="form-row delivery-availability-row"><label className="form-field"><span>Preferred date <small>required</small></span><input type="date" min={today} max={maxDate} value={delivery.date} onChange={(e) => updateDelivery("date", e.target.value)} /></label><div className="form-field"><span>Availability</span><button className="button-secondary availability-button" type="button" onClick={() => checkAvailability(Boolean(availability))} disabled={checking || delivery.address.trim().length < 8 || !delivery.date} aria-busy={checking}>{checking ? "Checking…" : availability ? "Refresh times" : "Show times"}</button></div></div>
            {checking && !availability && <div className="availability-loading" role="status"><span className="availability-spinner" aria-hidden="true" /><div><strong>Checking the calendar</strong><small>Travel time and existing bookings are being compared.</small></div></div>}
            {availability && <div className="checkout-availability"><div className="availability-summary"><strong>{availability.travelMinutes} min each way</strong><small>From {availability.origin}</small></div>{availability.slots.length ? <div className="slot-grid" role="radiogroup" aria-label="Available delivery times">{availability.slots.map((slot) => <label className={selectedStart === slot.start ? "slot-option selected" : "slot-option"} key={slot.start}><input type="radio" name="checkoutSlot" value={slot.start} checked={selectedStart === slot.start} onChange={() => setSelectedStart(slot.start)} /><span>{slot.label}</span></label>)}</div> : <p className="availability-empty">No delivery windows are open for this date. Pick another day and check again.</p>}</div>}
            {availabilityStatus && <p className="availability-status" role="status" aria-live="polite">{availabilityStatus}</p>}
            <label className="form-field"><span>Delivery notes <small>optional</small></span><textarea value={delivery.notes} onChange={(e) => updateDelivery("notes", e.target.value)} maxLength={800} rows={3} placeholder="Unit number, buzzer, or anything useful" /></label>
          </div>}
        </section>

        <section className="checkout-place-order">
          <p className="eyebrow">Final step</p>
          <h2>Create my order number</h2>
          <p>The order will appear in your account and the master desk immediately. Interac e-Transfer details will be shown on the next screen when the business email is ready.</p>
          <button className="round-button" onClick={placeOrder} disabled={busy}>{busy ? "Creating order…" : "Place order and continue"}<span className="css-arrow" /></button>
          {status && <p className="form-status" role="status">{status}</p>}
        </section>
      </div>
    </div> : <div className="payment-empty"><h2>No saved order yet.</h2><p>Choose a card or 3D-printed gift first, then continue to checkout.</p><Link href="/gifts" className="round-button">Browse AH Gifts <span className="css-arrow" /></Link></div>}
  </section>
}

