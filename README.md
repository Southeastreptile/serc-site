# SERC Website

Website for Southeastern Reptile Conservation (southeastreptile.org), a Virginia 501(c)(3) rehabilitating native reptiles and amphibians in Hampton Roads and Southeastern Virginia. Built with Astro and hosted on Firebase.

## Getting started

```
npm install
npm run dev
```

Open http://localhost:4321

Requires Node 22.12 or newer.

## Build and deploy

```
npm run build
firebase deploy --only hosting --project serc-website-d2ac4
```

A GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys automatically on push to `main` once the `FIREBASE_SERVICE_ACCOUNT` repo secret is set up (`firebase init hosting:github`). Until then, deploy manually with the commands above.

## Project layout

- `src/layouts/Layout.astro` — nav, footer, `<head>` (SEO meta, JSON-LD, GA4 analytics)
- `src/pages/` — one file per page (blog posts in `src/pages/blog/`)
- `src/data/posts.js` — shared blog post list (newest first); drives the blog index and the homepage feature
- `src/content/species/*.json` — data for the Field Guide
- `src/styles/global.css` — all styles and design tokens
- `public/images/` — all images (use **lowercase** filenames; the host is case-sensitive)

Pages: Home, About, Our Patients, Field Guide, Turtle Watch, Software, Blog, Rehabber Resources, Contact, Donate, Merch, Triage, Intake, Privacy Policy, and a 404.

## Adding a blog post

1. Create `src/pages/blog/your-post-slug.astro` (copy an existing post as a template).
2. Add an entry to the **top** of the array in `src/data/posts.js` (newest first) so it lists on `/blog` and features on the homepage.
3. Drop any images in `public/images/`.

Notes: blog posts are `.astro`, not MDX. Keep body copy free of em dashes, and keep animal, nesting, and release locations general (anti-poaching). Pass `noindex={true}` to the Layout for drafts or private pages.

## Turtle Watch (`/turtle-watch`)

Live corridor map showing where turtles are active near major roads in southeastern Virginia. Fetches observations from the iNaturalist API and road geometry from the OpenStreetMap Overpass API. No build-time data, all client-side.

Key constants at the top of `src/pages/turtle-watch/index.astro`:

```js
const GRID_DEG    = 0.04;   // grid cell size
const ROAD_THRESH = 0.004;  // road proximity threshold
const MIN_CLUSTER = 2;      // minimum sightings to highlight a cell
```

Data sources: iNaturalist (`api.inaturalist.org/v1/observations`, Testudines) and the OpenStreetMap Overpass API (motorway, trunk, primary, secondary roads). A seasonal alert banner appears automatically April through September.

## Intake form (`/intake`)

The intake page embeds the public animal report form from WRMD (Wildlife Rehabilitation MD), SERC's intake system. Reports go directly into WRMD; the site stores nothing. The form's pre- and post-submit messages are configured in WRMD. WRMD only serves the embed to the domain registered in the account, so a 404 inside the iframe means the domain is not registered.

## Short links

Stable short links to external resources live in the `redirects` block of `firebase.json` (e.g. `/chewy`, `/guides/box-turtle-headstart`). Share those instead of raw Drive or storefront URLs; when a destination changes, update the one entry and every shared link keeps working. To replace a guide PDF without changing its link, use Drive's Manage versions → Upload new version.

## Rehabber resources and privacy

`/rehabber-resources` (not indexed) links SERC's curated supplies list on Chewy and any publicly shareable guides. `/privacy` is the privacy policy; update the `effectiveDate` constant at the top of `src/pages/privacy.astro` when the text changes.
