"use client"

import { FormEvent, useRef, useState } from "react"

type Product = {
  slug: string
  name: string
  standardDesign: string
  standardSize: string
}

const MAX_FILE_SIZE = 3 * 1024 * 1024
const ACCEPTED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"])

function requestText(form: HTMLFormElement, product: Product) {
  const data = new FormData(form)
  const value = (name: string) => String(data.get(name) ?? "").trim() || "Not provided"
  return [
    "AH Gifts custom 3D request",
    "",
    `Product: ${product.name}`,
    `Design option: ${value("designOption")}`,
    `Size option: ${value("sizeOption")}`,
    `Requested dimensions: ${value("customSize")}`,
    `Name or text: ${value("personalization")}`,
    `Colour preference: ${value("colour")}`,
    `Idea and details: ${value("details")}`,
    "",
    `Customer name: ${value("customerName")}`,
    `Email: ${value("email")}`,
    `Reference file: ${(data.get("reference") as File)?.name || "None"}`,
    "",
    `Standard starting design: ${product.standardDesign}`,
    `Standard starting size: ${product.standardSize}`,
  ].join("\n")
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-")
}

export function PrintRequestForm({ product, canSend }: { product: Product; canSend: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState("")
  const [sending, setSending] = useState(false)

  function validFile(file?: File | null) {
    if (!file || file.size === 0) return true
    if (file.size > MAX_FILE_SIZE) {
      setStatus("The reference file must be 3 MB or smaller.")
      return false
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      setStatus("Upload a PDF, PNG, or JPEG file.")
      return false
    }
    return true
  }

  async function saveCopy() {
    const form = formRef.current
    if (!form || !form.reportValidity()) return
    const data = new FormData(form)
    const file = data.get("reference") as File | null
    if (!validFile(file)) return
    setStatus("Preparing your request copy…")
    const { strToU8, zipSync } = await import("fflate")
    const files: Record<string, Uint8Array> = { "request.txt": strToU8(requestText(form, product)) }
    if (file && file.size) files[`reference/${safeFileName(file.name)}`] = new Uint8Array(await file.arrayBuffer())
    const zipped = zipSync(files, { level: 0 })
    const blob = new Blob([zipped], { type: "application/zip" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ah-gifts-${product.slug}-request.zip`
    link.click()
    URL.revokeObjectURL(url)
    setStatus("Your request copy was downloaded with the reference file.")
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const file = new FormData(form).get("reference") as File | null
    if (!validFile(file)) return
    if (!canSend) {
      await saveCopy()
      return
    }
    setSending(true)
    setStatus("Sending your request…")
    try {
      const response = await fetch("/api/print-request", { method: "POST", body: new FormData(form) })
      const result = await response.json() as { message?: string }
      if (!response.ok) throw new Error(result.message || "Your request could not be sent.")
      setStatus("Your request was sent. AH Gifts will review it and reply by email.")
      form.reset()
    } catch (error) {
      setStatus(error instanceof Error ? `${error.message} You can still download a copy below.` : "Your request could not be sent. You can still download a copy below.")
    } finally {
      setSending(false)
    }
  }

  return <form ref={formRef} className="request-form" onSubmit={submit}>
    <input type="hidden" name="product" value={product.slug} />
    <div className="form-field honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>

    <fieldset><legend>1. Choose your starting point</legend>
      <label className="radio-option"><input type="radio" name="designOption" value={`Standard — ${product.standardDesign}`} defaultChecked /><span><strong>Standard item</strong><small>{product.standardDesign}</small></span></label>
      <label className="radio-option"><input type="radio" name="designOption" value="My own design" /><span><strong>My own design</strong><small>Share your idea or attach a reference below</small></span></label>
    </fieldset>

    <fieldset><legend>2. Choose the size</legend>
      <label className="radio-option"><input type="radio" name="sizeOption" value={`Standard — ${product.standardSize}`} defaultChecked /><span><strong>Standard starting size</strong><small>{product.standardSize}</small></span></label>
      <label className="radio-option"><input type="radio" name="sizeOption" value="Custom size" /><span><strong>Custom size</strong><small>Tell us the dimensions or what the item needs to fit</small></span></label>
      <label className="form-field"><span>Custom dimensions or fit details <small>optional</small></span><input name="customSize" maxLength={120} placeholder="Example: 90 mm wide or fits an iPhone 15 with a case" /></label>
    </fieldset>

    <fieldset><legend>3. Add your details</legend>
      <div className="form-row">
        <label className="form-field"><span>Name or text <small>optional</small></span><input name="personalization" maxLength={80} placeholder="Example: Maya" /></label>
        <label className="form-field"><span>Colour preference <small>optional</small></span><input name="colour" maxLength={80} placeholder="Example: sage green and cream" /></label>
      </div>
      <label className="form-field"><span>Describe your idea <small>required</small></span><textarea name="details" required maxLength={1500} rows={6} placeholder="Tell us how you want it to look, who it is for, and any details that matter." /></label>
      <label className="form-field file-field"><span>Reference file <small>optional</small></span><input type="file" name="reference" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={(event) => validFile(event.target.files?.[0])} /><small>PDF, PNG, or JPEG. Maximum 3 MB.</small></label>
    </fieldset>

    <fieldset><legend>4. How should we reply?</legend>
      <div className="form-row">
        <label className="form-field"><span>Your name <small>required</small></span><input name="customerName" required maxLength={100} autoComplete="name" /></label>
        <label className="form-field"><span>Email <small>required</small></span><input type="email" name="email" required maxLength={200} autoComplete="email" /></label>
      </div>
    </fieldset>

    {canSend ? <button className="round-button form-submit" disabled={sending}>{sending ? "Sending…" : "Send request"}<span className="css-arrow" aria-hidden="true" /></button> : <div className="form-pending"><strong>Online sending is opening soon.</strong><p>Download a complete copy of your request, including your reference file, while the AH Gifts company inbox is being prepared.</p></div>}
    <button type="button" className="button-secondary save-request" onClick={saveCopy}>Download request copy</button>
    <p className="form-status" aria-live="polite">{status}</p>
  </form>
}
