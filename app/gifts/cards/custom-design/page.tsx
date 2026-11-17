import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Custom Card Design",
  description: "Work with AH Gifts on a custom card design built around your message, photo, colours, and occasion.",
}

export default function CustomCardDesignPage() {
  return <section className="inquiry-page custom-card-page">
    <div className="site-shell inquiry-shell">
      <div className="inquiry-intro custom-card-intro">
        <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Custom card design</span></div>
        <p className="eyebrow">Start with your idea</p>
        <h1>A card that sounds like you.</h1>
        <p className="inquiry-lede">Bring a message, photo, colour palette, or half-formed idea. We’ll help turn it into a card that feels personal.</p>
        <div className="custom-card-notes"><div><span>01</span><strong>Your occasion</strong><p>Who is it for, and what do you want it to feel like?</p></div><div><span>02</span><strong>Your words</strong><p>Share the exact message, names, dates, or inside joke.</p></div><div><span>03</span><strong>Your reference</strong><p>Attach a photo or describe the look you have in mind.</p></div></div>
        <Link href="/gifts/cards" className="text-action">Browse ready-made cards <span className="css-arrow" /></Link>
      </div>
      <ContactForm initialCategory="Custom order" />
    </div>
  </section>
}
