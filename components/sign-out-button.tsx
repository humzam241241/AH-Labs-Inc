"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export function SignOutButton() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function signOut() {
    setBusy(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      })
      if (!response.ok) throw new Error("Sign out could not be completed.")
      await createSupabaseBrowserClient().auth.signOut()
      try { sessionStorage.removeItem("ah-tab-session") } catch {}\n      window.location.replace("/account?signed_out=1")
    } catch (caught) {
      setBusy(false)
      setError(caught instanceof Error ? caught.message : "Sign out could not be completed.")
    }
  }

  return <div className="signout-control">
    <button type="button" className="button-secondary" onClick={signOut} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button>
    {error && <small className="form-status" role="alert">{error}</small>}
  </div>
}
