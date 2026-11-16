import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cardCategories, cardCode, cardImage, findCardCategory } from "@/lib/card-catalog"

type Props = { params: { category: string; design: string } }

export function generateStaticParams() {
  return cardCategories.flatMap(({ slug, designs }) =>
    designs.map((_, index) => ({ category: slug, design: String(index + 1).padStart(2, "0") }))
  )
}

function getSelection(params: Props["params"]) {
  const category = findCardCategory(params.category)
  const number = Number(params.design)
  if (!category || !/^\d{2}$/.test(params.design) || number < 1 || number > category.designs.length) return null
  return { category, number, title: category.designs[number - 1] }
}

export function generateMetadata({ params }: Props): Metadata {
  const selection = getSelection(params)
  return selection
    ? { title: `${selection.title} | ${selection.category.name}`, description: `View ${selection.title}, a ${selection.category.name.toLowerCase()} artwork preview from AH Gifts.` }
    : { title: "Card design" }
}

export default function CardDesignPage({ params }: Props) {
  const selection = getSelection(params)
  if (!selection) notFound()
  const { category, number, title } = selection
  const code = cardCode(category.slug, number)

  return <main className="site-shell card-detail-page">
    <nav className="card-breadcrumb" aria-label="Breadcrumb">
      <Link href="/gifts">AH Gifts</Link><span aria-hidden="true">/</span>
      <Link href="/gifts/cards">Cards</Link><span aria-hidden="true">/</span>
      <Link href={`/gifts/cards/${category.slug}`}>{category.name}</Link>
    </nav>
    <div className="card-detail-grid">
      <div className="card-detail-art"><Image src={cardImage(category.slug, number)} alt={`${title} artwork preview`} fill sizes="(max-width: 850px) 100vw, 50vw" style={{ objectFit: "contain" }} priority /></div>
      <div className="card-detail-copy">
        <p className="eyebrow">{category.name} · Design {String(number).padStart(2, "0")}</p>
        <h1>{title}</h1>
        <p>This artwork can be the starting point for a card with your own wording and details.</p>
        <div className="card-reference"><span>Design reference</span><strong>{code}</strong></div>
        <Link className="round-button" href="/contact">Ask about this design <i className="css-arrow" aria-hidden="true" /></Link>
        <Link className="card-back-link" href={`/gifts/cards/${category.slug}`}>← All {category.name.toLowerCase()}</Link>
        <p className="card-detail-note">Artwork preview only. Final layout and print details are confirmed when you inquire.</p>
      </div>
    </div>
  </main>
}
