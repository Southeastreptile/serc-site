// Community events (fundraisers, cleanups, education events).
//
// Add events in any order; the helpers below sort them. `date` (and the
// optional `endDate`) must be ISO YYYY-MM-DD. Past events are filtered out at
// build time and also hidden in the browser the day after they end, so a stale
// event disappears for visitors right away, but a deploy is still needed to
// remove it from the HTML and JSON-LD and to publish new events.
//
// Optional fields: endDate, time, address, partners, url, urlLabel, image,
// imageAlt, type (fundraiser | cleanup | education | other).
export const events = [
  {
    title: 'Drink Beer. Save Turtles.',
    date: '2026-11-06',
    time: '6:00 to 9:00 PM',
    venue: 'Afterglow Brewing',
    address: '2330 Bowdens Ferry Rd, Ste 600',
    city: 'Norfolk',
    description:
      'A Turtle Survival Alliance fundraiser hosted with Afterglow Brewing. Come have a pint, meet the SERC team, and support native turtle rehabilitation.',
    partners: ['Afterglow Brewing', 'Turtle Survival Alliance'],
    image: '/images/drink-beer-save-turtles-2026.jpg',
    imageAlt: 'Drink Beer. Save Turtles. event flyer with turtles stacked beside a pint glass',
    type: 'fundraiser',
  },
];

// Today's date as local YYYY-MM-DD. Built from local getters on purpose:
// toISOString() is UTC and would roll the date over early in the evening.
export function todayLocalISO(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// The last calendar day an item is still "on". Works for events and talks.
export function lastDay(item) {
  return item.endDate || item.date;
}

// ISO strings compare correctly as plain strings, so no Date parsing needed.
// An item counts as upcoming through the end of its last day.
export function isUpcoming(item, today = todayLocalISO()) {
  const last = lastDay(item);
  return Boolean(last) && last >= today;
}

export function upcomingEvents(today = todayLocalISO()) {
  return events
    .filter((e) => isUpcoming(e, today))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// "November 6, 2026", or for ranges "November 6 to 8, 2026" /
// "November 30 to December 2, 2026". Parses parts manually so an ISO date is
// never treated as UTC midnight (which shifts the day in US time zones).
export function formatEventDate(iso, endIso) {
  const parse = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const fmt = (d, opts) => d.toLocaleDateString('en-US', opts);
  const start = parse(iso);
  if (!endIso || endIso === iso) {
    return fmt(start, { month: 'long', day: 'numeric', year: 'numeric' });
  }
  const end = parse(endIso);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${fmt(start, { month: 'long', day: 'numeric' })} to ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${fmt(start, { month: 'long', day: 'numeric' })} to ${fmt(end, { month: 'long', day: 'numeric', year: 'numeric' })}`;
}
