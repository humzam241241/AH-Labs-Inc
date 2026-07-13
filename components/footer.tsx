import Link from "next/link"
import { navItems } from "./design-system"

export function Footer() {
  return <footer className="border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]"><div className="site-shell grid gap-10 py-12 md:grid-cols-[1fr_420px]"><div><p className="label text-[#cfc8bb]">AH Labs Inc.</p><p className="mt-4 max-w-xl text-2xl leading-9 tracking-[-0.03em]">Engineering studio developing robotic systems, embedded electronics, mechanical systems, and autonomous platforms.</p></div><div className="grid grid-cols-2 gap-6 text-sm"><div><p className="label text-[#cfc8bb]">Navigate</p><div className="mt-4 grid gap-3">{navItems.map((item) => <Link key={item.href} href={item.href} className="text-[#e8e1d4] hover:text-white">{item.label}</Link>)}</div></div><div><p className="label text-[#cfc8bb]">Inquiries</p><p className="mt-4 text-[#e8e1d4]">Engineering collaboration, research collaboration, internship interest, and general inquiries.</p></div></div></div></footer>
}
