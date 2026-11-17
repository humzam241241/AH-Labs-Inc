"use client"

import { useState } from "react"

export function AccountDecision({ customerId, currentStatus }: { customerId: string; currentStatus: string }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  async function update(status: "approved" | "rejected") {
    setBusy(true); setMessage("")
    const response = await fetch(`/api/master/customers/${customerId}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    const data = await response.json().catch(() => ({}))
    setMessage(response.ok ? `Application ${status}. Refreshing…` : data.message || "Could not update this application.")
    if (response.ok) window.setTimeout(() => window.location.reload(), 500)
    else setBusy(false)
  }
  if (currentStatus !== "pending") return <span className={`status-chip ${currentStatus}`}>{currentStatus}</span>
  return <div className="master-action-row"><button disabled={busy} onClick={() => update("approved")} className="button-primary">Approve</button><button disabled={busy} onClick={() => update("rejected")} className="button-secondary">Decline</button>{message && <small>{message}</small>}</div>
}

export function PaymentConfirmation({ orderId, alreadyPaid }: { orderId: string; alreadyPaid: boolean }) {
  const [busy, setBusy] = useState(false)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  async function confirm() {
    const totalCents = Math.round(Number(amount) * 100)
    if (!Number.isFinite(totalCents) || totalCents < 1) { setMessage("Enter the paid amount in CAD."); return }
    setBusy(true); setMessage("")
    const response = await fetch(`/api/master/orders/${orderId}/payment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ totalCents }) })
    const data = await response.json().catch(() => ({}))
    setMessage(response.ok ? `e-Transfer confirmed — ${data.invoiceNumber}; ${data.points} points added. Fulfillment remains separate.` : data.message || "Could not confirm payment.")
    if (response.ok) window.setTimeout(() => window.location.reload(), 650)
    else setBusy(false)
  }
  if (alreadyPaid) return <span className="status-chip approved">Paid</span>
  return <div className="master-payment"><input aria-label="Paid amount in CAD" inputMode="decimal" placeholder="Amount CAD" value={amount} onChange={(event) => setAmount(event.target.value)} /><button disabled={busy} onClick={confirm} className="button-primary">Confirm e-Transfer</button>{message && <small>{message}</small>}</div>
}
