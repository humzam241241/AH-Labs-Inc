"use client"

import { useEffect, useState } from "react"
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

const PENDING_ORDER_KEY = "ah-gifts:pending-order"

function label(value?: string) {
  return value?.trim() || "Not provided"
}

export default function PaymentsPage() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [orderNumber, setOrderNumber] = useState("")
  const [status, setStatus] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PENDING_ORDER_KEY)
      if (stored) setDraft(JSON.parse(stored) as Draft)
    } catch {
      setStatus("Your saved specifications could not be read. Return to the product page and try again.")
    }
  }, [])

  const interacEmail = process.env.NEXT_PUBLIC_INTERAC_EMAIL || ""

  async function placeOrder() {
    if (!draft) return
    setBusy(true)
    setStatus("Saving your order…")
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.assign(`/account?next=${encodeURIComponent("/payments")}`)
      return
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      })
      const result = await response.json() as { message?: string; orderNumber?: string }
      if (!response.ok) throw new Error(result.message || "The order could not be saved.")
      setOrderNumber(result.orderNumber || "")
      sessionStorage.removeItem(PENDING_ORDER_KEY)
      setStatus("Order saved. Send the e-Transfer using the reference below.")
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
      <p className="payment-muted">AH Gifts will confirm the final amount, design details, and delivery timing before production.</p>
      <Link href="/account" className="round-button">View my account <span className="css-arrow" /></Link>
    </div>
  </section>

  return <section className="payment-page site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Interac e-Transfer</span></div>
    <div className="payment-header">
      <p className="eyebrow">Secure order handoff</p>
      <h1>Review your order, then send an Interac e-Transfer.</h1>
      <p>Your specifications stay attached to your customer account. We confirm the final price before production.</p>
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
        <p className="eyebrow">How to pay</p>
        <ol>
          <li>Press place order to save the specifications to your account.</li>
          <li>Send an Interac e-Transfer to <strong>{interacEmail || "the business email shown after setup"}</strong>.</li>
          <li>Include the order reference in the transfer message.</li>
        </ol>
        <p className="payment-muted">Do not send payment until AH Gifts confirms the amount for your custom request.</p>
        <button className="round-button" onClick={placeOrder} disabled={busy}>{busy ? "Saving order…" : "Place order and show e-Transfer details"}<span className="css-arrow" /></button>
        {status && <p className="form-status" role="status">{status}</p>}
      </div>
    </div> : <div className="payment-empty"><h2>No saved order yet.</h2><p>Choose a card or 3D-printed gift first, then continue to checkout.</p><Link href="/gifts" className="round-button">Browse AH Gifts <span className="css-arrow" /></Link></div>}
  </section>
}
