export default function CardCategoryLoading() {
  return <main className="skeleton-page card-category-skeleton" aria-busy="true" aria-label="Loading card designs">
    <section className="skeleton-hero site-shell">
      <div className="skeleton-line short" />
      <div className="skeleton-line gift-title" />
      <div className="skeleton-line copy" />
    </section>
    <section className="card-design-grid site-shell">
      {Array.from({ length: 10 }, (_, index) => <div className="card-design-card" key={index}>
        <div className="skeleton-image" />
        <div className="card-design-copy"><div className="skeleton-line medium" /><div className="skeleton-line copy" /></div>
      </div>)}
    </section>
  </main>
}
