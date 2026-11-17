import type { Metadata } from "next"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { GoogleSignIn } from "@/components/google-sign-in"
import { SignOutButton } from "@/components/sign-out-button"

export const metadata: Metadata = { title: "My account", description: "Manage AH Gifts orders, deliveries, invoices, rewards, and account benefits." }
export const dynamic = "force-dynamic"

type Props = { searchParams?: { next?: string; auth?: string } }
type Order = { id: string; order_number: string; status: string | null; items: unknown; total_cents: number | null; currency: string | null; delivery_window_start: string | null; created_at: string }
type Invoice = { id: string; invoice_number: string; status: string; total_cents: number; currency: string; paid_at: string | null; issued_at: string | null; created_at: string }
type Promo = { id: string; code: string; title: string; description: string | null; discount_label: string; expires_at: string | null; redeemed_at: string | null; active: boolean }

const terminalStatuses = new Set(["delivered", "completed", "cancelled", "refunded"])
function safeNext(value?: string) { return value && value.startsWith("/") && !value.startsWith("//") ? value : "/account" }
function money(cents: number | null, currency = "CAD") { return cents == null ? "Pending quote" : new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(cents / 100) }
function date(value: string | null, withTime = false) { return value ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", ...(withTime ? { timeStyle: "short" as const, timeZone: "America/Toronto" } : {}) }).format(new Date(value)) : "Not scheduled" }
function itemNames(items: unknown) { return Array.isArray(items) ? items.map((item) => item && typeof item === "object" ? (item as { productName?: string; name?: string }).productName || (item as { name?: string }).name : "").filter(Boolean).join(", ") || "Custom AH Gifts order" : "Custom AH Gifts order" }

function AccountUnavailable() {
  return <section className="account-page"><div className="site-shell account-shell"><div className="account-config-state"><p className="eyebrow">AH Gifts account</p><h1>Account sign-in is being enabled.</h1><p>The store is available, but this production project still needs its secure Supabase environment variables.</p><Link href="/gifts" className="round-button">Continue shopping <span className="css-arrow" aria-hidden="true" /></Link></div></div></section>
}

function OrderCard({ order, past = false }: { order: Order; past?: boolean }) {
  return <article className="dashboard-order-card"><div className="dashboard-order-top"><div><p className="eyebrow">{order.order_number}</p><h3>{itemNames(order.items)}</h3></div><span className={`status-chip ${terminalStatuses.has(String(order.status).toLowerCase()) ? "" : "approved"}`}>{String(order.status || "pending").replaceAll("_", " ")}</span></div><dl><div><dt>Placed</dt><dd>{date(order.created_at)}</dd></div><div><dt>Total</dt><dd>{money(order.total_cents, order.currency || "CAD")}</dd></div><div><dt>Delivery</dt><dd>{date(order.delivery_window_start, true)}</dd></div></dl><div className="dashboard-order-actions"><Link className="choice-link" href={`/gifts?reorder=${encodeURIComponent(order.id)}`}>{past ? "Order again" : "View specifications"} <i className="css-arrow" aria-hidden="true" /></Link></div></article>
}

export default async function AccountPage({ searchParams }: Props) {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  if (!configured) return <AccountUnavailable />
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <section className="account-page"><div className="site-shell account-shell"><div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div>{searchParams?.auth === "failed" && <p className="form-status" role="alert">Google sign-in did not finish. Please try again.</p>}{searchParams?.auth === "timeout" && <p className="form-status" role="status">You were signed out after 15 minutes without activity. Sign in again to continue.</p>}{searchParams?.auth === "new-session" && <p className="form-status" role="status">For security, this browser session needs a fresh sign-in.</p>}<div className="account-auth-layout"><div className="account-auth-intro"><p className="eyebrow">Your AH Gifts space</p><h1>Everything you order, together.</h1><p>Apply with Google to keep active orders, delivery dates, invoices, rewards, and future offers in one account.</p><div className="account-auth-benefits"><div><strong>Track every order</strong><span>See current work, scheduled deliveries, invoices, and past purchases.</span></div><div><strong>Earn points</strong><span>Receive one point for every paid Canadian dollar.</span></div><div><strong>Reorder quickly</strong><span>Reuse specifications from a previous personalized order.</span></div></div></div><GoogleSignIn next={safeNext(searchParams?.next)} /></div></div></section>

  const { data: profile } = await supabase.from("profiles").select("id, full_name, status, role").eq("id", user.id).maybeSingle()
  if (!profile || profile.status !== "approved") return <section className="account-page"><div className="site-shell account-shell"><div className="account-header"><div><p className="eyebrow">Account application</p><h1>{profile?.status === "rejected" ? "Application not approved" : "Application received."}</h1><p>{profile?.status === "rejected" ? "Contact AH Gifts if you believe this was a mistake." : "Your account is waiting for master approval. Ordering and your customer dashboard unlock once approved."}</p></div><SignOutButton /></div><div className="application-status"><span className={`status-chip ${profile?.status || "pending"}`}>{profile?.status || "pending"}</span><strong>{user.email}</strong><p>Signed in securely with Google. There is no separate AH Gifts password.</p></div></div></section>

  const [{ data: orderRows }, { data: invoiceRows }, { data: rewards }, { data: promoRows }] = await Promise.all([
    supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
    supabase.from("loyalty_accounts").select("points_balance").eq("customer_id", user.id).maybeSingle(),
    supabase.from("customer_promos").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
  ])
  const orders = (orderRows || []) as Order[]
  const invoices = (invoiceRows || []) as Invoice[]
  const promos = (promoRows || []) as Promo[]
  const now = Date.now()
  const activeOrders = orders.filter((order) => !terminalStatuses.has(String(order.status).toLowerCase()))
  const pastOrders = orders.filter((order) => terminalStatuses.has(String(order.status).toLowerCase()))
  const upcoming = activeOrders.filter((order) => order.delivery_window_start && new Date(order.delivery_window_start).getTime() > now)
  const availablePromos = promos.filter((promo) => promo.active && !promo.redeemed_at && (!promo.expires_at || new Date(promo.expires_at).getTime() > now))

  return <section className="account-page"><div className="site-shell account-shell dashboard-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>My account</span></div>
    <header className="dashboard-header"><div><p className="eyebrow">Approved member</p><h1>Welcome, {profile.full_name || user.user_metadata?.full_name || "friend"}.</h1><p>Track what is being made, what is arriving next, and everything you have earned.</p></div><div className="account-header-actions">{profile.role === "master" && <Link href="/master" className="button-secondary">Open master desk</Link>}<SignOutButton /></div></header>

    <section className="dashboard-metrics" aria-label="Account overview"><article><span>Active orders</span><strong>{activeOrders.length}</strong><small>{activeOrders.length ? "being prepared or awaiting payment" : "nothing in progress"}</small></article><article><span>Next delivery</span><strong className="metric-date">{upcoming[0] ? date(upcoming[0].delivery_window_start) : "None"}</strong><small>{upcoming[0] ? date(upcoming[0].delivery_window_start, true) : "no delivery scheduled"}</small></article><article><span>Reward points</span><strong>{rewards?.points_balance || 0}</strong><small>1 point per paid CAD dollar</small></article><article><span>Promo codes</span><strong>{availablePromos.length}</strong><small>available to use</small></article></section>

    <div className="dashboard-grid">
      <section className="dashboard-panel dashboard-panel-wide"><div className="dashboard-section-heading"><div><p className="eyebrow">In progress</p><h2>Current orders</h2></div><Link href="/gifts" className="round-button">Shop gifts <span className="css-arrow" aria-hidden="true" /></Link></div>{activeOrders.length ? <div className="dashboard-order-list">{activeOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <div className="dashboard-empty"><h3>No active orders.</h3><p>Your submitted and paid orders will be tracked here from request through delivery.</p><Link href="/gifts" className="choice-link">Browse the shop <i className="css-arrow" aria-hidden="true" /></Link></div>}</section>

      <section className="dashboard-panel"><p className="eyebrow">Next up</p><h2>Upcoming deliveries</h2>{upcoming.length ? <div className="delivery-timeline">{upcoming.map((order) => <article key={order.id}><strong>{date(order.delivery_window_start, true)}</strong><span>{order.order_number}</span><small>{itemNames(order.items)}</small></article>)}</div> : <div className="dashboard-empty compact"><h3>No delivery booked.</h3><p>Choose local delivery during checkout to reserve an available window.</p></div>}</section>

      <section className="dashboard-panel"><p className="eyebrow">Receipts</p><h2>Invoices</h2>{invoices.length ? <div className="dashboard-record-list">{invoices.map((invoice) => <article key={invoice.id}><div><strong>{invoice.invoice_number}</strong><small>{invoice.paid_at ? `Paid ${date(invoice.paid_at)}` : invoice.status}</small></div><span>{money(invoice.total_cents, invoice.currency)}</span></article>)}</div> : <div className="dashboard-empty compact"><h3>No invoices yet.</h3><p>An invoice appears after AH Gifts confirms your Interac payment.</p></div>}</section>

      <section className="dashboard-panel"><p className="eyebrow">Member benefits</p><h2>Promo codes</h2>{availablePromos.length ? <div className="promo-list">{availablePromos.map((promo) => <article key={promo.id}><span>{promo.discount_label}</span><strong>{promo.code}</strong><h3>{promo.title}</h3>{promo.description && <p>{promo.description}</p>}<small>{promo.expires_at ? `Expires ${date(promo.expires_at)}` : "No expiry date"}</small></article>)}</div> : <div className="dashboard-empty compact"><h3>No active codes.</h3><p>Personal offers and loyalty rewards will appear here automatically.</p></div>}</section>

      <section className="dashboard-panel"><p className="eyebrow">Security</p><h2>Login & password</h2><div className="account-security"><div className="google-mark" aria-hidden="true">G</div><div><strong>Signed in with Google</strong><p>{user.email}</p></div></div><p className="dashboard-note">AH Gifts does not store a separate password. Change your password or security settings through your Google account.</p></section>

      <section className="dashboard-panel dashboard-panel-wide"><p className="eyebrow">Your history</p><h2>Past orders</h2>{pastOrders.length ? <div className="dashboard-order-list">{pastOrders.map((order) => <OrderCard key={order.id} order={order} past />)}</div> : <div className="dashboard-empty compact"><h3>No completed orders yet.</h3><p>Delivered and completed purchases will stay here for quick reordering.</p></div>}</section>
    </div>
  </div></section>
}
