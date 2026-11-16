export type PrintedGift = {
  slug: string
  name: string
  description: string
  standardSize: string
  standardDesign: string
  imageAlt: string
}

export const printedGifts: readonly PrintedGift[] = [
  {
    slug: "nameplate",
    name: "Custom nameplate",
    description: "Add a name, title, or short phrase to a freestanding desk sign.",
    standardSize: "120 × 35 mm sign face",
    standardDesign: "Rounded sign with raised lettering",
    imageAlt: "Cream desk nameplate with raised terracotta letters spelling Maya",
  },
  {
    slug: "lithophane",
    name: "Custom photo lithophane",
    description: "Send a favourite photo for a thin relief that reveals the image when lit from behind.",
    standardSize: "100 × 75 mm panel",
    standardDesign: "Rectangular photo relief on a stand",
    imageAlt: "Backlit 3D printed portrait of a golden retriever on a small stand",
  },
  {
    slug: "keychain",
    name: "Custom keychain",
    description: "Choose a name, initials, or a simple symbol for a bag or key ring.",
    standardSize: "60 × 22 mm tag",
    standardDesign: "Rounded name tag with a split ring",
    imageAlt: "Teal 3D printed name tag with raised cream letters spelling Noor and a silver key ring",
  },
  {
    slug: "ornament",
    name: "Custom ornament",
    description: "Mark a date, add a family name, or ask for a shape for your occasion.",
    standardSize: "75 mm diameter",
    standardDesign: "Round snowflake ornament with a hanging loop",
    imageAlt: "Red 3D printed round ornament with a recessed snowflake and cream hanging cord",
  },
  {
    slug: "phone-stand",
    name: "Custom phone stand",
    description: "Choose a colour or send your phone and case dimensions for a stand sized to fit.",
    standardSize: "80 × 85 mm base",
    standardDesign: "Angled desktop stand for a phone",
    imageAlt: "Black phone resting on a sage green 3D printed desk stand",
  },
  {
    slug: "ring-dish",
    name: "Custom ring dish",
    description: "A small tray for rings and keepsakes, with room for initials or a simple motif.",
    standardSize: "85 mm diameter",
    standardDesign: "Round shallow dish with a raised rim",
    imageAlt: "Two silver rings in a round rose pink 3D printed dish",
  },
  {
    slug: "bookmark",
    name: "Custom bookmark",
    description: "Pick a colour, short message, or symbol for a slim page marker.",
    standardSize: "135 × 28 mm",
    standardDesign: "Flat bookmark with a sun motif and tassel",
    imageAlt: "Slim blue bookmark with a raised sun and a cream tassel on an open book",
  },
  {
    slug: "planter",
    name: "Custom mini planter",
    description: "Choose a colour or request dimensions for a small plant or nursery pot.",
    standardSize: "75 mm diameter × 70 mm tall",
    standardDesign: "Round planter with vertical ribs",
    imageAlt: "Small succulent in a cream 3D printed planter with vertical ribs",
  },
  {
    slug: "organizer",
    name: "Custom desk organizer",
    description: "Request a layout for the pens, clips, or tools you want to keep at hand.",
    standardSize: "150 × 85 mm footprint",
    standardDesign: "Three compartments at different heights",
    imageAlt: "Sage and cream 3D printed organizer with pencils and paper clips",
  },
  {
    slug: "cookie-cutter",
    name: "Custom cookie cutter",
    description: "Start with a star or share a simple outline for a shape of your own.",
    standardSize: "70 mm across",
    standardDesign: "Five-point star outline",
    imageAlt: "Teal 3D printed cookie cutter in a five-point star shape",
  },
  {
    slug: "figurine",
    name: "Custom mini figurine",
    description: "Describe a pet, character, or theme for a small decorative figurine.",
    standardSize: "65 mm tall",
    standardDesign: "Geometric fox figurine on a round base",
    imageAlt: "Small geometric red and cream fox figurine on a round stand",
  },
  {
    slug: "photo-plaque",
    name: "Custom photo plaque",
    description: "Send a photo or illustration to turn into a two-tone raised design for display.",
    standardSize: "110 × 85 mm plaque face",
    standardDesign: "Freestanding plaque with a raised landscape",
    imageAlt: "Cream freestanding plaque with a raised blue mountain and pine landscape",
  },
]

export const customPrintSlug = "custom-design"

export function printedGiftImage(slug: string) {
  return `/3d-printed/${slug}.webp`
}

export function printRequestHref(slug: string) {
  return `/gifts/3d-printed/request/${slug}`
}
