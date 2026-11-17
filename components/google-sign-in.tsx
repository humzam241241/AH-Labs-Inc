"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account"
}

function appOrigin() {
  return window.location.origin.replace(/\/$/, "")
}

export function GoogleSignIn({ next = "/account" }: { next?: string }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  async function signIn() {
    setBusy(true)
    setMessage("")
    try { sessionStorage.setItem("ah-google-oauth-pending", "1") } catch {}

    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appOrigin()}/auth/callback?next=${encodeURIComponent(safeNext(next))}`,
        // Do not silently reuse another Google account from this browser.
        queryParams: { prompt: "select_account" },
      },
    })

    if (error) {
      setMessage(error.message)
      setBusy(false)
      try { sessionStorage.removeItem("ah-google-oauth-pending") } catch {}
    }
  }

  return <div className="account-auth-card"><div className="account-auth-icon" aria-hidden="true">AH</div><p className="eyebrow">Customer application</p><h2>Apply with Google</h2><p>Apply once to keep custom specifications, invoices, delivery updates, and reward points together.</p><button className="round-button" type="button" onClick={signIn} disabled={busy}>{busy ? "Opening Google…" : "Apply with Google"}<span className="css-arrow" aria-hidden="true" /></button><p className="account-auth-note">Every new account is reviewed by AH Gifts before ordering is enabled.</p>{message && <p className="form-status" role="alert">{message}</p>}</div>
}
