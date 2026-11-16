"use client"

import { FormEvent, useMemo, useRef, useState } from "react"
import type { AvailabilityResponse, BookingResponse } from "@/lib/delivery-booking"
import { DELIVERY_ORIGIN } from "@/lib/delivery-booking"

function torontoDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000)
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function torontoNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date())
  return Object.fromEntries(parts.map((part) => [part.type, part.value]))
}

export function DeliveryRequest({ smsNumber, calendarReady }: { smsNumber: string; calendarReady: boolean }) {
  return calendarReady ? <CalendarBooking /> : <TextDeliveryRequest smsNumber={smsNumber} />
}

function CalendarBooking() {
  const formRef = useRef<HTMLFormElement>(null)
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [selectedStart, setSelectedStart] = useState("")
  const [searching, setSearching] = useState(false)
  const [booking, setBooking] = useState(false)
  const [status, setStatus] = useState("")
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null)
  const today = useMemo(() => torontoDate(), [])
  const maxDate = useMemo(() => torontoDate(60), [])

  function resetAvailability() {
    setAvailability(null)
    setSelectedStart("")
    setConfirmation(null)
    setStatus("")
  }

  async function checkAvailability() {
    const form = formRef.current
    if (!form) return
    const addressInput = form.elements.namedItem("address") as HTMLInputElement
    const dateInput = form.elements.namedItem("date") as HTMLInputElement
    if (!addressInput.reportValidity() || !dateInput.reportValidity()) return
    setSearching(true)
    setStatus("Calculating the drive and checking the calendar…")
    setSelectedStart("")
    setConfirmation(null)
    try {
      const response = await fetch("/api/delivery/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addressInput.value, date: dateInput.value }),
      })
      const result = await response.json() as AvailabilityResponse & { message?: string }
      if (!response.ok) throw new Error(result.message || "Availability could not be checked.")
      setAvailability(result)
      setStatus(result.slots.length ? `${result.slots.length} delivery windows are available.` : "No delivery windows are open on this date. Try another day.")
    } catch (error) {
      setAvailability(null)
      setStatus(error instanceof Error ? error.message : "Availability could not be checked.")
    } finally {
      setSearching(false)
    }
  }

  async function bookDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!selectedStart) {
      setStatus("Choose one of the available delivery windows.")
      return
    }
    const data = new FormData(form)
    const phone = String(data.get("phone") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    if (!phone && !email) {
      setStatus("Enter a phone number or email address so AH Gifts can reach you.")
      return
    }
    setBooking(true)
    setStatus("Reserving this delivery window…")
    try {
      const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const response = await fetch("/api/delivery/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.get("customerName"), phone, email, address: data.get("address"), order: data.get("order"), notes: data.get("notes"), website: data.get("website"), slotStart: selectedStart, requestId,
        }),
      })
      const result = await response.json() as BookingResponse & { message?: string }
      if (!response.ok) throw new Error(result.message || "The delivery could not be booked.")
      setConfirmation(result)
      setStatus("Delivery booked. This time is now blocked for other customers.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "The delivery could not be booked."
      setStatus(message)
      if (/no longer available|already booked/i.test(message)) {
        setAvailability(null)
        setSelectedStart("")
      }
    } finally {
      setBooking(false)
    }
  }

  if (confirmation) return <div className="delivery-card booking-confirmation">
    <p className="eyebrow">Delivery booked</p>
    <h2>You&apos;re in the calendar.</h2>
    <div className="confirmation-reference"><span>Booking reference</span><strong>{confirmation.bookingId}</strong></div>
    <dl className="booking-details">
      <div><dt>Delivery window</dt><dd>{confirmation.customerWindow}</dd></div>
      <div><dt>Estimated departure</dt><dd>{confirmation.departureTime}</dd></div>
      <div><dt>Estimated return</dt><dd>{confirmation.estimatedReturnTime}</dd></div>
      <div><dt>Drive estimate</dt><dd>{confirmation.travelMinutes} minutes each way</dd></div>
    </dl>
    <p>Your delivery window and travel time are blocked so another customer cannot take an overlapping time.</p>
    <button className="button-secondary" type="button" onClick={() => { setConfirmation(null); setAvailability(null); setSelectedStart(""); setStatus("") }}>Book another delivery</button>
  </div>

  return <div className="delivery-card calendar-booking-card">
    <form ref={formRef} onSubmit={bookDelivery}>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="booking-step-heading"><span>1</span><div><strong>Delivery location and date</strong><small>Used to calculate drive time and availability</small></div></div>
      <label className="form-field"><span>Complete delivery address <small>required</small></span><input name="address" required minLength={8} maxLength={240} autoComplete="street-address" placeholder="Street, city, province, postal code" onChange={resetAvailability} /></label>
      <label className="form-field"><span>Delivery date <small>required</small></span><input type="date" name="date" min={today} max={maxDate} required onChange={resetAvailability} /></label>
      <button className="button-secondary availability-button" type="button" onClick={checkAvailability} disabled={searching}>{searching ? "Checking calendar…" : "Show available times"}</button>

      {availability && <section className="availability-results">
        <div className="travel-summary"><span>Estimated drive</span><strong>{availability.travelMinutes} min each way</strong><small>From {DELIVERY_ORIGIN}</small></div>
        <div className="booking-step-heading"><span>2</span><div><strong>Choose a 30-minute window</strong><small>Only times that fit your calendar and travel are shown</small></div></div>
        {availability.slots.length > 0 ? <div className="slot-grid" role="radiogroup" aria-label="Available delivery times">
          {availability.slots.map((slot) => <label className={selectedStart === slot.start ? "slot-option selected" : "slot-option"} key={slot.start}><input type="radio" name="deliverySlot" value={slot.start} checked={selectedStart === slot.start} onChange={() => setSelectedStart(slot.start)} /><span>{slot.label}</span></label>)}
        </div> : <div className="no-slots">No open windows for this address and date.</div>}
      </section>}

      {selectedStart && <section className="customer-booking-details">
        <div className="booking-step-heading"><span>3</span><div><strong>Finish the booking</strong><small>Your slot is rechecked before it is saved</small></div></div>
        <label className="form-field"><span>Your name <small>required</small></span><input name="customerName" required maxLength={100} autoComplete="name" /></label>
        <div className="form-row">
          <label className="form-field"><span>Phone number</span><input name="phone" maxLength={40} autoComplete="tel" inputMode="tel" /></label>
          <label className="form-field"><span>Email</span><input name="email" type="email" maxLength={200} autoComplete="email" /></label>
        </div>
        <p className="contact-requirement">Enter at least one contact method.</p>
        <label className="form-field"><span>Order or item <small>optional</small></span><input name="order" maxLength={160} placeholder="Example: custom keychain" /></label>
        <label className="form-field"><span>Delivery notes <small>optional</small></span><textarea name="notes" maxLength={800} rows={3} placeholder="Unit number, buzzer, or another useful detail" /></label>
        <button className="round-button form-submit" disabled={booking}>{booking ? "Booking…" : "Book delivery"}<span className="css-arrow" aria-hidden="true" /></button>
        <p className="privacy-note">The address and contact details are saved privately in the AH Gifts calendar for this delivery.</p>
      </section>}
    </form>
    <p className="form-status" aria-live="polite">{status}</p>
  </div>
}

function TextDeliveryRequest({ smsNumber }: { smsNumber: string }) {
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
    const lines = [`Hi AH Gifts, I'd like to request delivery on ${dateLabel} at ${timeLabel} Eastern Time.`, name && `Name: ${name}`, order && `Order or item: ${order}`, area && `Delivery town/area: ${area}`, "Please let me know if this time is available. I understand it is not confirmed until you reply."].filter(Boolean)
    setMessage(lines.join("\n"))
    setStatus("Your delivery text is ready. Review it, then open Messages to send it.")
  }

  async function copyMessage() {
    if (!message) return
    try { await navigator.clipboard.writeText(message); setStatus("The delivery text was copied.") } catch { setStatus("Select the text below and copy it manually.") }
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
    {message && <div className="prepared-message"><p className="eyebrow">Your message</p><textarea readOnly value={message} aria-label="Prepared delivery request" rows={8} onFocus={(event) => event.currentTarget.select()} /><div className="message-actions"><button className="round-button" type="button" onClick={openMessages}>Open Messages</button><button className="button-secondary" type="button" onClick={copyMessage}>Copy text</button></div><p>Sending the text requests this time. Your delivery is confirmed only after AH Gifts replies.</p></div>}
    <p className="form-status" aria-live="polite">{status}</p>
  </div>
}
