# SERC Site

Astro 6 static site for Southeastern Reptile Conservation (southeastreptile.org), a Virginia 501(c)(3) rehabilitating native reptiles and amphibians in Hampton Roads. Firebase Hosting (site `serc-website-d2ac4`, public dir `dist`).

## Build and deploy

- Node >= 22.12. If local `node` is broken, `export PATH="/opt/homebrew/Cellar/node/26.5.0/bin:$PATH"`.
- `npm run dev` (localhost:4321), `npm run build` (to `dist/`), `firebase deploy --only hosting --project serc-website-d2ac4`.
- Deploys are manual. `.github/workflows/deploy.yml` will auto-deploy on push to `main` once the `FIREBASE_SERVICE_ACCOUNT` secret exists (`firebase init hosting:github`). Project ID is `serc-website-d2ac4`, not the display name `serc-website`.
- `CLAUDE.md` is gitignored; `AGENTS.md` is its committed mirror. Keep them identical (`cp CLAUDE.md AGENTS.md`).

## Structure

- `src/layouts/Layout.astro`: nav, footer, `<head>` (SEO meta, JSON-LD, GA4), date guard script.
- `src/pages/`: one file per page; blog posts in `src/pages/blog/`.
- `src/data/posts.js`: blog metadata, newest first (blog index + homepage feature).
- `src/data/events.js`: events with ISO dates plus date helpers (`/events`, homepage banner and card).
- `src/content/species/*.json`: field guide data (turtles, snakes, frogs-toads, salamanders), each with `inatTaxonId`. Loaded by direct import, not content collections.
- `src/styles/global.css`: all design tokens and shared classes (`.btn*`, `.post-card*`, `.tag`, `.section`). Pages use inline styles or a scoped `<style>` block.
- `public/images/`: images (lowercase filenames). `public/guides/`: self-hosted PDFs (e.g. `separc-2026-terrapin-poster.pdf`).

## Pages and nav

Home, About (with Speaking and outreach), Our rehabilitators (`/rehabilitators`), Our patients (`/wildlife`), Field guide (`/species`, `/species/[id]`), Turtle Watch, Software (`/open-source`), Blog, Events, Volunteer, Rehabber resources (noindex), Contact, Donate, Merch, Triage, Intake, Privacy, Sign up (`/signup`, email list), Get permitted (noindex, unlisted), 404.

Nav: Home · About ▾ (About us, Our rehabilitators, Events, Volunteer, For rehabbers) · Our patients · Field guide ▾ (Species ID, Turtle Watch) · Software · Blog · Contact, plus a Support ▾ button (Donate, Merch). Software and Blog stay top-level on purpose. Below 1200px the links collapse to the hamburger (icons and Support stay); below 768px those hide too. A new top-level item adds ~100px and a new social icon ~30px; prefer a dropdown, and re-measure before adding either. Social icons: iNaturalist, Instagram, YouTube, X, Facebook (also listed in the homepage and contact `sameAs`). Footer links Email updates (`/signup`), Rehabber resources, and Privacy.

## Conventions

- **No em dashes** in body copy. Use commas, colons, periods, parentheses.
- **Never use the word "roadkill."** Say "hit by car" or "car strike"; it reads as disturbing to our audience.
- **Keep animal locations generic** (nests, rescues, releases): anti-poaching. City or county level at most. Venue addresses for public events are fine.
- **Lowercase image and file names** (hosting is case-sensitive).
- **Run `npm run images` after adding photos.** It resizes anything in `public/images` wider than 2000px and recompresses files over 400 KB in place (`scripts/optimize-images.mjs`, uses sharp). Camera-sized originals tanked mobile Lighthouse (6.5 MB hero, LCP 39 s). Images are cached for 30 days, so renaming a replaced image is safer than overwriting it.
- **No affiliate or commercial links** outside Donate, Merch, and the noindexed rehabber page (Google Ad Grants). The Chewy storefront link there pays a commission, so it carries `rel="sponsored"` and a disclosure.
- SERC accepts **venomous snakes** (coordinated with DWR and partner handlers); do not add copy saying otherwise.
- Titles get ` | SERC` appended unless they already contain "SERC". Pass `noindex={true}` for unlisted pages; also add them to the sitemap `filter` in `astro.config.mjs`.

## Layout features

- GA4 `G-N186ZPKTJC` with a delegated click tracker: `event_link_click` (`data-track="event-link"`, carries `event_title`), `donate_click` (Donate/Zeffy/PayPal/Venmo/Bonfire), `wishlist_click` (Amazon/Chewy/Walmart), `text_click`, `email_click`, `contact_submit`. The WRMD intake iframe is not tracked.
- Date guard (inline script after `<main>`): hides any `[data-hide-after="YYYY-MM-DD"]` once that local day passes and reveals `[data-empty-for="<list id>"]` when its list is empty. Used by events and the "Upcoming" pill on talks.
- `<head>` has robots, geo, canonical, OG/Twitter (`twitter:site` @purringturtle), and an `impact-site-verification` meta.

## Content recipes

- **Blog post**: create `src/pages/blog/<slug>.astro` from an existing post; add an entry to the top of `src/data/posts.js`.
- **Event**: add to `src/data/events.js` (`title`, ISO `date`, `venue`, `city`, `description`; optional `endDate`, `time`, `address`, `partners[]`, `url` + `urlLabel`, `image` + `imageAlt`, `type`). Upcoming events render in full; the homepage shows the soonest as a banner above the hero and a card below the Donate band. When nothing is upcoming the homepage banner becomes a standing "Found an injured animal? Text us" strip (sms link, tracked as `text_click`). Past events move to a compact "Past events" archive on `/events` (`SHOW_PAST`, `pastEvents()`), filtered at build and hidden client-side the next day; a deploy is still needed to publish new ones or swap the banner. Each event emits `Event` JSON-LD on `/events`.
- **Talk**: edit `talks` at the top of `src/pages/about.astro` (`event`, `format`, ISO `date` or `date: null` + `year`, optional `eventFull`, `title`, `titleHtml` for italic binomials, `time`, `location`, `url` + `urlLabel`). Newest first; future dates get an "Upcoming" pill.
- **Press**: edit `press` in `src/pages/about.astro` (`title`, `outlet`, ISO `date`, `url`, optional `author`, `note`). Renders as "In the news" (`/about#press`) under Speaking and outreach, newest first.
- **Short link**: add a 302 to the `redirects` block in `firebase.json` (regex with optional trailing slash) and deploy; no build needed. Current: `/chewy`, `/venmo`, `/slack`, `/guides/box-turtle-headstart` (Drive PDF), `/talks/bsides-2026` (Google Slides); `/newsletter` and `/subscribe` 301 to `/signup`. Share the short link, never the raw URL. For Drive PDFs, replace the file via Manage versions to keep the ID. Self-hosted PDFs go in `public/guides/` and are linked directly.

## Page notes

- **Intake** (`/intake`): WRMD public report form in an iframe plus `wrmd.org/embed/v1/resize.js`. Submissions go to WRMD; nothing is stored here. Pre/post-submit messages are configured in WRMD. WRMD only serves the embed to the registered domain (a 404 in the iframe means the domain is not registered). Linked only from the Contact page; the homepage and triage page intentionally do not link it. Small print under the form links to `/privacy#animal-reports`.
- **Privacy** (`/privacy`): `effectiveDate` constant at top; update when text changes. The `#animal-reports` section states intake data commitments (locations never published, reports seen only by permitted rehabilitators, records in WRMD, DWR gets species and counts in the annual report and may inspect full records on request). Keep the intake small print consistent with it.
- **Sign up** (`/signup`): email-list page for event sign-in sheets and QR codes. `SIGNUP_FORM_URL` constant at top takes the embed URL of the sign-up form from the email tool (Google Forms, Mailchimp, Zeffy); while empty, the page shows a mailto button with a prefilled subject so the link always works. Promise is updates a few times a year, no spam, unsubscribe any time; keep copy consistent. Promoted from the homepage band after the blog feature, the Events page footer line, and the Contact sidebar. Privacy `#email-updates` bullet covers the list (updates only, never shared, unsubscribe any time).
- **Get permitted** (`/get-permitted`): unlisted six-part guide to Virginia's permit categories for prospective volunteers; casual herp-focused voice (Linda's), sections are a JS click-through that lands on the header overview (no part open until the reader picks one; `#step-N` and `#cat-*` hashes deep-link), all visible without JS. Facts come from the DWR Permit Conditions PDF (`CONDITIONS_DATE` constant) and 4VAC15-30-50; re-check each January. Opens with three quick-path links: no-permit start (to `/volunteer#transporters`), in-home rehab (Cat I to II, six months Cat IV first), and hands-on-without-home (Cat IV, the most common ask). Transporter designation: keep it vague; the reg says "in writing" but DWR accepts a standing transport group or bulk designation, so never promise individual written designations. Virginia has no 24-hour "Good Samaritan" holding rule for the unlicensed public; do not add one. Licensees are different: Cat I and Cat II may house animals outside their permit up to 24 hours with advance authorization and instructions, and Cat IV holds at the permitted facility; the page says this under "bridge, not destination." Category II requires two years of permitted experience, with Category IV time counting; Category IV can also request a direct upgrade to IIA after two years at the same facility (no apprentice step; note the conditions PDF says II-B, Linda confirmed IIA in practice). Category I's "uninjured or orphaned" is explained as hatchlings and incubated/rescued eggs. Residency: students at Virginia schools with a temporary Virginia address count for Categories I to III. Patient records and the Feb 1 annual report are Cat I and Cat II duties shown on their level cards, not in Part 4 (Category IVs are covered by the facility's records; they still owe CE certificates and renewals). Application steps stay in email.
- **Our rehabilitators** (`/rehabilitators`): `people` array at top (name, `funTitle`, `roles[]`, `city`, `image`, `imageAlt`, `focus` for object-position). Card photos are 1000x1250 crops (`linda-card.jpg`, `regan-card.jpg`, `johnnae-card.jpg`, `ainsley-card.jpg`, `emma-card.jpg`) made with sharp from the originals; new headshots should match that frame and the same mild desaturation. Intentionally minimal: no permit categories, no bios. Fun titles are part of the voice (Chief Shell Officer, Hurt Turt Wizard).
- **Volunteer** (`/volunteer`): public page, opens "Turtle Uber drivers wanted" with the Toano release photo (`/images/toano.jpg`, also the OG image; was 8.5 MB, resized to 612 KB). Transporter-first, framed as our biggest need because it frees in-home rehabbers from leaving jobs and patients for pickups and vet runs; no permit required (4VAC15-30-50 plus rehabilitator designation, worded vaguely since DWR accepts group/bulk transporter coverage, animal stays secured). Other ways to help: fundraising and sharing. Closes with "Interested in becoming a permitted rehabilitator?" linking to `/contact` (the permit guide `/get-permitted` stays unlisted: never link it, offer it by email).
- **Rehabber resources** (`/rehabber-resources`): Chewy storefront link (`CHEWY_STOREFRONT_URL`), guides, and a hidden Drive library behind `SHOW_LIBRARY`.
- **Turtle Watch**: client-side map from iNaturalist and OpenStreetMap Overpass; constants at the top of `src/pages/turtle-watch/index.astro`.
- **Field guide**: species pages via `getStaticPaths()`; photos load client-side from iNaturalist by taxon ID.
- Firebase rewrites unmatched paths to `/index.html`, so unknown URLs render the 404 page.
- GitHub repos live under the `southeastreptile` org (`turtle-ai` is forked from lynnaloo). Org-wide Sponsors button is in the org `.github` repo's `FUNDING.yml`; the Software page embeds the Sponsors card.
