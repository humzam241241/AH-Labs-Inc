const questions = [
  ["What payment methods do you accept?", "AH Gifts currently accepts Interac e-Transfer only."],
  ["Can I personalize a card?", "Yes. You can request custom wording, names, colours, photos, and other design details."],
  ["Do you offer bulk orders?", "Yes. Bulk cards are available for events, invitations, teams, holidays, clients, and other groups."],
  ["Can you make a custom 3D-printed gift?", "Yes. Send a reference image, sketch, name, phrase, or rough idea so we can review what is possible."],
  ["How long will my order take?", "Timing depends on the design, quantity, and current workload. You will receive an estimate before payment."],
  ["Do you ship orders?", "Delivery and pickup options are confirmed individually when your order is arranged."],
  ["Can I cancel a custom order?", "Contact us as soon as possible. Once design or production work has started, cancellation may not be possible."],
]

export default function FaqPage() {
  return <section className="info-page site-shell"><p className="eyebrow">Frequently asked questions</p><h1>Good questions.<br />Clear answers.</h1><div className="faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
}
