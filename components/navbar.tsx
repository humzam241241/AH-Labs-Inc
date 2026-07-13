"use client"

import Link from "next/link"
import { useState } from "react"
import { navItems } from "./design-system"

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(244,241,234,.94)] backdrop-blur">
      <div className="site-shell flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-[-0.03em]">AH Labs Inc.</Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{item.label}</Link>)}
        </nav>
        <button className="border border-[var(--line-strong)] px-3 py-2 text-sm md:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </div>
      {open && <nav id="mobile-menu" className="border-t border-[var(--line)] bg-[var(--surface)] md:hidden" aria-label="Mobile navigation"><div className="site-shell grid py-3">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-[var(--line)] py-4 text-lg">{item.label}</Link>)}</div></nav>}
    </header>
  )
}
