# SERC Website

Website for Southeastern Reptile Conservation (southeastreptile.org), a Virginia 501(c)(3) rehabilitating native reptiles and amphibians in Hampton Roads. Built with Astro 6, hosted on Firebase.

## Getting started

```
npm install
npm run dev
```

Open http://localhost:4321. Requires Node 22.12 or newer.

## Build and deploy

```
npm run build
firebase deploy --only hosting --project serc-website-d2ac4
```

Deploys are manual for now. The GitHub Actions workflow in `.github/workflows/deploy.yml` will deploy on push to `main` once the `FIREBASE_SERVICE_ACCOUNT` secret is set (`firebase init hosting:github`).

## Project layout

- `src/layouts/Layout.astro`: nav, footer, `<head>` (SEO, JSON-LD, GA4)
- `src/pages/`: one file per page; blog posts in `src/pages/blog/`
- `src/data/posts.js`: blog list, newest first
- `src/data/events.js`: events with ISO dates; drives `/events` and the homepage event banner
- `src/content/species/*.json`: field guide data
- `src/styles/global.css`: design tokens and shared styles
- `public/images/`, `public/guides/`: images and self-hosted PDFs (lowercase filenames; hosting is case-sensitive). After adding photos, run `npm run images` to resize and compress them for the web.

Pages: Home, About, Our Rehabilitators, Our Patients, Field Guide, Turtle Watch, Software, Blog, Events, Rehabber Resources, Contact, Donate, Merch, Triage, Intake, Privacy, Sign Up (email list), an unlisted Get Permitted guide, and a 404. Agent and contributor notes live in `AGENTS.md`.

## Common edits

- **Blog post**: copy an existing post in `src/pages/blog/`, then add an entry to the top of `src/data/posts.js`.
- **Event**: add an object with an ISO `date` to `src/data/events.js`. Past events hide automatically.
- **Talk or poster**: edit the `talks` array at the top of `src/pages/about.astro`.
- **Short link** (`/chewy`, `/slack`, `/venmo`, `/guides/...`, `/talks/...`): add a redirect in `firebase.json` and deploy.
- **Email sign-up form**: set `SIGNUP_FORM_URL` at the top of `src/pages/signup.astro` to the form's embed URL.

Content rules: no em dashes in body copy; keep animal locations general (anti-poaching); pass `noindex={true}` to the Layout for unlisted pages.

## Turtle Watch (`/turtle-watch`)

Live map of turtle activity near major roads in southeastern Virginia, built client-side from the iNaturalist API and OpenStreetMap Overpass. Tuning constants (`GRID_DEG`, `ROAD_THRESH`, `MIN_CLUSTER`) are at the top of `src/pages/turtle-watch/index.astro`. A seasonal banner shows April through September.

## Intake form (`/intake`)

Embeds the public animal report form from WRMD (Wildlife Rehabilitation MD), SERC's intake system. Reports go directly to WRMD; the site stores nothing. WRMD only serves the embed to the domain registered in the account.
