"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const cardLinks = [
  ["Birthday cards", "birthday"], ["Anniversary cards", "anniversary"],
  ["Wedding cards", "wedding"], ["Engagement cards", "engagement"],
  ["Graduation cards", "graduation"], ["Thank-you cards", "thank-you"],
  ["New baby cards", "new-baby"], ["Congratulations cards", "congratulations"],
  ["Housewarming cards", "housewarming"], ["Retirement cards", "retirement"],
  ["Get-well cards", "get-well"], ["Sympathy cards", "sympathy"],
  ["Holiday cards", "holiday"], ["Eid and Ramadan cards", "eid-ramadan"],
  ["Mother's Day cards", "mothers-day"], ["Father's Day cards", "fathers-day"],
  ["Just-because cards", "just-because"], ["Custom cards", "custom-cards"],
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return <header className="site-header">
    <div className="site-shell nav-shell">
      <Link href="/" className="wordmark" onClick={() => setOpen(false)}>AH <span>Labs.</span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/" className={pathname === "/" ? "active" : ""}>Company</Link>
        <Link href="/#ventures">Ventures</Link>
        <Link href="/gifts" className={pathname.startsWith("/gifts") ? "active" : ""}>Shop</Link>
        <div className="nav-dropdown">
          <Link href="/gifts/cards">Cards</Link>
          <div className="nav-dropdown-menu">{cardLinks.map(([label, id]) => <Link key={id} href={`/gifts/cards#${id}`}>{label}</Link>)}</div>
        </div>
        <Link href="/gifts/3d-printed">3D gifts</Link>
        <Link href="/gifts/cards#bulk-orders">Bulk orders</Link>
        <div className="nav-dropdown">
          <Link href="/contact">Help</Link>
          <div className="nav-dropdown-menu help-menu">
            <Link href="/contact">Contact us</Link>
            <Link href="/payments">Payment questions</Link>
            <Link href="/faq">Frequently asked questions</Link>
            <Link href="/location">Location</Link>
          </div>
        </div>
      </nav>
      <button className="menu-button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation"><div className="site-shell">
      <Link href="/" onClick={() => setOpen(false)}>Company<span className="css-arrow" /></Link>
      <Link href="/#ventures" onClick={() => setOpen(false)}>Ventures<span className="css-arrow" /></Link>
      <Link href="/gifts" onClick={() => setOpen(false)}>Gift shop<span className="css-arrow" /></Link>
      <p className="mobile-nav-label">Cards</p>
      <Link className="mobile-card-link" href="/gifts/cards" onClick={() => setOpen(false)}>Browse all cards</Link>
      {cardLinks.map(([label, id]) => <Link className="mobile-card-link" key={id} href={`/gifts/cards#${id}`} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/gifts/3d-printed" onClick={() => setOpen(false)}>3D-printed gifts<span className="css-arrow" /></Link>
      <Link href="/gifts/cards#bulk-orders" onClick={() => setOpen(false)}>Bulk orders<span className="css-arrow" /></Link>
      <p className="mobile-nav-label">Help</p>
      <Link href="/contact" onClick={() => setOpen(false)}>Contact us</Link>
      <Link href="/payments" onClick={() => setOpen(false)}>Payment questions</Link>
      <Link href="/faq" onClick={() => setOpen(false)}>Frequently asked questions</Link>
      <Link href="/location" onClick={() => setOpen(false)}>Location</Link>
    </div></nav>}
  </header>
}
