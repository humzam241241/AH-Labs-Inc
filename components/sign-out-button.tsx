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
      const browserClient = createSupabaseBrowserClient()
      const { error: browserError } = await browserClient.auth.signOut({ scope: "global" })
      if (browserError) throw new Error(browserError.message)

      // The browser client clears the active session immediately. The server
      // request also clears any SSR cookie before the redirect, but must not
      // prevent sign-out if the network is slow.
      try {
        await fetch("/api/auth/signout", {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
          keepalive: true,
        })
      } catch {}

      try { sessionStorage.removeItem("ah-tab-session") } catch {}
      window.location.replace("/account?signed_out=1")
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
