"use client"

import { FormEvent, useMemo, useState } from "react"

function torontoNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date())
  return Object.fromEntries(parts.map((part) => [part.type, part.value]))
}

export function DeliveryRequest({ smsNumber }: { smsNumber: string }) {
  const now = useMemo(torontoNow, [])
  const today = `${now.year}-${now.month}-${now.day}`
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const date = String(data.get("date"))
    const time = String(data.get("time"))
    const currentTime = `${now.hour}:${now.minute}`
    if (date < today || (date === today && time <= currentTime)) {
      setMessage("")
      setStatus("Choose a future date and time in Eastern Time.")
      return
    }
    const dateLabel = new Intl.DateTimeFormat("en-CA", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`))
    const [hour, minute] = time.split(":").map(Number)
    const timeLabel = new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 1, hour, minute)))
    const name = String(data.get("name") ?? "").trim()
    const order = String(data.get("order") ?? "").trim()
    const area = String(data.get("area") ?? "").trim()
    const lines = [
      `Hi AH Gifts, I'd like to request delivery on ${dateLabel} at ${timeLabel} Eastern Time.`,
      name && `Name: ${name}`,
      order && `Order or item: ${order}`,
      area && `Delivery town/area: ${area}`,
      "Please let me know if this time is available. I understand it is not confirmed until you reply.",
    ].filter(Boolean)
    setMessage(lines.join("\n"))
    setStatus("Your delivery text is ready. Review it, then open Messages to send it.")
  }

  async function copyMessage() {
    if (!message) return
    try {
      await navigator.clipboard.writeText(message)
      setStatus("The delivery text was copied.")
    } catch {
      setStatus("Select the text below and copy it manually.")
    }
  }

  async function openMessages() {
    if (!message) return
    try { await navigator.clipboard.writeText(message) } catch {}
    window.location.href = `sms:${smsNumber}?body=${encodeURIComponent(message)}`
  }

  return <div className="delivery-card">
    <form onSubmit={prepare}>
      <div className="form-row">
        <label className="form-field"><span>Preferred date <small>required</small></span><input type="date" name="date" min={today} required /></label>
        <label className="form-field"><span>Preferred time <small>required</small></span><input type="time" name="time" required /></label>
      </div>
      <label className="form-field"><span>Your name <small>required</small></span><input name="name" autoComplete="name" maxLength={100} required /></label>
      <label className="form-field"><span>Order or item <small>optional</small></span><input name="order" maxLength={120} placeholder="Example: custom keychain" /></label>
      <label className="form-field"><span>Delivery town or area <small>optional</small></span><input name="area" maxLength={120} placeholder="Do not enter your full street address here" /></label>
      <button className="round-button form-submit">Prepare delivery text <span className="css-arrow" aria-hidden="true" /></button>
    </form>
    {message && <div className="prepared-message">
      <p className="eyebrow">Your message</p>
      <textarea readOnly value={message} aria-label="Prepared delivery request" rows={8} onFocus={(event) => event.currentTarget.select()} />
      <div className="message-actions"><button className="round-button" type="button" onClick={openMessages}>Open Messages</button><button className="button-secondary" type="button" onClick={copyMessage}>Copy text</button></div>
      <p>Sending the text requests this time. Your delivery is confirmed only after AH Gifts replies.</p>
    </div>}
    <p className="form-status" aria-live="polite">{status}</p>
  </div>
}
