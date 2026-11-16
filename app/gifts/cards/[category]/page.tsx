import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

const cardCategories: Record<string, { title: string; description: string; note: string }> = {
  birthday: { title: "Birthday cards", description: "A card for every age, personality, and kind of celebration.", note: "Choose a design, then make the message your own." },
  anniversary: { title: "Anniversary cards", description: "Celebrate the years, the little moments, and the life you share.", note: "Personal wording is available with every design." },
  wedding: { title: "Wedding cards", description: "Send warm congratulations to the newlyweds.", note: "Add names, a date, or a personal message." },
  engagement: { title: "Engagement cards", description: "Celebrate the beginning of a new chapter together.", note: "Choose a design and personalize the inside." },
  graduation: { title: "Graduation cards", description: "Celebrate diplomas, degrees, and everything that comes next.", note: "Personalize with a name, school, or year." },
  "thank-you": { title: "Thank-you cards", description: "A personal way to show your appreciation.", note: "Make the message as specific as the reason." },
  "new-baby": { title: "New baby cards", description: "A warm welcome for a brand-new arrival.", note: "Add the baby's name or a note for the family." },
  congratulations: { title: "Congratulations cards", description: "For promotions, new homes, big wins, and fresh starts.", note: "Tell us what you are celebrating." },
  housewarming: { title: "Housewarming cards", description: "A little something to celebrate their new place.", note: "Personalize the design for their home." },
  retirement: { title: "Retirement cards", description: "Celebrate a career well lived and the next great adventure.", note: "Add a personal note from family, friends, or colleagues." },
  "get-well": { title: "Get-well cards", description: "A caring note for someone who needs it most.", note: "Choose a gentle design and write your own message." },
  sympathy: { title: "Sympathy cards", description: "Simple, thoughtful words for difficult moments.", note: "Keep the design and message personal and respectful." },
  holiday: { title: "Holiday cards", description: "Seasonal greetings for family, friends, and customers.", note: "Ask about matching sets for your holiday list." },
  "eid-ramadan": { title: "Eid and Ramadan cards", description: "Warm wishes for meaningful moments together.", note: "Personalize with a name or a message for the occasion." },
  "mothers-day": { title: "Mother's Day cards", description: "A thoughtful note for someone who means a lot.", note: "Make it personal with your own words." },
  "fathers-day": { title: "Father's Day cards", description: "Celebrate the people who show up for you.", note: "Choose a design and add a message of your own." },
  "just-because": { title: "Just-because cards", description: "No occasion required—only someone worth thinking of.", note: "Pick a design and send a little surprise." },
  "custom-cards": { title: "Custom cards", description: "Start with your wording, colours, photo, or an idea.", note: "These designs are starting points for something personal." },
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = cardCategories[params.category]
  return {
    title: category ? category.title : "Cards",
    description: category ? category.description : "Browse greeting card designs from AH Gifts.",
  }
}

export default function CardCategoryPage({ params }: { params: { category: string } }) {
  const category = cardCategories[params.category]
  if (!category) notFound()

  const designs = Array.from({ length: 10 }, (_, index) => String(index + 1).padStart(2, "0"))

  return <>
    <section className="gifts-hero card-category-hero">
      <div className="site-shell">
        <p className="eyebrow"><Link href="/gifts/cards">AH Gifts · Cards</Link> · {category.title}</p>
        <h1>{category.title}</h1>
        <p className="hero-copy">{category.description}</p>
        <p className="card-category-note">{category.note}</p>
      </div>
    </section>

    <section className="gift-shop site-shell card-design-section" aria-labelledby="design-gallery-title">
      <div className="section-heading">
        <div><p className="eyebrow">The collection</p><h2 id="design-gallery-title">Choose a design.</h2></div>
        <p>10 designs · Custom wording available</p>
      </div>
      <div className="card-design-grid">
        {designs.map((number, index) => <article className="card-design-card" key={number}>
          <div className={\`card-design-art card-design-tone-\${(index % 6) + 1}\`} role="img" aria-label={\`\${category.title} design \${number} image placeholder\`}>
            <span className="card-design-badge">Design {number}</span>
            <div className="card-design-placeholder">
              <span className="card-design-icon" aria-hidden="true">✳</span>
              <p>{category.title.replace(" cards", "")}</p>
              <small>Drop PNG / JPEG here</small>
            </div>
          </div>
          <div className="card-design-copy">
            <h3>{category.title.replace(" cards", "")} design {number}</h3>
            <p>Personalize this card with your own message.</p>
            <Link href="/contact">Ask about this design <span className="css-arrow" aria-hidden="true" /></Link>
          </div>
        </article>)}
      </div>
      <p className="catalog-note">Design images will appear here as they are added to the collection.</p>
    </section>

    <section className="custom-gift-section card-custom-section" id="custom-card">
      <div className="site-shell custom-gift-grid">
        <div className="image-slot"><span>PNG / JPEG</span><p>Your custom card</p><small>Custom design image slot</small></div>
        <div>
          <p className="eyebrow">Custom {category.title.toLowerCase()}</p>
          <h2>Make one that feels like you.</h2>
          <p>Share your idea, wording, colours, photo, or reference. We can help shape a card around this occasion.</p>
          <Link href="/contact" className="round-button">Start a custom card <span className="css-arrow" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="bulk-section card-bulk-section" id="bulk-orders">
      <div className="site-shell bulk-grid">
        <div>
          <p className="eyebrow">Cards for a crowd</p>
          <h2>Need more than one?</h2>
          <p>Ask about matching cards for a wedding, event, team, holiday, or customer list. Share the quantity, occasion, and wording to get started.</p>
          <Link href="/contact" className="round-button">Ask about bulk orders <span className="css-arrow" aria-hidden="true" /></Link>
        </div>
        <div className="image-slot"><span>PNG / JPEG</span><p>Bulk {category.title.toLowerCase()}</p><small>Event card image slot</small></div>
      </div>
    </section>

    <section className="site-shell card-category-back"><Link href="/gifts/cards">← Back to all card occasions</Link></section>
  </>
}
