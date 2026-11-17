import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { currentAccount } from "@/lib/account-access"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type Pricing = {
  subtotalCents?: number | null
  discountCents?: number | null
  taxCents?: number | null
  totalCents?: number | null
  promoCode?: string | null
  promoLabel?: string | null
}

type OrderItem = {
  productName?: string
  quantity?: number
  dimensions?: string
  sizeOption?: string
  quality?: string
  pricing?: Pricing
}

const money = (cents: number | null | undefined, currency = "CAD") => cents == null ? "Pending quote" : new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(cents / 100)

export default async function CheckoutConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const account = await currentAccount()
  if (!account.user) redirect(`/account?next=${encodeURIComponent(`/checkout/${params.orderNumber}`)}`)

  const supabase = createSupabaseServerClient()
  const { data: order } = await supabase
    .from("orders")
    .select("order_number, status, items, total_cents, currency, delivery_address, delivery_window_start, created_at")
    .eq("customer_id", account.user.id)
    .eq("order_number", params.orderNumber)
    .maybeSingle()
  if (!order) notFound()

  const item = (Array.isArray(order.items) ? order.items[0] : null) as OrderItem | null
  const pricing = item?.pricing ?? {}
  const interacEmail = process.env.NEXT_PUBLIC_INTERAC_EMAIL?.trim() || ""
  const fulfillment = order.delivery_address ? "Local delivery" : "Shipping"
  const deliveryTime = order.delivery_window_start
    ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", dateStyle: "full", timeStyle: "short" }).format(new Date(order.delivery_window_start))
    : null

  return <section className="checkout-confirmation-page site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><Link href="/account">My account</Link><span>/</span><span>{order.order_number}</span></div>
    <header className="checkout-confirmation-hero">
      <div className="checkout-success-mark" aria-hidden="true">✓</div>
      <p className="eyebrow">Order created</p>
      <h1>Your order number is ready.</h1>
      <p>Your specifications are saved to your account and visible in the AH Gifts master desk.</p>
      <strong className="checkout-order-number">{order.order_number}</strong>
    </header>

    <div className="checkout-confirmation-grid">
      <article className="checkout-receipt-card">
        <div className="checkout-receipt-heading"><div><p className="eyebrow">Order summary</p><h2>{item?.productName || "Custom AH Gifts order"}</h2></div><span>{order.status}</span></div>
        <dl className="checkout-order-details">
          <div><dt>Quantity</dt><dd>{item?.quantity || 1}</dd></div>
          {(item?.sizeOption || item?.dimensions) && <div><dt>Size</dt><dd>{item.sizeOption || item.dimensions}</dd></div>}
          {item?.quality && <div><dt>Quality</dt><dd>{item.quality}</dd></div>}
          <div><dt>Fulfillment</dt><dd>{fulfillment}</dd></div>
          {deliveryTime && <div><dt>Delivery window</dt><dd>{deliveryTime}</dd></div>}
        </dl>
        <div className="checkout-totals checkout-receipt-totals">
          <div><span>Subtotal</span><strong>{money(pricing.subtotalCents)}</strong></div>
          {!!pricing.discountCents && <div className="checkout-discount"><span>Promo {pricing.promoCode}</span><strong>−{money(pricing.discountCents)}</strong></div>}
          <div><span>HST (13%)</span><strong>{money(pricing.taxCents)}</strong></div>
          <div className="checkout-total"><span>Total</span><strong>{money(pricing.totalCents ?? order.total_cents, order.currency)}</strong></div>
        </div>
      </article>

      <aside className="checkout-payment-card">
        <p className="eyebrow">Interac e-Transfer</p>
        <h2>{interacEmail ? "Payment details" : "Payment email coming soon"}</h2>
        {interacEmail ? <>
          <p>Send the confirmed total to:</p>
          <strong className="checkout-payment-email">{interacEmail}</strong>
          <p>Include <b>{order.order_number}</b> in the e-Transfer message so the payment can be matched to your order.</p>
        </> : <>
          <p>Your order is safely saved. The AH Gifts business Interac email will be added later.</p>
          <div className="checkout-payment-pending"><span>For now</span><strong>Do not send payment yet.</strong><small>AH Gifts will confirm the final amount and payment address before production.</small></div>
        </>}
        <div className="checkout-confirmation-actions"><Link href="/account" className="round-button">View my orders <span className="css-arrow" /></Link><Link href="/gifts" className="button-secondary">Continue shopping</Link></div>
      </aside>
    </div>
  </section>
}
