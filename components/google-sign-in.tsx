"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export function GoogleSignIn() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  async function signIn() {
    setBusy(true)
    setMessage("")
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setMessage(error.message); setBusy(false) }
  }
  return <div className="account-auth-card">
    <p className="eyebrow">Customer account</p>
    <h2>Keep every order in one place.</h2>
    <p>Sign in with Google to see your order history, reorder past items, and track delivery estimates.</p>
    <button className="round-button" type="button" onClick={signIn} disabled={busy}>{busy ? "Opening Google…" : "Continue with Google"}<span className="css-arrow" aria-hidden="true" /></button>
    {message && <p className="form-status" role="alert">{message}</p>}
  </div>
}
