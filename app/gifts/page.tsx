import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { cardImage } from "@/lib/card-catalog"
import { customPrintSlug, printedGiftImage, printRequestHref } from "@/lib/printed-gifts"

export const metadata: Metadata = {
  title: "Gift Shop",
  description: "Explore personalized greeting cards, custom design services, and colourful 3D-printed gifts from AH Gifts.",
}

function ImageSlot({ label }: { label: string }) {
  return <div className="image-slot"><span>PNG / JPEG</span><p>{label}</p><small>Product image goes here</small></div>
}

export default function GiftsPage() {
  return <>
    <section className="gifts-hero shop-home-hero"><div className="site-shell">
      <p className="eyebrow">Welcome to AH Gifts</p>
      <h1>A little more<br />personal.</h1>
      <p className="script-line">Made for their moment.</p>
      <p className="hero-copy">Choose a card, find a small gift, or bring us an idea to make your own.</p><div className="shop-quick-links"><Link className="round-button" href="/gifts/cards">Shop cards <span className="css-arrow" aria-hidden="true" /></Link><Link className="text-action" href="/gifts/3d-printed">Shop 3D gifts <span className="css-arrow" aria-hidden="true" /></Link></div>
    </div></section>

    <section className="gift-shop site-shell shop-choices">
      <div className="section-heading"><div><p className="eyebrow">Make it personal</p><h2>What are you<br />looking for?</h2></div><p>Thoughtful things, made with care.</p></div>
      <div className="gift-choice-grid">
        <Link href="/gifts/cards" className="gift-choice-card choice-cards">
          <div className="shop-card-art"><Image src={cardImage("birthday", 1)} alt="Watercolor wildflower greeting card artwork" fill sizes="(max-width: 850px) 100vw, 50vw" style={{ objectFit: "contain" }} /></div>
          <div><p className="product-kind">Cards for every occasion</p><h3>Gift cards</h3><p>Birthday, wedding, graduation, holidays, and all the little moments between.</p><span className="choice-link">Browse greeting cards <i className="css-arrow" aria-hidden="true" /></span></div>
        </Link>
        <Link href="/gifts/3d-printed" className="gift-choice-card choice-printed">
          <div className="shop-card-art printed-shop-art"><Image src={printedGiftImage("nameplate")} alt="Cream custom 3D-printed desk nameplate with raised terracotta letters" fill sizes="(max-width: 850px) 100vw, 50vw" /></div>
          <div><p className="product-kind">Personalized objects</p><h3>3D-printed gifts</h3><p>Useful keepsakes and playful pieces, personalized with names, colours, and details.</p><span className="choice-link">Explore 3D gifts <i className="css-arrow" aria-hidden="true" /></span></div>
        </Link>
      </div>
    </section>

    <section className="custom-gift-section shop-custom"><div className="site-shell custom-gift-grid">
      <div className="card-feature-image printed-custom-preview"><Image src={printedGiftImage("photo-plaque")} alt="Custom 3D-printed photo plaque with a raised mountain landscape" fill sizes="(max-width: 850px) 100vw, 50vw" /></div>
      <div><p className="eyebrow">Custom design</p><h2>Start with an idea.</h2><p>Bring a sketch, a photo, a name, or a half-formed idea. We can help shape a one-of-a-kind card or gift.</p><Link href={printRequestHref(customPrintSlug)} className="round-button">Request a custom 3D design <span className="css-arrow" aria-hidden="true" /></Link></div>
    </div></section>

    <section className="shop-delivery-note"><div className="site-shell"><div><p className="eyebrow">Delivery</p><h2>Have an order ready?</h2><p>Choose a preferred delivery date and time, then text the request to AH Gifts for confirmation.</p></div><Link href="/gifts/delivery" className="round-button">Request a delivery time <span className="css-arrow" aria-hidden="true" /></Link></div></section>

    <section className="bulk-section"><div className="site-shell bulk-grid">
      <div><p className="eyebrow">For your whole group</p><h2>Bulk card orders.</h2><p>Matching cards for weddings, events, teams, holidays, or customer thank-yous. Ask us about quantity, wording, and a design that fits.</p><Link href="/gifts/bulk-orders" className="round-button">Request a bulk quote <span className="css-arrow" aria-hidden="true" /></Link></div>
      <ImageSlot label="Cards for your event" />
    </div></section>
  </>
}
