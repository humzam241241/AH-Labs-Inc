export type CardCategory = {
  slug: string
  name: string
  description: string
  designs: readonly string[]
}

// Design numbers map directly to public/cards/<slug>/01.webp through 10.webp.
// Replace an individual image in that folder when a final card design is ready.
export const cardCategories: readonly CardCategory[] = [
  {
    slug: "birthday", name: "Birthday cards", description: "For every age, personality, and kind of celebration.",
    designs: ["Birthday Wildflowers", "Candlelit Cake", "Retro Blooms", "Moonlit Wishes", "Party Friends", "Birthday Candles", "Garden Leaves", "Rainbow Confetti", "Lilac Balloons", "Cake Sketch"],
  },
  {
    slug: "anniversary", name: "Anniversary cards", description: "For partners, parents, and years worth celebrating.",
    designs: ["Layered Hearts", "Golden Curves", "Ribbon Bouquet", "Golden Botanicals", "Sunset Garden", "Starlit Heart", "Hand in Hand", "Soft Blossoms", "Floral Cake", "Golden Rings"],
  },
  {
    slug: "wedding", name: "Wedding cards", description: "Thoughtful congratulations for the newlyweds.",
    designs: ["White Lilies", "Blossom Branch", "Golden Bubbles", "Garden Roses", "Doves and Ribbon", "Garden Arch", "Blue Botanicals", "Wildflower Meadow", "Golden Vows", "Pastel Curves"],
  },
  {
    slug: "engagement", name: "Engagement cards", description: "Celebrate the beginning of a new chapter.",
    designs: ["Rings and Flowers", "Joined Hands", "Garden Path", "Starlit Promise", "Gold Confetti", "Blush Hearts", "Sunset Promise", "Flower Branch", "Floral Arch", "Bright Bouquet"],
  },
  {
    slug: "graduation", name: "Graduation cards", description: "For diplomas, degrees, and what comes next.",
    designs: ["Indigo Tassel", "Confetti Cap", "Diploma Collage", "Radiant Cap", "New Growth", "Golden Cap", "Books and Blooms", "New Horizon", "Laurel Cap", "Bright Future"],
  },
  {
    slug: "thank-you", name: "Thank-you cards", description: "A personal way to show appreciation.",
    designs: ["Garden Blooms", "Sunshine", "Olive Branch", "Citrus and Berries", "Painted Strokes", "Blush Ribbon", "Golden Stars", "Blue Flowers", "Paper Hearts", "Quiet Leaves"],
  },
  {
    slug: "new-baby", name: "New baby cards", description: "A warm welcome for a brand-new arrival.",
    designs: ["Little Booties", "Sleepy Stars", "Teddy Bear", "Stork at Sunrise", "Tiny Outfits", "First Blocks", "Flower Pram", "Little Handprints", "Nursery Rainbow", "Garden Ducklings"],
  },
  {
    slug: "congratulations", name: "Congratulations cards", description: "For promotions, new homes, and big wins.",
    designs: ["Party Popper", "Bold Shapes", "Golden Star", "Pink Bouquet", "Rainbow Joy", "Fireworks", "Trophy Moment", "Ribbon Confetti", "Sunny Day", "Paper Party"],
  },
  {
    slug: "housewarming", name: "Housewarming cards", description: "A little something for their new place.",
    designs: ["Welcome Door", "Garden Cottage", "New Keys", "Warm Windows", "Plants on the Sill", "Townhouse Row", "Moving Day Blooms", "Kitchen Tea", "House in Flowers", "Open Door"],
  },
  {
    slug: "retirement", name: "Retirement cards", description: "Celebrate the next great adventure.",
    designs: ["Open Road", "Garden Days", "Calm Sailing", "Tea and a Book", "Travel Plans", "Hammock Afternoon", "Mountain Horizon", "A Leisurely Ride", "Evening Pier", "Cafe Morning"],
  },
  {
    slug: "get-well", name: "Get-well cards", description: "A caring note when someone needs it most.",
    designs: ["Tea and Honey", "Window Bouquet", "Sun After Clouds", "Cozy Reading", "Daisy Meadow", "After the Rain", "Butterfly Garden", "Care Package", "Citrus Blossoms", "Garden Bench"],
  },
  {
    slug: "sympathy", name: "Sympathy cards", description: "Simple, respectful support through difficult moments.",
    designs: ["White Lilies", "Olive Branch", "Quiet Dawn", "Candlelight", "Forget-Me-Nots", "Doves", "Gentle Mist", "Wildflower Remembrance", "Moonlit Horizon", "Soft Leaves"],
  },
  {
    slug: "holiday", name: "Holiday cards", description: "Seasonal cards for family, friends, and customers.",
    designs: ["Winter Greens", "Snow and Gold", "Candle Glow", "Festive Wreath", "Ornament Branch", "Winter Village", "Wrapped Gifts", "Cocoa Afternoon", "Starry Winter", "Cozy Scarf"],
  },
  {
    slug: "eid-ramadan", name: "Eid and Ramadan cards", description: "Warm wishes for meaningful moments together.",
    designs: ["Golden Crescent", "Lantern Glow", "Floral Moon", "Date Palms", "Evening Arch", "Night Skyline", "Golden Stars", "Desert Moon", "Gathering Table", "Pattern and Light"],
  },
  {
    slug: "mothers-day", name: "Mother's Day cards", description: "A thoughtful note for someone who means a lot.",
    designs: ["Pink Peonies", "Wildflower Bouquet", "Tea and Blossoms", "Garden Gate", "Flowers in Hand", "Magnolia Branch", "Floral Heart", "Tulip Vase", "Butterfly Garden", "Blossom Sunrise"],
  },
  {
    slug: "fathers-day", name: "Father's Day cards", description: "Celebrate the people who show up for you.",
    designs: ["Mountain Morning", "Two Mugs", "Compass Rose", "Bicycle Ride", "Lakeside Dawn", "Warm Woods", "Workbench Garden", "Record and Coffee", "Open Water", "Starlit Night"],
  },
  {
    slug: "just-because", name: "Just-because cards", description: "No occasion required—only someone worth thinking of.",
    designs: ["Small Posy", "Lemon Blossoms", "A Little Note", "Everyday Rainbow", "Cloud and Sun", "Tea Time", "Bird on a Branch", "Peach and Berries", "Paper Ribbons", "Night Bouquet"],
  },
  {
    slug: "custom-cards", name: "Custom cards", description: "Start with an artwork and make the words, colours, and details your own.",
    designs: ["Floral Corners", "Paper Shapes", "Golden Stars", "Botanical Wreath", "Pastel Arch", "Line Leaves", "Blush Blocks", "Moon and Stars", "Confetti Border", "Watercolor Landscape"],
  },
]

export function findCardCategory(slug: string) {
  return cardCategories.find((category) => category.slug === slug)
}

export function cardImage(slug: string, designNumber: number) {
  return `/cards/${slug}/${String(designNumber).padStart(2, "0")}.webp`
}

export function cardCode(slug: string, designNumber: number) {
  return `${slug.toUpperCase()}-${String(designNumber).padStart(2, "0")}`
}
