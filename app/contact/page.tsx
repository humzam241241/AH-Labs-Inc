import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { inquiryCategories } from "@/lib/content"

export const metadata: Metadata = {
  title: "General Inquiry",
  description: "Send AH Labs Inc. a general question about AH Gifts, custom work, orders, or delivery.",
  openGraph: { title: "General Inquiry | AH Labs Inc.", description: "A direct line to AH Labs." },
}

export default function ContactPage() {
  return <section className="inquiry-page general-inquiry-page">
    <div className="site-shell inquiry-shell">
      <div className="inquiry-intro">
        <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>General inquiry</span></div>
        <p className="eyebrow">A direct line to AH Labs</p>
        <h1>Tell us what you’re thinking.</h1>
        <p className="inquiry-lede">Questions, ideas, order details, or something that doesn’t fit a category? Send it here and we’ll point it in the right direction.</p>
        <div className="inquiry-prompt"><span>Good for</span><strong>Questions before you buy, custom ideas, order help, and delivery follow-up.</strong></div>
        <div className="inquiry-links"><Link href="/gifts/cards/custom-design">Custom card design <span className="css-arrow" /></Link><Link href="/gifts/bulk-orders">Bulk orders <span className="css-arrow" /></Link><Link href="/gifts/3d-printed">3D-printed gifts <span className="css-arrow" /></Link></div>
      </div>
      <ContactForm />
    </div>
  </section>
}
