import type { Metadata } from "next"
import Link from "next/link"
import { DeliveryRequest } from "@/components/delivery-request"

export const metadata: Metadata = {
  title: "Book a Delivery Time",
  description: "Book an available AH Gifts delivery window with travel time and calendar availability included.",
}

export default function DeliveryPage() {
  const smsNumber = process.env.DELIVERY_SMS_NUMBER ?? "+12893013738"
  const calendarReady = Boolean(process.env.DELIVERY_BOOKING_SCRIPT_URL && process.env.DELIVERY_BOOKING_SECRET)
  return <section className="delivery-page"><div className="site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>Delivery booking</span></div>
    <div className="delivery-layout">
      <div className="delivery-copy">
        <p className="eyebrow">{calendarReady ? "Live delivery calendar" : "Preferred delivery time"}</p>
        <h1>{calendarReady ? "Book a time that works." : "Choose a time that works."}</h1>
        <p>{calendarReady ? "Enter the delivery address to see real availability. Drive time from our Pickering starting point is included automatically." : "Prepare a text with your preferred date and time. Your delivery is scheduled only after AH Gifts replies and confirms the slot."}</p>
        {calendarReady ? <ol>
          <li><span>1</span><p><strong>Enter the delivery address</strong><small>We calculate the drive from Pickering.</small></p></li>
          <li><span>2</span><p><strong>Choose an open 30-minute window</strong><small>Busy calendar time and travel are already blocked.</small></p></li>
          <li><span>3</span><p><strong>Book it instantly</strong><small>The delivery is added to the AH Gifts calendar.</small></p></li>
        </ol> : <ol>
          <li><span>1</span><p><strong>Choose a preferred time</strong><small>Times are shown in Eastern Time.</small></p></li>
          <li><span>2</span><p><strong>Send the prepared text</strong><small>Your phone opens a message to AH Gifts.</small></p></li>
          <li><span>3</span><p><strong>Wait for confirmation</strong><small>The time is not booked until you receive a reply.</small></p></li>
        </ol>}
      </div>
      <DeliveryRequest smsNumber={smsNumber} calendarReady={calendarReady} />
    </div>
  </div></section>
}
