import Link from "next/link"
import { ReactNode } from "react"

export const navItems = [
  { href: "/", label: "Studio" },
  { href: "/projects", label: "Projects" },
  { href: "/founder", label: "Founder" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
]

export function SectionIntro({ index, eyebrow, title, children }: { index: string; eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-grid"><aside><p className="kicker">{index}</p><p className="label mt-3">{eyebrow}</p></aside><div><h2 className="h2 max-w-4xl">{title}</h2>{children && <div className="mt-6 max-w-3xl body-copy">{children}</div>}</div></div>
}

export function MediaPlaceholder({ label, note }: { label: string; note?: string }) {
  return <div className="placeholder"><div className="relative z-10 max-w-xs text-center"><p className="label text-[var(--ink)]">{label}</p>{note && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{note}</p>}</div></div>
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="border-b border-[var(--accent)] text-[var(--accent-dark)] transition-colors hover:text-[var(--ink)]">{children}</Link>
}
