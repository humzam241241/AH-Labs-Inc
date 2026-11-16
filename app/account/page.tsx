import type { Metadata } from "next"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { GoogleSignIn } from "@/components/google-sign-in"

export const metadata: Metadata = { title: "My account", description: "View AH Gifts orders, reorder items, and track delivery estimates." }

export default async function AccountPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <section className="account-page"><div className="site-shell account-shell"><div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div><GoogleSignIn /></div></section>
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
  return <section className="account-page"><div className="site-shell account-shell"><div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div><div className="account-header"><div><p className="eyebrow">Signed in</p><h1>{user.user_metadata?.full_name || user.email}</h1><p>Your order history and delivery updates.</p></div><form action="/api/auth/signout" method="post"><button className="button-secondary">Sign out</button></form></div><section className="account-orders"><div className="section-heading"><div><p className="eyebrow">Your history</p><h2>Orders</h2></div><Link href="/gifts" className="round-button">Shop gifts <span className="css-arrow" aria-hidden="true" /></Link></div>{orders?.length ? <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}><div><p className="eyebrow">{order.order_number}</p><h3>{order.status.replaceAll("_", " ")}</h3><p>{Array.isArray(order.items) ? order.items.map((item: { name?: string }) => item.name).filter(Boolean).join(", ") : "AH Gifts order"}</p></div><dl><div><dt>Total</dt><dd>{new Intl.NumberFormat("en-CA", { style: "currency", currency: order.currency || "CAD" }).format((order.total_cents || 0) / 100)}</dd></div><div><dt>Delivery</dt><dd>{order.delivery_window_start ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" }).format(new Date(order.delivery_window_start)) : "To be scheduled"}</dd></div></dl><Link className="choice-link" href={`/gifts?reorder=${encodeURIComponent(order.id)}`}>Reorder this <i className="css-arrow" aria-hidden="true" /></Link></article>)}</div> : <div className="empty-state"><h3>No orders yet.</h3><p>Your confirmed AH Gifts orders will appear here.</p><Link href="/gifts" className="round-button">Browse the gift shop <span className="css-arrow" aria-hidden="true" /></Link></div>}</section></div></section>
}
