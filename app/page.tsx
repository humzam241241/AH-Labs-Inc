import Link from "next/link"

const principles = [
  ["01", "Curious by default", "We explore useful ideas across products, robotics, and emerging technology."],
  ["02", "Built to be real", "We move from concept to prototype, test what works, and improve from evidence."],
  ["03", "One company, many paths", "Each venture has its own focus while sharing the same standard for thoughtful execution."],
]

export default function Home() {
  return (
    <>
      <section className="home-hero site-shell">
        <p className="eyebrow">Independent ideas. One vision.</p>
        <h1>Ideas,<br />made real.</h1>
        <p className="hero-copy">A home for thoughtful products, new technologies, and the businesses we&apos;re building next.</p>
        <a className="round-button" href="#ventures">Explore our ventures <span className="css-arrow" aria-hidden="true" /></a>
      </section>

      <section className="venture-section site-shell" id="ventures">
        <div className="section-heading">
          <div><p className="eyebrow">Our ventures</p><h2>Different ideas.<br />Shared ambition.</h2></div>
          <p>Discover what we&apos;re working on.</p>
        </div>
        <div className="venture-grid">
          <article className="venture-card gift-card">
            <span className="status-pill">Now exploring</span>
            <h3>AH Gifts.</h3>
            <p>Cards, objects, and personalized pieces made to mean more.</p>
            <Link href="/gifts" className="venture-link">Discover AH Gifts <span className="css-arrow" aria-hidden="true" /></Link>
            <div className="gift-art" aria-hidden="true"><div className="paper-card">for you.</div><div className="gift-token">AH</div></div>
          </article>
          <article className="venture-card drone-card">
            <span className="status-pill">In development</span>
            <h3>AH Drones.</h3>
            <p>Robotics, autonomous systems, and the future of aerial technology.</p>
            <Link href="/projects/autonomous-lidar-mapping-drone" className="venture-link">Explore the project <span className="css-arrow" aria-hidden="true" /></Link>
            <div className="drone-art" aria-hidden="true"><i className="arm one" /><i className="arm two" /><i className="drone-core" /><i className="rotor r1" /><i className="rotor r2" /><i className="rotor r3" /><i className="rotor r4" /></div>
          </article>
        </div>
      </section>

      <section className="manifesto" id="about">
        <div className="site-shell">
          <p className="eyebrow">AH Labs Inc.</p>
          <h2>Built with curiosity.<br />Designed for what comes next.</h2>
          <p>One Canadian company bringing distinct ventures together through purposeful design, practical innovation, and a bias toward making.</p>
        </div>
      </section>

      <section className="principles site-shell">
        <div className="section-heading compact"><div><p className="eyebrow">How we work</p><h2>From an idea<br />to something useful.</h2></div></div>
        <div className="principle-grid">{principles.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="contact-band"><div className="site-shell"><div><p className="eyebrow">Start a conversation</p><h2>Have an idea worth building?</h2></div><Link href="/contact" className="round-button light">Contact AH Labs <span className="css-arrow" aria-hidden="true" /></Link></div></section>
    </>
  )
}
