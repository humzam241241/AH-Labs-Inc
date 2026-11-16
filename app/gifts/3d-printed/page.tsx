import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "3D-Printed Gifts",
  description: "Explore personalized 3D-printed keepsakes, desk accessories, and custom gifts.",
}

const printedGifts = [
  ["nameplate", "Personalized nameplates", "A custom name for a desk, shelf, or bedroom door."],
  ["lithophane", "Photo lithophanes", "Turn a favourite photo into a glowing keepsake."],
  ["keychain", "Initial keychains", "A small everyday piece with a name, letter, or symbol."],
  ["ornament", "Custom ornaments", "Mark a wedding, new baby, holiday, or family tradition."],
  ["phone-stand", "Phone stands", "A handy stand with a colour or detail of your choice."],
  ["ring-dish", "Ring dishes", "A little place for rings and everyday keepsakes."],
  ["bookmark", "Bookmarks", "A light, personalized companion for their next read."],
  ["planter", "Mini planters", "A cheerful home for a small plant or desk succulent."],
  ["organizer", "Desk organizers", "Keep pens, clips, and small essentials close at hand."],
  ["cookie-cutter", "Custom cookie cutters", "A shape made for a celebration or special idea."],
  ["figurine", "Mini figurines", "Small decorative characters and themed collectibles."],
  ["photo-plaque", "Photo plaques", "A favourite picture prepared as a keepsake display."],
]

function ImageSlot({ label }: { label: string }) {
  return <div className="image-slot"><span>PNG / JPEG</span><p>{label}</p><small>Drop product image here</small></div>
}

export default function PrintedGiftsPage() {
  return <>
    <section className="gifts-hero"><div className="site-shell">
      <p className="eyebrow">AH Gifts · Made to order</p><h1>Little things,<br />made real.</h1>
      <p className="script-line">Give an idea a shape.</p>
      <p className="hero-copy">Personalized keepsakes and practical pieces in colours, names, and details chosen by you.</p>
    </div></section>

    <section className="printed-section site-shell" id="3d-gifts">
      <div className="section-heading"><div><p className="eyebrow">The 3D gift collection</p><h2>Made for their<br />everyday.</h2></div><p>Colour and personalization available</p></div>
      <div className="product-grid">{printedGifts.map(([id, name, description]) => <article className="product-card" key={id}>
        <ImageSlot label={name} /><div className="product-copy"><p className="product-kind">3D-printed gift</p><h3>{name}</h3><p>{description}</p><Link href="/contact">Ask about this gift <span className="css-arrow" aria-hidden="true" /></Link></div>
      </article>)}</div>
    </section>

    <section className="custom-gift-section"><div className="site-shell custom-gift-grid">
      <ImageSlot label="Your custom 3D design" />
      <div><p className="eyebrow">Custom 3D design</p><h2>Imagine it. Let&apos;s shape it.</h2><p>Share a sketch, a reference image, dimensions, or a rough idea. We can discuss a custom design made around your occasion or everyday use.</p><Link href="/contact" className="round-button">Start a custom design <span className="css-arrow" aria-hidden="true" /></Link></div>
    </div></section>
  </>
}
