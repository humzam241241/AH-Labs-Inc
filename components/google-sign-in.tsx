"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account"
}

export function GoogleSignIn({ next = "/account" }: { next?: string }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  async function signIn() {
    setBusy(true)
    setMessage("")
    const supabase = createSupabaseBrowserClient()
    const destination = safeNext(next)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}` },
    })
    if (error) {
      setMessage(error.message)
      setBusy(false)
    }
  }

  return <div className="account-auth-card">
    <div className="account-auth-icon" aria-hidden="true">AH</div>
    <p className="eyebrow">Customer account</p>
    <h2>Sign in or create your account</h2>
    <p>Use Google to keep your card and 3D gift specifications, orders, delivery updates, and reorders together.</p>
    <button className="round-button" type="button" onClick={signIn} disabled={busy}>{busy ? "Opening Google…" : "Continue with Google"}<span className="css-arrow" aria-hidden="true" /></button>
    <p className="account-auth-note">New here? Google creates your AH Gifts account securely the first time you continue.</p>
    {message && <p className="form-status" role="alert">{message}</p>}
  </div>
}
