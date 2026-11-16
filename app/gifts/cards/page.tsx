import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Greeting Cards",
  description: "Browse greeting cards for birthdays, weddings, anniversaries, graduations, holidays, and more.",
}

const cardCategories = [
  ["birthday", "Birthday cards", "For every age, personality, and kind of celebration."],
  ["anniversary", "Anniversary cards", "For partners, parents, and years worth celebrating."],
  ["wedding", "Wedding cards", "Thoughtful congratulations for the newlyweds."],
  ["engagement", "Engagement cards", "Celebrate the beginning of a new chapter."],
  ["graduation", "Graduation cards", "For diplomas, degrees, and what comes next."],
  ["thank-you", "Thank-you cards", "A personal way to show appreciation."],
  ["new-baby", "New baby cards", "A warm welcome for a brand-new arrival."],
  ["congratulations", "Congratulations cards", "For promotions, new homes, and big wins."],
  ["housewarming", "Housewarming cards", "A little something for their new place."],
  ["retirement", "Retirement cards", "Celebrate the next great adventure."],
  ["get-well", "Get-well cards", "A caring note when someone needs it most."],
  ["sympathy", "Sympathy cards", "Simple, respectful support through difficult moments."],
  ["holiday", "Holiday cards", "Seasonal cards for family, friends, and customers."],
  ["eid-ramadan", "Eid and Ramadan cards", "Warm wishes for meaningful moments together."],
  ["mothers-day", "Mother's Day cards", "A thoughtful note for someone who means a lot."],
  ["fathers-day", "Father's Day cards", "Celebrate the people who show up for you."],
  ["just-because", "Just-because cards", "No occasion required—only someone worth thinking of."],
  ["custom-cards", "Custom cards", "Your wording, colours, photo, and idea brought together."],
]

function ImageSlot({ label }: { label: string }) {
  return <div className="image-slot"><span>PNG / JPEG</span><p>{label}</p><small>Drop card image here</small></div>
}

export default function CardsPage() {
  return <>
    <section className="gifts-hero"><div className="site-shell">
      <p className="eyebrow">AH Gifts · Paper goods</p><h1>Cards for<br />every moment.</h1>
      <p className="script-line">Say it your way.</p>
      <p className="hero-copy">A good card gives your words somewhere to land. Find an occasion or make a design of your own.</p>
    </div></section>

    <section className="gift-shop site-shell" id="card-collection">
      <div className="section-heading"><div><p className="eyebrow">The card collection</p><h2>Find their kind<br />of card.</h2></div><p>Personal wording and colours available</p></div>
      <div className="category-grid">{cardCategories.map(([id, name, description]) => <article className="category-card" id={id} key={id}>
        <ImageSlot label={name} /><div><h3>{name}</h3><p>{description}</p><Link href={`/gifts/cards/${id}`}>View 10 designs <span className="css-arrow" aria-hidden="true" /></Link></div>
      </article>)}</div>
    </section>

    <section className="custom-gift-section"><div className="site-shell custom-gift-grid">
      <ImageSlot label="Your card design" />
      <div><p className="eyebrow">Custom card design</p><h2>Make a card that sounds like you.</h2><p>Choose the occasion, write your own message, and share a photo, colours, or a reference. We can work through the design with you.</p><Link href="/contact" className="round-button">Start a custom card <span className="css-arrow" aria-hidden="true" /></Link></div>
    </div></section>

    <section className="bulk-section" id="bulk-orders"><div className="site-shell bulk-grid">
      <div><p className="eyebrow">Cards for a crowd</p><h2>Bulk card orders.</h2><p>Need matching cards for a wedding, event, business, or holiday? Tell us the quantity, occasion, and custom wording to get started.</p><Link href="/contact" className="round-button">Ask about bulk orders <span className="css-arrow" aria-hidden="true" /></Link></div>
      <ImageSlot label="Your event cards" />
    </div></section>
  </>
}
