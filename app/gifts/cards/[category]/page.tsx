import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cardCategories, cardCode, cardImage, findCardCategory } from "@/lib/card-catalog"

type Props = { params: { category: string } }

export function generateStaticParams() {
  return cardCategories.map(({ slug }) => ({ category: slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const category = findCardCategory(params.category)
  return category
    ? { title: category.name, description: `Browse ten ${category.name.toLowerCase()} artwork options from AH Gifts.` }
    : { title: "Cards" }
}

export default function CardGalleryPage({ params }: Props) {
  const category = findCardCategory(params.category)
  if (!category) notFound()

  return <>
    <section className="card-gallery-hero"><div className="site-shell">
      <nav className="card-breadcrumb" aria-label="Breadcrumb">
        <Link href="/gifts">AH Gifts</Link><span aria-hidden="true">/</span>
        <Link href="/gifts/cards">Cards</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{category.name}</span>
      </nav>
      <p className="eyebrow">The card collection · 10 designs</p>
      <h1>{category.name}</h1>
      <p>{category.description} Choose a design to see the artwork up close. Personal wording can be added when the final card is prepared.</p>
    </div></section>

    <section className="site-shell card-gallery-section" aria-label={`${category.name} designs`}>
      <div className="card-design-grid">{category.designs.map((title, index) => {
        const number = index + 1
        const code = cardCode(category.slug, number)
        const href = `/gifts/cards/${category.slug}/${String(number).padStart(2, "0")}`
        return <article className="card-design-item" key={code}>
          <Link href={href} aria-label={`View ${title}, design ${number}`}>
            <div className="card-artwork"><Image src={cardImage(category.slug, number)} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 20vw" style={{ objectFit: "contain" }} /></div>
            <div className="card-design-caption"><span>{String(number).padStart(2, "0")} / 10</span><h2>{title}</h2><span className="card-view-action">View design <i className="css-arrow" aria-hidden="true" /></span></div>
          </Link>
        </article>
      })}</div>
      <p className="card-gallery-note">Artwork previews for browsing. Final print details and personalized wording are arranged with AH Gifts.</p>
    </section>

    <section className="card-gallery-custom" id="custom-design"><div className="site-shell card-gallery-custom-grid">
      <div><p className="eyebrow">Custom {category.name.toLowerCase()}</p><h2>Have your own idea?</h2><p>Start with a photo, colours, a message, or a sketch. We can make a card design around your moment.</p><Link href="/contact" className="round-button">Start a custom card <i className="css-arrow" aria-hidden="true" /></Link></div>
      <div className="card-custom-art"><Image src={cardImage(category.slug, 10)} alt={`Another ${category.name.toLowerCase()} artwork option`} fill sizes="(max-width: 850px) 100vw, 50vw" style={{ objectFit: "cover" }} /></div>
    </div></section>
  </>
}
