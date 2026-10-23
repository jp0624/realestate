# Realty Property Search

A React and TypeScript real estate experience for the Realty Property Search concept portfolio. The collection contains 54 fictional Toronto and GTA homes, including 50 additions to the four original sample records. Every home has its own generated exterior and a four-view gallery with a living room, kitchen and bedroom.

[Open the live site](https://jp-realestate.vercel.app/)

## What you can do

- Search by address, city, neighbourhood or home type. Combine listing status, type, bedrooms and price filters, then sort by price, newest or featured.
- Browse a paginated grid or an interactive Leaflet/OpenStreetMap map. Area counts open into price markers as you zoom. Filter the results to the visible map area or reset the map to all matching homes.
- Save homes on the current browser and revisit them on the saved page.
- Open complete property pages, browse the gallery by buttons or arrow keys, and keep private viewing notes on the current browser.
- Read buying and selling guides, neighbourhood introductions, a project introduction and practical FAQs.
- Change the home price, down payment, rate, amortization, tax and maintenance assumptions in the mortgage planning calculator.
- Prepare an enquiry as an email draft. The visitor reviews and sends it in their own email application. The website does not submit a lead or claim an email was sent.

## Run locally

Use Node.js 22.22.2 or newer on the 22 line, 24.15 or newer on the 24 line, or 26 and newer.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The public application does not require API keys, Firebase credentials or a backend process. The map downloads standard OpenStreetMap tiles and includes attribution. A connection is needed for map tiles. The Latin web fonts are self-hosted from the Fontsource variable font packages. Listings, images and application code are bundled with the site.

## Routes

- `/`: agent homepage or search-first homepage, selected by `src/site/config.ts`.
- `/find-your-home`: property search.
- `/new-listings`: sample homes added within seven days.
- `/map`: map-first search.
- `/property/:id` and the legacy `/location/:id`: property details.
- `/saved`: browser-local shortlist.
- `/about`, `/buy`, `/sell`, `/neighbourhoods`, `/mortgage-calculator`, `/contact`: expanded content pages.

The original `/About`, `/Find_Your_Home`, `/Mortgage_Calculator` and `/New_Listings` links remain usable. Vercel rewrites application routes to `index.html`; the project builds with Vite and serves `dist` on Node 24.

## Source and data

`src/site/properties.json` is the catalogue used by the application. A matching public copy is available at `public/data/properties.json`. `src/site/data.ts` contains typed filtering, formatting and mortgage calculations. `PropertyMap.tsx` is loaded only when a map is requested. `App.tsx` contains the shared pages and interactions; `styles.css` contains the responsive visual system.

`public/images/properties` contains 54 unique exterior WebPs and 18 interior WebPs. Each property uses the matching home-style living room, kitchen and bedroom. These interior concepts are shared within their home-style group; they are illustrative, not claimed as photographs of a specific property. Image prompts and generation provenance are recorded in `ASSETS.md` and `public/images/properties/manifest.json`.

The original first four IDs remain in the catalogue. Their placeholder content has been replaced with complete fictional listing records. The original source files remain in Git as historical reference; the current entrypoint imports `src/site`, and the production build type-checks that active application. The old Firebase integrations are not used by the public demo, and no remote records are written or deleted.

## Storage and privacy

Saved homes use `lechat-saved-v2`; notes use a key per property. These values remain on the browser and origin where they were created. They do not sync between devices or between the two deployments. If storage is unavailable, the interface explains that changes last only for the current visit.

## Mortgage model

The calculator uses a nominal annual interest rate compounded semi-annually and converts it to a monthly rate. It supports a down payment of 20% or more and excludes mortgage default insurance. The biweekly figure is the monthly amount annualized across 26 periods, not an accelerated payment plan. The estimated monthly total adds only the entered tax and maintenance amounts. Interest rates are illustrative inputs, not lender quotes; eligibility, closing costs, utilities, insurance and rate changes are outside this model.

## Demonstration content

All 54 listings are fictional. Prices, dimensions, addresses, features and dates are sample data; map pins indicate approximate neighbourhood positions. The home images were generated for this portfolio and are labelled as illustrations. This site does not provide MLS or brokerage inventory. The former agent branding and portrait have been replaced by Realty Property Search. Portfolio enquiries are addressed to John Parker; no brokerage credentials, sales figures, awards or testimonials are claimed.

## Verification

The interaction suite checks catalogue counts and unique exterior references, combined filters, empty-state reset, persisted saved homes, gallery controls, private notes, mortgage math and input changes, enquiry-draft preparation, and content on the expanded routes. Production builds retain strict TypeScript checks. Browser checks cover the deployed application separately from jsdom tests.

For a reference on mortgage terms and amortization, see the [Financial Consumer Agency of Canada](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html).

## Tailwind and mobile layouts

Tailwind CSS 4 runs through the official Vite plugin. Responsive utility classes are used directly in `src/site/App.tsx` and `PropertyMap.tsx` for the page grids, spacing, card layouts, forms and map/list views. `src/site/styles.css` keeps the custom brand typography, image treatments, Leaflet styling and interaction states. No Tailwind CDN is required.

The layouts adapt at 1200, 900 and 700 pixels. Phones get a collapsible navigation, stacked map/list results, single-column cards, a viewport-sized gallery and full-width search controls. Touch controls have a 44px minimum target on smaller screens, and form fields use 16px text to avoid iOS input zoom. Reduced-motion settings are respected.

## Neighbourhood inspiration hero

Three original AI-generated, fictional Toronto-inspired neighbourhood scenes (village street, waterfront and walkable urban street) fade every 6.5 seconds. Previous/next, direct scene selectors, arrow keys and pause/play controls are available. Playback pauses while hovered or focused, and when the tab is hidden. Reduced-motion users start with a static scene and can still navigate manually. Imagery is clearly labelled as illustration, not a real neighbourhood photograph or listing.
