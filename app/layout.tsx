import type { Metadata } from "next"
import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChatbotWidget } from "@/components/chatbot-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AH Labs Inc - AI Automation & Autonomous Drones",
  description: "Building intelligent systems combining AI automation tools and autonomous drone systems for modern businesses.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatbotWidget />
        <Script
          src="https://chattybot-tawny.vercel.app/widget.js"
          data-site-id="4613a808-8c84-4cff-a9cf-1ec922b0e420"
          data-api-url="https://chattybot-0jvh.onrender.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
