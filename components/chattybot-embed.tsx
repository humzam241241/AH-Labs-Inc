"use client"

import { useEffect } from "react"

const WIDGET_URL = "https://chattybot-tawny.vercel.app/widget.js"
const SITE_ID = "4613a808-8c84-4cff-a9cf-1ec922b0e420"
const API_URL = "https://chattybot-0jvh.onrender.com"

export function ChattyBotEmbed() {
  useEffect(() => {
    if (document.getElementById("chattybot-script")) return

    const script = document.createElement("script")
    script.id = "chattybot-script"
    script.src = WIDGET_URL
    script.setAttribute("data-site-id", SITE_ID)
    script.setAttribute("data-api-url", API_URL)
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return null
}
