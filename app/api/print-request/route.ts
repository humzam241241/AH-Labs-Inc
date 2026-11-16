import { NextResponse } from "next/server"
import { printedGifts, customPrintSlug } from "@/lib/printed-gifts"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 3 * 1024 * 1024
const ACCEPTED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"])
const productSlugs = new Set([...printedGifts.map((gift) => gift.slug), customPrintSlug])

function text(data: FormData, key: string, max: number, required = false) {
  const value = String(data.get(key) ?? "").trim()
  if ((required && !value) || value.length > max) throw new Error(`Check the ${key} field.`)
  return value
}

function isRecognizedFile(bytes: Uint8Array, type: string) {
  if (type === "application/pdf") return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  return false
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.PRINT_REQUEST_FROM || !process.env.PRINT_REQUEST_TO) {
    return NextResponse.json({ message: "Online sending is not available yet." }, { status: 503 })
  }

  try {
    const data = await request.formData()
    if (text(data, "website", 200)) return NextResponse.json({ message: "Request received." })
    const product = text(data, "product", 60, true)
    if (!productSlugs.has(product)) throw new Error("Choose a valid product.")
    const customerName = text(data, "customerName", 100, true)
    const email = text(data, "email", 200, true)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.")
    const designOption = text(data, "designOption", 200, true)
    const sizeOption = text(data, "sizeOption", 200, true)
    const customSize = text(data, "customSize", 120)
    const personalization = text(data, "personalization", 80)
    const colour = text(data, "colour", 80)
    const details = text(data, "details", 1500, true)
    const file = data.get("reference") as File | null
    const attachments: Array<{ filename: string; content: string }> = []

    if (file && file.size) {
      if (file.size > MAX_FILE_SIZE || !ACCEPTED_TYPES.has(file.type)) throw new Error("The reference must be a PDF, PNG, or JPEG no larger than 3 MB.")
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (!isRecognizedFile(bytes, file.type)) throw new Error("The reference file does not match its file type.")
      attachments.push({ filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "-"), content: Buffer.from(bytes).toString("base64") })
    }

    const productName = printedGifts.find((gift) => gift.slug === product)?.name ?? "Custom 3D design"
    const body = [
      `Product: ${productName}`,
      `Design option: ${designOption}`,
      `Size option: ${sizeOption}`,
      `Requested dimensions: ${customSize || "Not provided"}`,
      `Name or text: ${personalization || "Not provided"}`,
      `Colour preference: ${colour || "Not provided"}`,
      "",
      "Idea and details:",
      details,
      "",
      `Customer: ${customerName}`,
      `Email: ${email}`,
    ].join("\n")

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.PRINT_REQUEST_FROM,
        to: [process.env.PRINT_REQUEST_TO],
        reply_to: email,
        subject: `3D gift request — ${productName} — ${customerName}`,
        text: body,
        attachments,
      }),
    })
    if (!response.ok) throw new Error("The request could not be delivered.")
    return NextResponse.json({ message: "Request sent." })
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Check the request and try again." }, { status: 400 })
  }
}
