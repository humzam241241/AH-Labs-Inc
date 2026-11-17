import Link from "next/link"
import { redirect } from "next/navigation"
import { requireMasterAccount } from "@/lib/account-access"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AccountDecision, PaymentConfirmation } from "@/components/master-actions"
import { CatalogEditor } from "@/components/catalog-editor"
import { OrderEditor } from "@/components/order-editor"
import { syncAuthUsersToProfiles } from "@/lib/account-access"

export const dynamic = "force-dynamic"

const money = (cents: number | null, currency = "CAD") => cents == null ? "—" : new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(cents / 100)

export default async function MasterPage() {
  const access = await requireMasterAccount()
  if ("error" in access) redirect("/account")
  const supabase = createSupabaseServerClient()
  await syncAuthUsersToProfiles()
  const [{ data: customers }, { data: orders }, { data: invoices }, { data: rewards }, { data: catalogItems }] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name, status, created_at").eq("role", "customer").order("created_at", { ascending: false }),
    supabase.from("orders").select("id, customer_id, order_number, status, items, total_cents, currency, paid_at, delivery_window_start, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("invoices").select("id, invoice_number, customer_id, total_cents, currency, status, paid_at, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("loyalty_accounts").select("customer_id, points_balance"),
    supabase.from("catalog_items").select("id, item_key, item_type, category_slug, product_slug, design_number, name, base_price_cents, markup_percent, price_cents, active").order("item_type").order("category_slug").order("design_number").order("name"),
  ])
  const pending = customers?.filter((customer) => customer.status === "pending") ?? []
  const customerById = new Map((customers ?? []).map((customer) => [customer.id, customer]))
  const rewardsById = new Map((rewards ?? []).map((reward) => [reward.customer_id, reward.points_balance]))
  const collected = (invoices ?? []).filter((invoice) => invoice.status === "paid").reduce((total, invoice) => total + (invoice.total_cents || 0), 0)

  return <main className="master-page"><div className="site-shell master-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><Link href="/account">My account</Link><span>/</span><span>Master desk</span></div>
    <header className="master-header"><div><p className="eyebrow">Owner-only workspace</p><h1>AH Gifts master desk</h1><p>Approve customer applications, confirm Interac payments, issue invoices, and keep delivery orders in one place.</p></div><Link href="/account" className="button-secondary">My customer view</Link></header>
    <section className="master-metrics"><article><span>Applications</span><strong>{pending.length}</strong><small>waiting for approval</small></article><article><span>Customers</span><strong>{customers?.filter((customer) => customer.status === "approved").length || 0}</strong><small>approved accounts</small></article><article><span>Paid invoices</span><strong>{invoices?.filter((invoice) => invoice.status === "paid").length || 0}</strong><small>{money(collected)} collected</small></article></section>

    <CatalogEditor items={(catalogItems ?? []) as any} />

    <section className="master-section"><div className="section-heading"><div><p className="eyebrow">Account applications</p><h2>Approve before checkout</h2></div></div>{pending.length ? <div className="master-table">{pending.map((customer) => <article key={customer.id} className="master-row"><div><strong>{customer.full_name || "New applicant"}</strong><span>{customer.email || "No email supplied"}</span></div><span>Applied {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(customer.created_at))}</span><AccountDecision customerId={customer.id} currentStatus={customer.status} /></article>)}</div> : <div className="empty-state"><h3>Nothing waiting.</h3><p>New Google sign-ins will appear here as applications.</p></div>}</section>

    <section className="master-section"><div className="section-heading"><div><p className="eyebrow">Orders & payment</p><h2>Confirm e-Transfers</h2></div><p>Edit line items, specifications, and totals before confirming payment.</p></div>{orders?.length ? <div className="master-order-list">{orders.map((order) => { const customer = customerById.get(order.customer_id); return <article key={order.id} className="master-order-card"><div className="master-order-summary"><div><strong>{order.order_number}</strong><span>{customer?.full_name || customer?.email || "Customer"}</span></div><div><span>{order.delivery_window_start ? `Delivery: ${new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" }).format(new Date(order.delivery_window_start))}` : "Shipping / scheduling pending"}</span><small>Status: {order.status || "pending"} · Current total: {money(order.total_cents, order.currency || "CAD")}</small></div><PaymentConfirmation orderId={order.id} alreadyPaid={Boolean(order.paid_at)} /></div><OrderEditor orderId={order.id} orderNumber={order.order_number} status={order.status} items={order.items} totalCents={order.total_cents} currency={order.currency || "CAD"} paid={Boolean(order.paid_at)} /></article> })}</div> : <div className="empty-state"><h3>No orders yet.</h3><p>New approved-customer orders will show up here.</p></div>}</section>

    <section className="master-section"><div className="section-heading"><div><p className="eyebrow">Invoices & rewards</p><h2>Customer records</h2></div></div><div className="master-table">{(customers ?? []).map((customer) => <article key={customer.id} className="master-row"><div><strong>{customer.full_name || "Customer"}</strong><span>{customer.email}</span></div><span className={`status-chip ${customer.status}`}>{customer.status}</span><strong>{rewardsById.get(customer.id) || 0} points</strong></article>)}</div></section>
  </div></main>
}