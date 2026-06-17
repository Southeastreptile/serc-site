# SERC Marketing & SEO To-Do (off-code actions)

Prioritized actions that live outside the codebase. The on-page/technical SEO is
handled in the site itself — these are the things only you can do.

_Based on GA4 data (May 18 – Jun 14, 2026): 46 users, 83 sessions, 38.55% engagement
rate, **1 organic session**, **0 key events configured**. The core problem is search
visibility (96% direct traffic) and no conversion tracking._

---

## 🔴 Do first — why we have almost no organic traffic

- [ ] **Mark GA4 key events** (5 min). GA4 → Admin → Events → "Mark as key event" for
  `donate_click`, `text_click`, `email_click`, `contact_submit`. Tracking is live in code
  but reads 0 conversions until these are flagged. (Or pre-create them under Admin → Key events.)
- [x] **Create a Google Business Profile** ✅ DONE. — populates the Google map pack for
  "turtle rescue near me." Follow-ups now unblocked:
  - [X] Confirm service area lists all 7 cities (Virginia Beach, Norfolk, Chesapeake,
    Newport News, Hampton, Portsmouth, Suffolk) and category is "Wildlife rehabilitation service."
  - [X] Confirm NAP matches the site exactly: name "Southeastern Reptile Conservation,"
    website southeastreptile.org, text number 757-324-3720.
  - [ ] Add patient photos + a few posts (GBP rewards active profiles).
  - [ ] Start collecting Google reviews (see below — now unblocked).
- [ ] **Confirm indexing in Search Console.** Pages report → all ~80 indexed (not
  "Discovered – not indexed"). URL-inspect the homepage and /triage → Request indexing.
  Check Performance for impressions on "Hampton Roads," "turtle rescue," etc.

## 🟡 Do next — build authority so we rank

- [ ] **Get listed in rehabber directories** (these are backlinks + real referral traffic):
  - Virginia DWR licensed wildlife rehabilitator directory
  - Animal Help Now (ahnow.org) — national "found wildlife" emergency referral database
  - Local Hampton Roads city / SPCA / nature center wildlife resource pages
- [ ] **Verify iNaturalist profile** — southeastreptile.org is in the profile URL and the
  journal post is published (quality backlink already set up).
- [ ] **Collect Google reviews** (GBP is live ✅ — now unblocked). Ask people you've
  helped, volunteers, and partners. Major local-ranking factor and builds trust for the
  next person searching in an emergency.

## 🟢 Ongoing — compounding reach & engagement

- [ ] **Publish blog posts on a cadence** (Claude formats; you supply content). Each post
  is a new search entry point. High-value topics: "what to do if you find a box turtle in
  your yard," "Virginia copperhead vs. ratsnake," "Virginia turtle nesting season."
- [ ] **Instagram (@purringturtle)** — keep the site link in bio; occasionally post the
  /triage link. This is the warm audience that's currently ~96% of traffic.
- [ ] **After 2–3 weeks of conversion data,** review GA4 key events to see which paths
  convert (donate vs. text vs. contact) and where to push.

---

## Reference

- **GA4 measurement ID:** G-N186ZPKTJC
- **Custom events now tracked site-wide** (Layout.astro): `donate_click`, `text_click`,
  `email_click`, `contact_submit`
- **Service-area cities:** Virginia Beach, Norfolk, Chesapeake, Newport News, Hampton,
  Portsmouth, Suffolk (Hampton Roads / Southeastern Virginia)
- **Contact:** text 757-324-3720 (text only — Google Voice), info@southeastreptile.org
- **Referrals for animals we can't take:** venomous → Virginia DWR; sea turtles → VAST
  757-385-7575; birds/mammals → 757-255-8710
