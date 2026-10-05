# SERC Site

Astro static site for Southeastern Reptile Conservation (southeastreptile.org), a Virginia 501(c)(3) that rehabilitates native reptiles and amphibians and serves Hampton Roads / Southeastern Virginia. Hosted on Firebase Hosting.

## Stack

Astro 6 | `@astrojs/sitemap` (auto-generates the sitemap on every build) | Firebase Hosting (site id: `serc-website-d2ac4`, public dir: `dist`) | Fonts: Marcellus (headings), PT Serif (body/nav), loaded via `<link>` in Layout | All styles in `src/styles/global.css` using CSS custom properties.

`@astrojs/mdx` is installed but unused; blog posts are `.astro`, not MDX.

Astro requires Node >= 22.12. If the local `node` is broken (Homebrew `node@22` has had a dyld error), use `export PATH="/opt/homebrew/Cellar/node/26.5.0/bin:$PATH"`.

## Commands

`npm run dev` starts local dev at localhost:4321
`npm run build` builds to `dist/`
`firebase deploy --only hosting --project serc-website-d2ac4` deploys (this is how the site is currently shipped)

## Deploys

`.github/workflows/deploy.yml` auto-deploys on push to `main`, but it needs the `FIREBASE_SERVICE_ACCOUNT` repo secret, which has not been set yet (create it with `firebase init hosting:github`). Until then, deploy manually with the command above. Gotchas are documented in the workflow header: the Firebase project ID is `serc-website-d2ac4` (the display name `serc-website` is not the ID), and Node must be >= 22.

## Structure

`src/layouts/Layout.astro` — nav, footer, `<head>` (SEO meta + JSON-LD + analytics)
`src/pages/` — one file per page; blog posts in `src/pages/blog/`
`src/data/posts.js` — shared blog post metadata, newest first (drives the blog index and the homepage "From the blog" feature)
`src/data/events.js` — community events (ISO dates) plus date helpers; drives `/events` and the homepage "Upcoming event" card
`src/content/species/*.json` — species data for the field guide (four files: turtles, snakes, frogs-toads, salamanders), each with `inatTaxonId`
`src/pages/turtle-watch/index.astro` — live iNaturalist corridor map (client-side)
`src/styles/global.css` — all styles and design tokens
`public/images/` — all images

## Pages

Home, About (includes the Speaking and outreach section), Our patients (`/wildlife`), Field guide (`/species` + `/species/[id]`), Turtle Watch, Software (`/open-source`), Blog, Events (`/events`), Rehabber resources (`/rehabber-resources`, noindexed), Contact, Donate, Merch, Triage (`/triage`), Intake (`/intake`), Privacy policy (`/privacy`), 404.

Nav (in Layout): logo + Home, About (dropdown: About us, Events, For rehabbers), Our patients, Field guide (dropdown: Species ID, Turtle Watch), Software, Blog, Contact, and a Support dropdown (Donate, Merch). Software stays top-level on purpose: the open-source work is core to SERC's identity and should be visible on every page. Blog stays top-level too (main public content). Not every page is in the nav. The footer links Rehabber resources and Privacy policy. Software is also highlighted in a dark band on the homepage (after the mission strip).

The full desktop nav needs about 1170px. Below `max-width: 1180px` the links collapse into the hamburger menu while the social icons and Support button stay visible; below 768px those hide too (both rules are in the Responsive block of `global.css`). Adding a top-level nav item pushes that figure up by roughly 100px; prefer adding to a dropdown, and re-measure `.nav__links` width at 1440px before changing the breakpoint.

## Layout / SEO conventions

- Titles auto-get ` | SERC` appended only when the title does not already contain "SERC".
- `<head>` includes `robots`, `geo.region`/`geo.placename`, canonical, Open Graph/Twitter tags, and an `impact-site-verification` meta tag.
- Pass `noindex={true}` to `Layout` for drafts or private pages (e.g. rehabber resources).
- GA4 (`G-N186ZPKTJC`) plus a delegated click tracker in Layout fires: `event_link_click` (anchors with `data-track="event-link"`, carries `event_title`), `donate_click` (Donate / Zeffy / PayPal / Bonfire), `wishlist_click` (Amazon / Chewy / Walmart), `text_click` (`sms:`), `email_click` (`mailto:`), `contact_submit`. The intake form is a third-party iframe, so its submissions are not tracked by our page.
- Date guard (inline script after `<main>` in Layout): any element with `data-hide-after="YYYY-MM-DD"` is hidden once that day has passed in the visitor's local time, and any `[data-empty-for="<list id>"]` is revealed when that list has no visible items. Used by event cards, the homepage event section, and the "Upcoming" pill on talks.

## Adding a blog post

1. Create `src/pages/blog/<slug>.astro` (copy an existing post as a template; use the `blog-post` structure and classes).
2. Add an entry to the **top** of the array in `src/data/posts.js` (newest first) so it lists on `/blog` and features on the homepage.
3. Drop images in `public/images/`.

## Adding an event

1. Add an object to the array in `src/data/events.js`. `date` must be ISO `YYYY-MM-DD`; add `endDate` for multi-day events. Required: `title`, `date`, `venue`, `city`, `description`. Optional: `time` (display string), `address`, `partners[]`, `url` + `urlLabel` (button text, defaults to "Event details"), `image` + `imageAlt`, `type` (fundraiser | cleanup | education | other).
2. Event images go in `public/images/` with lowercase filenames; the events page renders them 16:9.
3. Build and deploy. Only upcoming events render. On the homepage the soonest event appears twice: a slim accent banner above the hero and the "Upcoming event" section below the Donate band. Both disappear when nothing is scheduled. Each upcoming event also emits `Event` JSON-LD on `/events`.

Past events are filtered at build time and also hidden in the browser the day after they end (date guard above), so a stale event vanishes for visitors immediately. A deploy is still needed to remove it from the HTML and JSON-LD and to publish new events. Venue names and street addresses for public fundraisers are fine; the location rule below is about animals.

## Adding a talk

Edit the `talks` array at the top of `src/pages/about.astro`. Fields: `event` (conference name), optional `eventFull` (spelled-out org), `format` (Talk | Poster | Workshop | Panel | Virtual talk), `date` (ISO) or `date: null` plus `year` when the exact day is unknown, optional `title` (talk title; the event name is used as the heading when missing), `titleHtml` (same title with markup, for italic scientific names via `<em>`), `time` (display string, shown under the date), `location`, `url`. All talks stay listed, newest first; a dated talk in the future gets an "Upcoming" pill automatically.

## Intake form

`/intake` embeds the public animal report form from WRMD (Wildlife Rehabilitation MD), SERC's intake system, via an iframe plus `https://wrmd.org/embed/v1/resize.js`. Submissions go straight into the WRMD account; nothing is stored on this site. "Report an animal" links to `/intake` from the homepage callout, the triage page, and the contact page.

- The pre-submit and post-submit messages (text-first instructions, VA DWR data notice, what happens next) are configured inside WRMD, not in this repo.
- WRMD only serves the embed to the domain registered in the account (it sends `Content-Security-Policy: frame-ancestors`). If the iframe shows a 404, the site domain is not registered in WRMD.

## Rehabber resources

`/rehabber-resources` links a curated supplies list on SERC's Chewy storefront (`CHEWY_STOREFRONT_URL` at the top of the page). The storefront pays SERC a commission, so the link carries `rel="sponsored"` and a short disclosure sits under the button; keep both if the link moves. The former Amazon affiliate supplies list was removed for Google Ad Grants compliance (this page is noindexed, which is why the storefront link is acceptable here). The access-controlled Drive library section is hidden behind the `SHOW_LIBRARY` toggle in the same file.

## Short links and redirects

External resources get a stable path on our domain via the `redirects` block in `firebase.json` (302s, matched by regex so a trailing slash also works). Firebase applies redirects before the SPA `**` rewrite, so no page file is needed. Current entries: `/chewy` (Chewy storefront), `/slack` (volunteer Slack invite), and `/guides/box-turtle-headstart` (Head-starting guide PDF on Drive).

- Share the short link, never the raw Drive or storefront URL, so shared links survive when the destination changes.
- New guides go under `/guides/<name>`, and the site should link to the short path, not the destination, so the real URL lives only in `firebase.json`.
- When updating a guide PDF, use Drive's **Manage versions → Upload new version** to keep the same file ID instead of uploading a new file.
- Deploying a `firebase.json` change requires `firebase deploy`; no build is needed unless page files also changed.

## Privacy policy

`/privacy` is a static page; the effective date is the `effectiveDate` constant at the top of `src/pages/privacy.astro`. Update it whenever the policy text changes. Added for Google Ad Grants.

## Content conventions

- **No em dashes** in blog and body copy (author preference). Use commas, colons, periods, or parentheses.
- **Keep locations generic** for animals, nests, and releases (anti-poaching). Never publish precise nesting, rescue, or release sites; the field guide and Turtle Watch use only already-public data.
- **Image filenames must be lowercase** (Firebase Hosting is case-sensitive even though macOS is not).
- Avoid affiliate links and other commercial content outside the Donate and Merch pages (Google Ad Grants).

## Notes

- Turtle Watch fetches live data from iNaturalist and the OpenStreetMap Overpass API — no build-time data, all client-side. Key constants (grid size, road proximity threshold, min cluster) are at the top of `src/pages/turtle-watch/index.astro`.
- Field guide species pages are generated with `getStaticPaths()` from `src/content/species/*.json`; photos load client-side from the iNaturalist API by taxon ID.
- Firebase serves the SPA fallback (`/index.html`) for unmatched paths, so a not-found URL returns the HTML 404 page.
- GitHub repos are under the `southeastreptile` org except `turtle-ai`, which is also forked there from lynnaloo. The org-wide GitHub Sponsors button is configured via `.github/FUNDING.yml` in the org's `.github` repo; the Software page embeds the GitHub Sponsors card.
