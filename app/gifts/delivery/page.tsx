import type { Metadata } from "next"
import Link from "next/link"
import { DeliveryRequest } from "@/components/delivery-request"

export const metadata: Metadata = {
  title: "Request a Delivery Time",
  description: "Choose a preferred AH Gifts delivery time and send it by text for confirmation.",
}

export default function DeliveryPage() {
  const smsNumber = process.env.DELIVERY_SMS_NUMBER ?? "+12893013738"
  return <section className="delivery-page"><div className="site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Delivery request</span></div>
    <div className="delivery-layout">
      <div className="delivery-copy">
        <p className="eyebrow">Preferred delivery time</p>
        <h1>Choose a time that works.</h1>
        <p>Prepare a text with your preferred date and time. Your delivery is scheduled only after AH Gifts replies and confirms the slot.</p>
        <ol>
          <li><span>1</span><p><strong>Choose a preferred time</strong><small>Times are shown in Eastern Time.</small></p></li>
          <li><span>2</span><p><strong>Send the prepared text</strong><small>Your phone opens a message to AH Gifts.</small></p></li>
          <li><span>3</span><p><strong>Wait for confirmation</strong><small>The time is not booked until you receive a reply.</small></p></li>
        </ol>
      </div>
      <DeliveryRequest smsNumber={smsNumber} />
    </div>
  </div></section>
}
