import Link from "next/link"

export function Footer() {
  return <footer className="site-footer"><div className="site-shell footer-grid"><div><Link href="/" className="wordmark light-mark">AH <span>Labs.</span></Link><p>A Canadian company building thoughtful products and practical technology.</p></div><div><p className="footer-label">Ventures</p><Link href="/gifts">AH Gifts</Link><Link href="/projects/autonomous-lidar-mapping-drone">AH Drones</Link></div><div><p className="footer-label">Company</p><Link href="/#about">About</Link><Link href="/founder">Founder</Link><Link href="/careers">Careers</Link><Link href="/contact">Contact</Link></div></div><div className="site-shell footer-bottom"><span>© 2026 AH Labs Inc. All rights reserved.</span><span>Ideas, made real.</span></div></footer>
}
