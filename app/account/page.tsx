import type { Metadata } from "next"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { GoogleSignIn } from "@/components/google-sign-in"

export const metadata: Metadata = { title: "My account", description: "Sign in to manage AH Gifts orders, custom specifications, and delivery updates." }

type Props = { searchParams?: { next?: string } }

function safeNext(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/account"
}

function AccountUnavailable() {
  return <section className="account-page"><div className="site-shell account-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div>
    <div className="account-config-state">
      <p className="eyebrow">AH Gifts account</p>
      <h1>We’re finishing the sign-in setup.</h1>
      <p>Shopping is ready. Account sign-in will be available as soon as the secure account connection is enabled for this production site.</p>
      <Link href="/gifts" className="round-button">Continue shopping <span className="css-arrow" aria-hidden="true" /></Link>
    </div>
  </div></section>
}

export default async function AccountPage({ searchParams }: Props) {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  if (!configured) return <AccountUnavailable />

  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const next = safeNext(searchParams?.next)

  if (!user) return <section className="account-page"><div className="site-shell account-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div>
    <div className="account-auth-layout">
      <div className="account-auth-intro">
        <p className="eyebrow">Your AH Gifts space</p>
        <h1>One simple place for every order.</h1>
        <p>Sign in to place custom card and 3D-printed gift orders, keep your design specifications, and see delivery updates when they are confirmed.</p>
        <div className="account-auth-benefits">
          <div><strong>Save specifications</strong><span>Keep your dimensions, quality, wording, and uploaded reference details together.</span></div>
          <div><strong>Reorder faster</strong><span>Bring back a previous order without rebuilding it from scratch.</span></div>
          <div><strong>Track delivery</strong><span>See confirmed delivery windows from your account.</span></div>
        </div>
      </div>
      <GoogleSignIn next={next} />
    </div>
  </div></section>

  const { data: orders } = await supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false })

  return <section className="account-page"><div className="site-shell account-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div>
    <div className="account-header"><div><p className="eyebrow">Signed in</p><h1>{user.user_metadata?.full_name || user.email}</h1><p>Your specifications, order history, and delivery updates.</p></div><form action="/api/auth/signout" method="post"><button className="button-secondary">Sign out</button></form></div>
    <section className="account-orders"><div className="section-heading"><div><p className="eyebrow">Your history</p><h2>Orders</h2></div><Link href="/gifts" className="round-button">Shop gifts <span className="css-arrow" aria-hidden="true" /></Link></div>{orders?.length ? <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}><div><p className="eyebrow">{order.order_number}</p><h3>{String(order.status || "pending").replaceAll("_", " ")}</h3><p>{Array.isArray(order.items) ? order.items.map((item: { productName?: string; name?: string }) => item.productName || item.name).filter(Boolean).join(", ") : "AH Gifts order"}</p></div><dl><div><dt>Total</dt><dd>{order.total_cents ? new Intl.NumberFormat("en-CA", { style: "currency", currency: order.currency || "CAD" }).format(order.total_cents / 100) : "To be confirmed"}</dd></div><div><dt>Delivery</dt><dd>{order.delivery_window_start ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" }).format(new Date(order.delivery_window_start)) : "To be scheduled"}</dd></div></dl><Link className="choice-link" href={`/gifts?reorder=${encodeURIComponent(order.id)}`}>Reorder this <i className="css-arrow" aria-hidden="true" /></Link></article>)}</div> : <div className="empty-state"><h3>No orders yet.</h3><p>Your confirmed AH Gifts orders will appear here.</p><Link href="/gifts" className="round-button">Browse the gift shop <span className="css-arrow" aria-hidden="true" /></Link></div>}</section>
  </div></section>
}
