"use client"
import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
function safeNext(value: string) { return value.startsWith("/") && !value.startsWith("//") ? value : "/account" }
function appOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (configured?.startsWith("https://")) return configured
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  return window.location.origin
}
export function GoogleSignIn({ next = "/account" }: { next?: string }) {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState("")
  async function signIn() {
    setBusy(true); setMessage("")
    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${appOrigin()}/auth/callback?next=${encodeURIComponent(safeNext(next))}` } })
    if (error) { setMessage(error.message); setBusy(false) }
  }
  return <div className="account-auth-card"><div className="account-auth-icon" aria-hidden="true">AH</div><p className="eyebrow">Customer application</p><h2>Apply with Google</h2><p>Apply once to keep custom specifications, invoices, delivery updates, and reward points together.</p><button className="round-button" type="button" onClick={signIn} disabled={busy}>{busy ? "Opening Google…" : "Apply with Google"}<span className="css-arrow" aria-hidden="true" /></button><p className="account-auth-note">Every new account is reviewed by AH Gifts before ordering is enabled.</p>{message && <p className="form-status" role="alert">{message}</p>}</div>
}