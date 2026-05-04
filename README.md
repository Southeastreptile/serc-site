# SERC Website

Website for Southeast Reptile Conservation, built with Astro and hosted on Firebase.

## Getting started

```
npm install
npm run dev
```

Open http://localhost:4321

## Build and deploy

```
npm run build
firebase deploy
```

Pushing to main triggers an automatic deploy via GitHub Actions.

## Adding a blog post

1. Create `src/pages/blog/your-post-slug.astro`
2. Use the existing post as a template
3. Add the post to the array in `src/pages/blog/index.astro`
4. Drop any images in `public/images/`

## Turtle Watch (`/turtle-watch`)

Live corridor map showing where turtles are active near major roads in southeastern Virginia. Fetches research-grade observations from the iNaturalist API and road geometry from the OpenStreetMap Overpass API — no build-time data, all client-side.

Key constants at the top of `src/pages/turtle-watch/index.astro`:

```js
const GRID_DEG    = 0.04;   // ~2.7 mile grid cell size
const ROAD_THRESH = 0.004;  // ~0.25 miles road proximity threshold
const MIN_CLUSTER = 5;      // minimum sightings to highlight a cell
```

Data sources: iNaturalist (`api.inaturalist.org/v1/observations`, research-grade Testudines) and OpenStreetMap Overpass API (motorway, trunk, primary, secondary roads). A seasonal alert banner appears automatically April–September.
