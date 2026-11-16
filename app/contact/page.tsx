import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { inquiryCategories } from "@/lib/content"

export const metadata: Metadata = { title: "Contact Us", description: "Contact AH Labs Inc. about cards, bulk orders, 3D-printed gifts, custom orders, or general questions.", openGraph: { title: "Contact Us | AH Labs Inc.", description: "Contact AH Labs Inc." } }

export default function ContactPage() {
  return <section className="site-shell grid gap-12 py-16 lg:grid-cols-[1fr_520px] lg:py-24"><div><p className="kicker">Contact us</p><h1 className="h1 mt-8">What can we make for you?</h1><p className="lede mt-8">Ask about a card, bulk order, 3D-printed gift, custom idea, or anything else from AH Labs.</p><div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">{inquiryCategories.map((category) => <p key={category} className="py-4 text-xl tracking-[-0.03em]">{category}</p>)}</div></div><ContactForm /></section>
}
