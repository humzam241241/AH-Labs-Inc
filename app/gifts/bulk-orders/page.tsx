import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Plan thoughtful card and gift orders for weddings, events, teams, and businesses with AH Gifts.",
}

export default function BulkOrdersPage() {
  return <section className="inquiry-page bulk-order-page">
    <div className="site-shell inquiry-shell">
      <div className="inquiry-intro bulk-intro">
        <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Bulk orders</span></div>
        <p className="eyebrow">For your whole group</p>
        <h1>One idea.<br />Many thoughtful pieces.</h1>
        <p className="inquiry-lede">Tell us what you’re planning and we’ll help shape the quantity, wording, artwork, and timing.</p>
        <ol className="inquiry-steps">
          <li><span>01</span><div><strong>Share the occasion</strong><small>Wedding, event, team, holiday, or customer thank-you.</small></div></li>
          <li><span>02</span><div><strong>Tell us the quantity</strong><small>We’ll confirm the best format and production approach.</small></div></li>
          <li><span>03</span><div><strong>Get a clear quote</strong><small>We’ll reply with the next step before anything is produced.</small></div></li>
        </ol>
        <Link href="/gifts/cards" className="text-action">Browse card collections <span className="css-arrow" /></Link>
      </div>
      <ContactForm initialCategory="Bulk order" />
    </div>
  </section>
}
