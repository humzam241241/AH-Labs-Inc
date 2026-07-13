"use client"

import { useState } from "react"

import { inquiryCategories } from "@/lib/content"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  return (
    <form className="rule-box p-6" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); if (String(data.get("website") || "")) { setStatus("error"); return } setStatus("sent"); event.currentTarget.reset() }}>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="block text-sm font-medium" htmlFor="name">Name</label><input id="name" name="name" required className="mt-2 w-full border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-3" />
      <label className="mt-5 block text-sm font-medium" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="mt-2 w-full border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-3" />
      <label className="mt-5 block text-sm font-medium" htmlFor="category">Inquiry category</label><select id="category" name="category" required className="mt-2 w-full border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-3"><option value="">Select category</option>{inquiryCategories.map((category) => <option key={category}>{category}</option>)}</select>
      <label className="mt-5 block text-sm font-medium" htmlFor="message">Message</label><textarea id="message" name="message" required rows={7} className="mt-2 w-full resize-y border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-3" />
      <button className="button-primary mt-6 w-full" type="submit">Submit inquiry</button>
      {status === "sent" && <p role="status" className="mt-4 border border-[var(--line)] bg-[var(--surface)] p-3 text-sm">Message prepared locally. Connect a backend or mail workflow before production submissions are expected.</p>}
      {status === "error" && <p role="alert" className="mt-4 border border-[var(--accent)] p-3 text-sm">Submission blocked.</p>}
    </form>
  )
}
