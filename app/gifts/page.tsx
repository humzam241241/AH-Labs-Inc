import Link from "next/link"

const cardCategories = [
  ["birthday", "Birthday cards", "For every age, personality, and kind of celebration."],
  ["anniversary", "Anniversary cards", "For partners, parents, and years worth celebrating."],
  ["wedding", "Wedding cards", "Thoughtful congratulations for the newlyweds."],
  ["graduation", "Graduation cards", "For diplomas, degrees, and what comes next."],
  ["thank-you", "Thank-you cards", "A personal way to show genuine appreciation."],
  ["new-baby", "New baby cards", "A warm welcome for a brand-new arrival."],
  ["congratulations", "Congratulations cards", "For promotions, new homes, and big wins."],
  ["get-well", "Get-well cards", "A caring note when someone needs it most."],
  ["sympathy", "Sympathy cards", "Simple, respectful support through difficult moments."],
  ["holiday", "Holiday cards", "Seasonal cards for family, friends, and customers."],
  ["just-because", "Just-because cards", "No occasion required—only someone worth thinking of."],
  ["custom-cards", "Custom cards", "Your wording, colours, photo, and idea brought together."],
]

const printedGifts = [
  ["Personalized nameplate", "A custom desk or bedroom nameplate."],
  ["Photo lithophane", "A favourite photo transformed into a light-up keepsake."],
  ["Initial keychain", "A compact name or initial keychain made to order."],
  ["Custom ornament", "A dated ornament for weddings, babies, or the holidays."],
  ["Mini figurine", "A small decorative character or themed collectible."],
  ["Ring dish", "A personalized tray for rings and everyday keepsakes."],
]

function ImageSlot({ label }: { label: string }) {
  return <div className="image-slot"><span>PNG / JPEG</span><p>{label}</p><small>Drop product image here</small></div>
}

export default function GiftsPage() {
  return <>
    <section className="gifts-hero"><div className="site-shell"><p className="eyebrow">AH Labs presents</p><h1>AH Gifts.</h1><p className="script-line">Made for their moment.</p><p className="hero-copy">Cards, custom pieces, and 3D-printed gifts made a little more personal.</p><a className="round-button" href="#cards">Browse gifts <span className="css-arrow" aria-hidden="true" /></a></div></section>

    <section className="gift-shop site-shell" id="cards"><div className="section-heading"><div><p className="eyebrow">Cards for every occasion</p><h2>Say it your way.</h2></div><p>Personalization available</p></div><div className="category-grid">{cardCategories.map(([id, name, description]) => <article className="category-card" id={id} key={id}><ImageSlot label={name} /><div><h3>{name}</h3><p>{description}</p><Link href="/contact">Ask about this card <span className="css-arrow" /></Link></div></article>)}</div></section>

    <section className="bulk-section" id="bulk-orders"><div className="site-shell bulk-grid"><div><p className="eyebrow">Bulk orders</p><h2>One thoughtful design.<br />Made for everyone.</h2><p>Order matching cards for events, teams, client gifts, holidays, invitations, or business thank-yous. Custom quantities, wording, and branding are available.</p><Link href="/contact" className="round-button">Request a bulk quote <span className="css-arrow" /></Link></div><ImageSlot label="Bulk card order" /></div></section>

    <section className="printed-section site-shell" id="3d-gifts"><div className="section-heading"><div><p className="eyebrow">3D-printed gifts</p><h2>Small objects.<br />Made just for them.</h2></div><p>Custom colours and names available</p></div><div className="product-grid">{printedGifts.map(([name, description]) => <article className="product-card" key={name}><ImageSlot label={name} /><div className="product-copy"><p className="product-kind">3D-printed gift</p><h3>{name}</h3><p>{description}</p><Link href="/contact">Customize it <span className="css-arrow" /></Link></div></article>)}</div></section>

    <section className="custom-gift-section"><div className="site-shell custom-gift-grid"><ImageSlot label="Your custom idea" /><div><p className="eyebrow">Custom orders</p><h2>Have something else in mind?</h2><p>Send a sketch, reference image, name, phrase, or rough idea. We can discuss a one-of-one card or 3D-printed gift made around it.</p><Link href="/contact" className="round-button">Start a custom order <span className="css-arrow" /></Link></div></div></section>
  </>
}
