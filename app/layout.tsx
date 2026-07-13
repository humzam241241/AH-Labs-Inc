import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"


export const metadata: Metadata = {
  metadataBase: new URL("https://ahlabs.com"),
  title: { default: "AH Labs Inc. | Engineering Studio", template: "%s | AH Labs Inc." },
  description: "AH Labs Inc. is an early-stage engineering studio developing robotic systems, embedded electronics, mechanical systems, and autonomous platforms.",
  openGraph: { title: "AH Labs Inc. | Engineering Studio", description: "Early-stage engineering studio for robotics, embedded electronics, mechanical systems, and autonomous platforms.", type: "website" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar /><main>{children}</main><Footer /></body></html>
}
