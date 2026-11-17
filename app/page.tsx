import Link from "next/link"

const principles = [
  ["01", "Thoughtful by default", "We start with the moment, the person, and the little details that make something feel personal."],
  ["02", "Made to be real", "We keep the process clear, practical, and focused on products you can actually use or give."],
  ["03", "Small details matter", "Every piece is designed to feel warm, useful, and worth keeping."],
]

export default function Home() {
  return (
    <>
      <section className="home-hero site-shell">
        <p className="eyebrow">Thoughtful things, made in Canada.</p>
        <h1>Ideas,<br />made personal.</h1>
        <p className="hero-copy">Cards, keepsakes, and custom gifts for the moments you want to remember.</p>
        <Link className="round-button" href="/gifts">Explore AH Gifts <span className="css-arrow" aria-hidden="true" /></Link>
      </section>

      <section className="venture-section site-shell single-venture-section" id="gifts">
        <div className="section-heading">
          <div><p className="eyebrow">AH Gifts</p><h2>A small shop<br />for meaningful moments.</h2></div>
          <p>Choose something ready-made or start with your own idea.</p>
        </div>
        <div className="venture-grid single-venture-grid">
          <article className="venture-card gift-card">
            <span className="status-pill">Shop now</span>
            <h3>Cards, objects, and personalized pieces.</h3>
            <p>Browse greeting cards, 3D-printed gifts, and custom design services in one warm, simple storefront.</p>
            <Link href="/gifts" className="venture-link">Enter AH Gifts <span className="css-arrow" aria-hidden="true" /></Link>
            <div className="gift-art" aria-hidden="true"><div className="paper-card">for you.</div><div className="gift-token">AH</div></div>
          </article>
        </div>
      </section>

      <section className="manifesto" id="about">
        <div className="site-shell">
          <p className="eyebrow">AH Labs Inc.</p>
          <h2>Made with care.<br />Designed for real moments.</h2>
          <p>AH Gifts is our home for personal products that are easy to choose, easy to customize, and simple to order.</p>
        </div>
      </section>

      <section className="principles site-shell">
        <div className="section-heading compact"><div><p className="eyebrow">The AH Gifts approach</p><h2>From an idea<br />to something useful.</h2></div></div>
        <div className="principle-grid">{principles.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="contact-band"><div className="site-shell"><div><p className="eyebrow">Start a conversation</p><h2>Have an idea worth making?</h2></div><Link href="/contact" className="round-button light">Contact AH Labs <span className="css-arrow" aria-hidden="true" /></Link></div></section>
    </>
  )
}
