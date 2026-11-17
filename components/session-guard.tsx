"use client"

import { useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const INACTIVITY_MS = 15 * 60 * 1000
const TAB_SESSION_KEY = "ah-tab-session"
const OAUTH_PENDING_KEY = "ah-google-oauth-pending"

async function clearSession() {
  try {
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
  } catch {}
  try { await createSupabaseBrowserClient().auth.signOut() } catch {}
}

export function SessionGuard() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    let timer: ReturnType<typeof setTimeout> | undefined
    let active = false
    let redirecting = false

    const redirectToSignIn = async (reason: "timeout" | "new-session") => {
      if (redirecting) return
      redirecting = true
      if (timer) clearTimeout(timer)
      sessionStorage.removeItem(TAB_SESSION_KEY)
      await clearSession()
      window.location.replace(`/account?auth=${reason}`)
    }

    const armTimeout = () => {
      if (!active || redirecting) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { void redirectToSignIn("timeout") }, INACTIVITY_MS)
    }

    const onActivity = () => armTimeout()
    const events = ["pointerdown", "keydown", "touchstart", "scroll", "mousemove"] as const
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }))

    const initialise = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const hadTabSession = sessionStorage.getItem(TAB_SESSION_KEY) === "1"
      const oauthPending = sessionStorage.getItem(OAUTH_PENDING_KEY) === "1"

      if (!hadTabSession && !oauthPending) {
        await redirectToSignIn("new-session")
        return
      }

      active = true
      sessionStorage.setItem(TAB_SESSION_KEY, "1")
      sessionStorage.removeItem(OAUTH_PENDING_KEY)
      armTimeout()
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        active = false
        if (timer) clearTimeout(timer)
        return
      }
      active = true
      sessionStorage.setItem(TAB_SESSION_KEY, "1")
      sessionStorage.removeItem(OAUTH_PENDING_KEY)
      armTimeout()
    })

    void initialise()

    return () => {
      if (timer) clearTimeout(timer)
      authListener.subscription.unsubscribe()
      events.forEach((event) => window.removeEventListener(event, onActivity))
    }
  }, [])

  return null
}
