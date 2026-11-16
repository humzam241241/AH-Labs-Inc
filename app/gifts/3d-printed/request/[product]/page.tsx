import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PrintRequestForm } from "@/components/print-request-form"
import { customPrintSlug, printedGifts } from "@/lib/printed-gifts"

type PageProps = { params: { product: string } }

export function generateMetadata({ params }: PageProps): Metadata {
  const gift = printedGifts.find((item) => item.slug === params.product)
  return { title: gift ? `Request a ${gift.name}` : params.product === customPrintSlug ? "Request a Custom 3D Design" : "3D Gift Request" }
}

export function generateStaticParams() {
  return [...printedGifts.map((gift) => ({ product: gift.slug })), { product: customPrintSlug }]
}

export default function PrintRequestPage({ params }: PageProps) {
  const gift = printedGifts.find((item) => item.slug === params.product)
  const isCustom = params.product === customPrintSlug
  if (!gift && !isCustom) notFound()

  const canSend = Boolean(process.env.RESEND_API_KEY && process.env.PRINT_REQUEST_FROM && process.env.PRINT_REQUEST_TO)
  const product = gift ?? {
    slug: customPrintSlug,
    name: "Custom 3D design",
    description: "Share a sketch, file, or description for an item built around your idea.",
    standardSize: "Custom dimensions",
    standardDesign: "Your own concept",
  }

  return <section className="request-page"><div className="site-shell">
    <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><Link href="/gifts/3d-printed">3D-printed gifts</Link><span>/</span><span>Request</span></div>
    <div className="request-layout">
      <aside className="request-intro">
        <p className="eyebrow">Custom request</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <dl className="request-summary">
          <div><dt>Standard design</dt><dd>{product.standardDesign}</dd></div>
          <div><dt>Starting size</dt><dd>{product.standardSize}</dd></div>
        </dl>
        <p className="request-note">Standard sizes are starting points. Your request is reviewed before price, dimensions, and production are confirmed.</p>
      </aside>
      <PrintRequestForm product={product} canSend={canSend} />
    </div>
  </div></section>
}
