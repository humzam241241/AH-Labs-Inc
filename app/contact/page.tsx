import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { inquiryCategories } from "@/lib/content"

export const metadata: Metadata = { title: "Contact", description: "Contact AH Labs Inc. for engineering collaboration, research collaboration, internship interest, or general inquiries.", openGraph: { title: "Contact | AH Labs Inc.", description: "Route a grounded engineering inquiry to AH Labs Inc." } }

export default function ContactPage() {
  return <section className="site-shell grid gap-12 py-16 lg:grid-cols-[1fr_520px] lg:py-24"><div><p className="kicker">Contact</p><h1 className="h1 mt-8">Route a grounded engineering inquiry.</h1><p className="lede mt-8">Use this form for engineering collaboration, research collaboration, internship interest, or a general inquiry.</p><div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">{inquiryCategories.map((category) => <p key={category} className="py-4 text-xl tracking-[-0.03em]">{category}</p>)}</div></div><ContactForm /></section>
}
