import Link from "next/link"

export function Footer() {
  return <footer className="site-footer"><div className="site-shell footer-grid">
    <div><Link href="/" className="wordmark light-mark">AH <span>Labs.</span></Link><p>A Canadian company building thoughtful products and practical technology.</p></div>
    <div><p className="footer-label">Shop</p><Link href="/gifts">Gift shop</Link><Link href="/gifts/cards">Greeting cards</Link><Link href="/gifts/cards#bulk-orders">Bulk orders</Link><Link href="/gifts/3d-printed">3D-printed gifts</Link></div>
    <div><p className="footer-label">Help</p><Link href="/contact">Contact us</Link><Link href="/payments">Payment questions</Link><Link href="/faq">FAQ</Link><Link href="/gifts/delivery">Delivery request</Link><Link href="/location">Location</Link></div>
  </div><div className="site-shell footer-bottom"><span>© 2026 AH Labs Inc. All rights reserved.</span><span>Ideas, made real.</span></div></footer>
}
