import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  customPrintSlug,
  printedGiftImage,
  printedGifts,
  printRequestHref,
} from "@/lib/printed-gifts"

export const metadata: Metadata = {
  title: "Custom 3D-Printed Gifts",
  description: "Explore personalized 3D-printed gifts with standard starting sizes or request your own name, dimensions, and design.",
}

export default function PrintedGiftsPage() {
  return <>
    <section className="printed-hero">
      <div className="site-shell">
        <div className="card-breadcrumb"><Link href="/gifts">AH Gifts</Link><span>/</span><span>3D-printed gifts</span></div>
        <p className="eyebrow">Made around your idea</p>
        <h1>Custom 3D-printed gifts.</h1>
        <p>Start with one of our standard items, then choose a name, colour, custom size, or design of your own.</p>
        <div className="printed-hero-actions">
          <Link className="round-button" href="#3d-gifts">Browse gifts <span className="css-arrow" aria-hidden="true" /></Link>
          <Link className="text-action" href={printRequestHref(customPrintSlug)}>Request a custom design</Link>
        </div>
      </div>
    </section>

    <section id="3d-gifts" className="printed-catalogue site-shell">
      <div className="section-heading"><div><p className="eyebrow">Choose a starting point</p><h2>Personalized for you.</h2></div><p>Standard sizes make ordering easy. Custom dimensions are available.</p></div>
      <div className="printed-product-grid">
        {printedGifts.map((gift) => <article className="printed-product-card" key={gift.slug}>
          <Link className="printed-product-image" href={printRequestHref(gift.slug)} aria-label={`Customize ${gift.name}`}>
            <Image src={printedGiftImage(gift.slug)} alt={gift.imageAlt} fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
          </Link>
          <div className="printed-product-copy">
            <p className="product-kind">Made to order</p>
            <h2>{gift.name}</h2>
            <p>{gift.description}</p>
            <dl className="printed-specs">
              <div><dt>Standard item</dt><dd>{gift.standardDesign}</dd></div>
              <div><dt>Starting size</dt><dd>{gift.standardSize}</dd></div>
            </dl>
            <Link className="choice-link" href={printRequestHref(gift.slug)}>Customize this gift <i className="css-arrow" aria-hidden="true" /></Link>
          </div>
        </article>)}
      </div>
      <p className="catalogue-disclaimer">Images show design examples. Final colours, proportions, price, and print details are confirmed before production.</p>
    </section>

    <section className="printed-custom-band"><div className="site-shell printed-custom-grid">
      <div><p className="eyebrow">Your own design</p><h2>Have something else in mind?</h2></div>
      <div><p>Upload a sketch, PDF, or image and describe what you want. We can discuss custom names, dimensions, and a design made around your idea.</p><Link className="round-button" href={printRequestHref(customPrintSlug)}>Start a custom request <span className="css-arrow" aria-hidden="true" /></Link></div>
    </div></section>

    <section className="delivery-strip"><div className="site-shell"><div><p className="eyebrow">After your order is confirmed</p><h2>Request a delivery time.</h2></div><Link className="round-button light" href="/gifts/delivery">Choose a preferred time <span className="css-arrow" aria-hidden="true" /></Link></div></section>
  </>
}
