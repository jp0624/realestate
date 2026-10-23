# Images, typography and provenance

## Generated home imagery

The built-in image generation tool produced 72 separate fictional architectural photographs for this refresh: 54 unique exteriors and 18 interiors. Final project assets are WebP files in `public/images/properties`.

The exterior sequence repeats six home styles, with nine distinct variations per style: Victorian brick semi, contemporary detached, modern townhouse, condo building, converted warehouse loft, and suburban family home. Each of the 54 listing records has its own exterior. The interior sequence contains a living room, kitchen and bedroom for each of those six styles. Those interior concepts are shared across homes within the matching style; the gallery labels do not claim they depict one actual property.

Every prompt asks for professional wide real estate photography, credible Greater Toronto residential architecture or interiors, natural materials and lighting, and no text, people, logos or watermarks. `public/images/properties/manifest.json` records file hashes, dimensions and retained prompts (the first batch has no prompt checkpoint). Generation used the built-in tool, followed by resizing and WebP compression for the websites.

All listing addresses, prices, dimensions, dates, features and map locations are fictional sample data. Images are illustrations, not photographs of homes currently available for sale or lease. These limits appear in the public site header, footer and property details.

## Existing agent asset

`public/images/kim-lechat.png` is copied from the original repository's `public/assets/images/layout/kim-lg.png`. It has not been generated or retouched. The contact details are retained from the original website. The refresh adds no unverified awards, credentials, client testimonials or sales metrics.

## Typography

DM Sans Variable and Manrope Variable are bundled from the Fontsource packages and served with the application. Their SIL Open Font License notices are included in `public/licenses`. Georgia is a system-font fallback for the serif accent.

## Maps

Leaflet renders the map using standard OpenStreetMap tiles. Attribution remains visible on the map. Coordinates identify approximate neighbourhood positions for the fictional collection; no address geocoding or real listing verification is implied.

## Realty Property Search neighbourhood hero (2026-10-23)

Original images created with the built-in image generation tool and optimized to WebP in `public/images/neighbourhoods/`:

- `village.webp`: photorealistic Toronto-inspired leafy residential village street, red-brick homes, mature maples and morning light.
- `waterfront.webp`: photorealistic Toronto-inspired waterfront boardwalk, mid-rise homes, lake and sunset skyline.
- `urban.webp`: photorealistic Toronto-inspired walkable urban street, brick shopfronts, patios, street trees and warm autumn light.

All prompts requested wide editorial architectural photography, headline space, no readable signage/logos/watermarks, and a fictional illustrative setting rather than an actual listed property. The UI labels every scene as AI-generated inspiration. Source PNGs were retained during production; the committed WebP assets are the deployed versions.

The new `public/assets/realty-mark.svg` is an original code-native roof-and-search mark; `public/favicon.svg` uses the same mark.
