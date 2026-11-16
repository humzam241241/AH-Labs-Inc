import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { cardCategories, cardImage } from "@/lib/card-catalog"

export const metadata: Metadata = {
  title: "Greeting Cards",
  description: "Browse greeting cards for birthdays, weddings, anniversaries, graduations, holidays, and more.",
}

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return <div className="card-feature-image"><Image src={src} alt={alt} fill sizes="(max-width: 850px) 100vw, 50vw" style={{ objectFit: "cover" }} /></div>
}

export default function CardsPage() {
  return <>
    <section className="gifts-hero"><div className="site-shell">
      <p className="eyebrow">AH Gifts · Paper goods</p><h1>Cards for<br />every moment.</h1>
      <p className="script-line">Say it your way.</p>
      <p className="hero-copy">Explore ten artwork options for every occasion, or make a design of your own.</p>
    </div></section>

    <section className="gift-shop site-shell" id="card-collection">
      <div className="section-heading"><div><p className="eyebrow">The card collection</p><h2>Find their kind<br />of card.</h2></div><p>18 collections · 10 designs each</p></div>
      <div className="category-grid">{cardCategories.map(({ slug, name, description }) => <Link className="category-card category-link" id={slug} href={`/gifts/cards/${slug}`} key={slug}>
        <div className="category-image"><Image src={cardImage(slug, 1)} alt="" fill sizes="(max-width: 540px) 100vw, (max-width: 1000px) 50vw, 33vw" style={{ objectFit: "cover" }} /></div>
        <div><h3>{name}</h3><p>{description}</p><span className="category-view">View 10 designs <span className="css-arrow" aria-hidden="true" /></span></div>
      </Link>)}</div>
    </section>

    <section className="custom-gift-section"><div className="site-shell custom-gift-grid">
      <FeatureImage src={cardImage("custom-cards", 1)} alt="Floral artwork for a custom card" />
      <div><p className="eyebrow">Custom card design</p><h2>Make a card that sounds like you.</h2><p>Choose the occasion, write your own message, and share a photo, colours, or a reference. We can work through the design with you.</p><Link href="/contact" className="round-button">Start a custom card <span className="css-arrow" aria-hidden="true" /></Link></div>
    </div></section>

    <section className="bulk-section" id="bulk-orders"><div className="site-shell bulk-grid">
      <div><p className="eyebrow">Cards for a crowd</p><h2>Bulk card orders.</h2><p>Need matching cards for a wedding, event, business, or holiday? Tell us the quantity, occasion, and custom wording to get started.</p><Link href="/contact" className="round-button">Ask about bulk orders <span className="css-arrow" aria-hidden="true" /></Link></div>
      <FeatureImage src={cardImage("wedding", 9)} alt="Wedding card artwork for a group order" />
    </div></section>
  </>
}
