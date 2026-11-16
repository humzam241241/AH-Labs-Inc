import Link from "next/link"

export default function LocationPage() {
  return <section className="info-page site-shell"><p className="eyebrow">Location</p><h1>Online first.<br />Based in Ontario.</h1><div className="location-panel"><div><p className="eyebrow">AH Labs Inc.</p><h2>Ontario, Canada</h2><p>AH Gifts is currently online-only. There is no public walk-in storefront. Pickup or delivery details are arranged directly after an order is confirmed.</p><Link href="/contact" className="round-button">Contact us <span className="css-arrow" /></Link></div><div className="map-placeholder"><span>ONTARIO</span><small>Public address coming later</small></div></div></section>
}
