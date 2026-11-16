"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/", label: "Company" },
  { href: "/#ventures", label: "Ventures" },
  { href: "/gifts", label: "AH Gifts" },
  { href: "/drones", label: "AH Drones" },
  { href: "/contact", label: "Contact" },
]

const cardLinks = [
  ["Birthday cards", "birthday"], ["Anniversary cards", "anniversary"],
  ["Wedding cards", "wedding"], ["Graduation cards", "graduation"],
  ["Thank-you cards", "thank-you"], ["New baby cards", "new-baby"],
  ["Congratulations cards", "congratulations"], ["Get-well cards", "get-well"],
  ["Sympathy cards", "sympathy"], ["Holiday cards", "holiday"],
  ["Just-because cards", "just-because"], ["Custom cards", "custom-cards"],
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return <header className="site-header"><div className="site-shell nav-shell"><Link href="/" className="wordmark" onClick={() => setOpen(false)}>AH <span>Labs.</span></Link><nav className="desktop-nav" aria-label="Primary navigation"><Link href="/" className={pathname === "/" ? "active" : ""}>Company</Link><Link href="/#ventures">Ventures</Link><div className="nav-dropdown"><Link href="/gifts" className={pathname === "/gifts" ? "active" : ""}>Cards</Link><div className="nav-dropdown-menu">{cardLinks.map(([label, id]) => <Link key={id} href={`/gifts#${id}`}>{label}</Link>)}</div></div><Link href="/gifts#bulk-orders">Bulk</Link><Link href="/gifts#3d-gifts">3D gifts</Link><Link href="/drones" className={pathname === "/drones" ? "active" : ""}>Drones</Link><div className="nav-dropdown"><Link href="/contact">Help</Link><div className="nav-dropdown-menu help-menu"><Link href="/contact">Contact us</Link><Link href="/payments">Payment questions</Link><Link href="/faq">Frequently asked questions</Link><Link href="/location">Location</Link></div></div></nav><button className="menu-button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button></div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation"><div className="site-shell">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span className="css-arrow" /></Link>)}<p className="mobile-nav-label">Cards</p>{cardLinks.map(([label, id]) => <Link className="mobile-card-link" key={id} href={`/gifts#${id}`} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/gifts#bulk-orders" onClick={() => setOpen(false)}>Bulk orders<span className="css-arrow" /></Link><Link href="/gifts#3d-gifts" onClick={() => setOpen(false)}>3D gifts<span className="css-arrow" /></Link><p className="mobile-nav-label">Help</p><Link href="/payments" onClick={() => setOpen(false)}>Payment questions</Link><Link href="/faq" onClick={() => setOpen(false)}>Frequently asked questions</Link><Link href="/location" onClick={() => setOpen(false)}>Location</Link></div></nav>}</header>
}
