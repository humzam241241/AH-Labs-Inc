export default function Loading() {
  return <main className="skeleton-page" aria-busy="true" aria-label="Loading page preview">
    <section className="skeleton-hero site-shell">
      <div className="skeleton-line short" />
      <div className="skeleton-line title" />
      <div className="skeleton-line title second" />
      <div className="skeleton-line copy" />
      <div className="skeleton-button" />
    </section>
    <section className="skeleton-grid site-shell">
      {[0, 1, 2, 3, 4, 5].map(item => <div className="skeleton-card" key={item}><div className="skeleton-image" /><div className="skeleton-card-copy"><div className="skeleton-line medium" /><div className="skeleton-line copy" /></div></div>)}
    </section>
  </main>
}
