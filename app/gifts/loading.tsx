export default function GiftsLoading() {
  return <main className="skeleton-page gifts-skeleton" aria-busy="true" aria-label="Loading AH Gifts preview">
    <section className="skeleton-hero site-shell">
      <div className="skeleton-line short" />
      <div className="skeleton-line gift-title" />
      <div className="skeleton-line copy" />
      <div className="skeleton-button" />
    </section>
    <section className="skeleton-grid site-shell">
      {[0, 1, 2, 3, 4, 5].map(item => <div className="skeleton-card colourful" key={item}><div className="skeleton-image" /><div className="skeleton-card-copy"><div className="skeleton-line medium" /><div className="skeleton-line copy" /></div></div>)}
    </section>
  </main>
}
