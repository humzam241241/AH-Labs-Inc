"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/", label: "Company" },
  { href: "/#ventures", label: "Ventures" },
  { href: "/gifts", label: "AH Gifts" },
  { href: "/projects/autonomous-lidar-mapping-drone", label: "AH Drones" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return <header className="site-header"><div className="site-shell nav-shell"><Link href="/" className="wordmark" onClick={() => setOpen(false)}>AH <span>Labs.</span></Link><nav className="desktop-nav" aria-label="Primary navigation">{links.map(link => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{link.label}</Link>)}</nav><button className="menu-button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button></div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation"><div className="site-shell">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></Link>)}</div></nav>}</header>
}
