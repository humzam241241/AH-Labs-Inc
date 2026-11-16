import Link from "next/link"

const products = [
  { kind: "Greeting card", name: "The Birthday Note", description: "A refined card for another trip around the sun.", price: "$6.50 CAD", art: "happy birthday.", tone: "sand" },
  { kind: "Greeting card", name: "A Little Thank You", description: "A personal note for someone who showed up.", price: "$6.50 CAD", art: "thank you.", tone: "sage" },
  { kind: "Personalized object", name: "Custom Initial Keychain", description: "A small everyday piece with a personal touch.", price: "$12.00 CAD", art: "AH", tone: "stone" },
  { kind: "Personalized object", name: "Personal Desk Nameplate", description: "An understated custom desk accessory.", price: "$22.00 CAD", art: "YOUR NAME", tone: "blue" },
  { kind: "Greeting card", name: "The Anniversary Card", description: "For another year of stories together.", price: "$6.50 CAD", art: "always you.", tone: "rose" },
  { kind: "Personalized bundle", name: "Card + Keepsake Set", description: "A greeting card paired with an initial keepsake.", price: "$17.00 CAD", art: "for you.  AH", tone: "cream" },
]

export default function GiftsPage() {
  return <>
    <section className="gifts-hero"><div className="site-shell"><p className="eyebrow">AH Labs presents</p><h1>AH Gifts.</h1><p className="script-line">A little more personal.</p><p className="hero-copy">Thoughtful greeting cards and personalized objects, made for the people and moments that matter.</p><a className="round-button" href="#collection">Explore the collection <span aria-hidden="true">↗</span></a><div className="mini-cards" aria-hidden="true"><i>just because.</i><i>for you.</i></div></div></section>
    <section className="gift-shop site-shell" id="collection"><div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Small things.<br />Real meaning.</h2></div><p>Made to order · Prices in CAD</p></div><div className="product-grid">{products.map((product) => <article className="product-card" key={product.name}><div className={`product-art ${product.tone}`}><span>{product.art}</span></div><div className="product-copy"><p className="product-kind">{product.kind}</p><h3>{product.name}</h3><p>{product.description}</p><strong>{product.price}</strong></div></article>)}</div><p className="catalog-note">Concept collection and example prices. Online ordering is not yet enabled.</p></section>
    <section className="contact-band gifts"><div className="site-shell"><div><p className="eyebrow">Made for someone</p><h2>Ask about a custom piece.</h2></div><Link href="/contact" className="round-button light">Start an inquiry <span aria-hidden="true">↗</span></Link></div></section>
  </>
}
