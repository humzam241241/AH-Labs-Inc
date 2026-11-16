import Link from "next/link"

export default function PaymentsPage() {
  return <section className="info-page site-shell"><p className="eyebrow">Payment questions</p><h1>Simple, direct payment.</h1><div className="info-card accent-yellow"><h2>How can I pay?</h2><p>AH Gifts currently accepts <strong>Interac e-Transfer only.</strong> Payment instructions are provided after your order details and total are confirmed.</p></div><div className="info-card"><h2>When do I pay?</h2><p>Custom and bulk orders begin after the final design, price, and payment have been confirmed.</p></div><div className="info-card"><h2>Can I pay by card or cash?</h2><p>Not at this time. Credit cards, debit cards, and cash are not currently accepted.</p></div><Link href="/contact" className="round-button">Ask a payment question <span className="css-arrow" /></Link></section>
}
