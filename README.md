# SERC Website

Website for Southeastern Reptile Conservation (southeastreptile.org), a Virginia 501(c)(3) rehabilitating native reptiles and amphibians in Hampton Roads and Southeastern Virginia. Built with Astro and hosted on Firebase.

## Getting started

```
npm install
npm run dev
```

Open http://localhost:4321

## Build and deploy

```
npm run build
firebase deploy --only hosting --project serc-website-d2ac4
```

Pushing to `main` triggers an automatic deploy via GitHub Actions.

## Project layout

- `src/layouts/Layout.astro` — nav, footer, `<head>` (SEO meta, JSON-LD, GA4 analytics)
- `src/pages/` — one file per page (blog posts in `src/pages/blog/`)
- `src/data/posts.js` — shared blog post list (newest first); drives the blog index and the homepage feature
- `src/content/species/*.json` — data for the Field Guide
- `src/styles/global.css` — all styles and design tokens
- `public/images/` — all images (use **lowercase** filenames; the host is case-sensitive)
- `scripts/` — helper scripts (e.g. the intake-form Apps Script backend)

Pages: Home, About, Our Patients, Field Guide, Turtle Watch, Software, Blog, Rehabber Resources, Contact, Donate, Merch, Triage, Intake, and a 404.

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

## Intake form

`/intake` is a wildlife intake form that posts to a Google Apps Script web app (which appends to a Google Sheet and emails the team). It is not fully live yet: paste the deployed script's `/exec` URL into `INTAKE_ENDPOINT` in `src/pages/intake.astro` to activate it. Setup steps are in `scripts/intake-apps-script.gs`.
