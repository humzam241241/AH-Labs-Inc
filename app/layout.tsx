import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://ah-labs-inc.vercel.app"),
  title: { default: "AH Labs Inc. | Ideas, made real.", template: "%s | AH Labs Inc." },
  description: "AH Labs Inc. builds thoughtful products, robotics, and emerging technology through distinct ventures including AH Gifts and AH Drones.",
  openGraph: { title: "AH Labs Inc. | Ideas, made real.", description: "A home for thoughtful products, new technologies, and the businesses we're building next.", type: "website" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar /><main>{children}</main><Footer /></body></html>
}
