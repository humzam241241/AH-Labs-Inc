import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SessionGuard } from "@/components/session-guard"

export const metadata: Metadata = {
  metadataBase: new URL("https://ahlabsinc.ca"),
  title: { default: "AH Gifts | AH Labs Inc.", template: "%s | AH Gifts" },
  description: "AH Gifts creates thoughtful cards, keepsakes, and custom gifts for meaningful moments.",
  openGraph: { title: "AH Labs Inc. | Ideas, made real.", description: "A home for thoughtful products, new technologies, and the businesses we're building next.", type: "website" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar /><SessionGuard /><main>{children}</main><Footer /></body></html>
}
