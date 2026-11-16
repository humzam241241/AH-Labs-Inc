# AH Gifts card gallery artwork

The cards page has 18 collections with 10 artwork previews each. Every preview
is an individual WebP image in `public/cards/<category>/01.webp` through
`10.webp`. The category names, order, and design names live in
`lib/card-catalog.ts`.

The first seven sets were cropped from contact sheets provided by the owner:
birthday, anniversary, wedding, engagement, graduation, congratulations, and
thank-you. The remaining eleven sets were generated for this site. No vendor
product photographs were copied.

To replace one preview with a final design, export the new image as WebP and
replace the matching numbered file. For another format or filename, update
`cardImage()` in `lib/card-catalog.ts` or add an image path to the catalog.
Keep each artwork inside the frame; the gallery supports square and portrait
formats. Update the design name in the same catalog entry.

These previews are web resolution and are not print-ready masters. Keep final
print files separately at the resolution and bleed required by the printer.
