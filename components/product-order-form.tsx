"use client"

import { FormEvent, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

type Props = {
  productName: string
  reference: string
  categoryName: string
}

type CardDraft = {
  version: 1
  kind: "card"
  productName: string
  reference: string
  categoryName: string
  dimensions: string
  customDimensions: string
  quality: string
  message: string
  quantity: number
  createdAt: string
}

const PENDING_ORDER_KEY = "ah-gifts:pending-order"

export function ProductOrderForm({ productName, reference, categoryName }: Props) {
  const [dimensions, setDimensions] = useState("Mini — 3 × 3 in square")
  const [customDimensions, setCustomDimensions] = useState("")
  const [quality, setQuality] = useState("Premium")
  const [message, setMessage] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState("")

  async function continueToOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) {
      setStatus("Add the message you want printed inside the card.")
      return
    }

    const draft: CardDraft = {
      version: 1,
      kind: "card",
      productName,
      reference,
      categoryName,
      dimensions,
      customDimensions: customDimensions.trim(),
      quality,
      message: message.trim(),
      quantity: Math.max(1, Number.parseInt(quantity, 10) || 1),
      createdAt: new Date().toISOString(),
    }

    sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(draft))
    setBusy(true)
    setStatus("Checking your account…")
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    const next = "/payments"
    if (!user) {
      window.location.assign(`/account?next=${encodeURIComponent(next)}`)
      return
    }
    window.location.assign(next)
  }

  return <form className="product-order-form" onSubmit={continueToOrder}>
    <div className="order-form-heading">
      <p className="eyebrow">Make it yours</p>
      <h2>Customize this card</h2>
      <p>Choose the format and finish, then write the message you want us to print.</p>
    </div>

    <fieldset>
      <legend>Card dimensions</legend>
      {[
        "Mini — 3 × 3 in square",
        "Small — A2 · 4.25 × 5.5 in",
        "Medium — A7 · 5 × 7 in",
        "Large — A5 · 5.8 × 8.3 in",
        "Custom dimensions",
      ].map((option) => <label className="radio-option" key={option}>
        <input type="radio" name="dimensions" value={option} checked={dimensions === option} onChange={(event) => setDimensions(event.target.value)} />
        <span><strong>{option}</strong><small>{option === "Custom dimensions" ? "Tell us the size you need below" : option.startsWith("Mini") ? "Keepsake square" : option.startsWith("Large") ? "Roomier folded card" : "Standard folded card"}</small></span>
      </label>)}
      <label className="form-field"><span>Custom dimensions <small>optional</small></span><input value={customDimensions} onChange={(event) => setCustomDimensions(event.target.value)} placeholder="Example: 140 × 190 mm folded" maxLength={100} /></label>
    </fieldset>

    <fieldset>
      <legend>Print quality</legend>
      {[
        ["Standard", "Clean everyday print"],
        ["Premium", "Richer colour and heavier stock"],
        ["Fine-art", "Highest-detail finish for keepsakes"],
      ].map(([option, detail]) => <label className="radio-option" key={option}>
        <input type="radio" name="quality" value={option} checked={quality === option} onChange={(event) => setQuality(event.target.value)} />
        <span><strong>{option}</strong><small>{detail}</small></span>
      </label>)}
    </fieldset>

    <div className="form-row">
      <label className="form-field"><span>Quantity</span><input type="number" min="1" max="50" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
      <div className="order-form-reference"><span>Design reference</span><strong>{reference}</strong><small>{categoryName}</small></div>
    </div>

    <label className="form-field"><span>What do you want to say? <small>required</small></span><textarea required rows={6} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write the message, names, dates, or wording you want inside the card." /></label>

    <button className="round-button form-submit" disabled={busy}>{busy ? "Opening order…" : "Continue to order"}<span className="css-arrow" aria-hidden="true" /></button>
    <p className="form-status" role="status" aria-live="polite">{status}</p>
    <p className="order-form-footnote">You’ll sign in before the order is placed. Your saved specifications will follow you to the Interac e-Transfer page.</p>
  </form>
}
