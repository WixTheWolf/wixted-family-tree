// Reads the same research data the website uses, so the video stays in sync
// with src/data/*.json at the repo root.
import ancestryLine from "../../src/data/ancestryLine.json";
import family from "../../src/data/family.json";

type Generation = (typeof ancestryLine.generations)[number];

const byName = (name: string): Generation => {
  const gen = ancestryLine.generations.find((g) => g.name === name);
  if (!gen) {
    throw new Error(`ancestryLine.json has no entry named "${name}"`);
  }
  return gen;
};

export type TreeRow = {
  people: Generation[];
  era: string;
  eraColor: string;
  location: string;
  // Short on-screen caption. Written for the video rather than reusing the
  // longer `detail` text, which is too long to read on screen.
  caption: string;
};

const row = (names: string[], caption: string, location?: string): TreeRow => {
  const people = names.map(byName);
  return {
    people,
    era: people[0].era,
    eraColor: people[0].eraColor,
    location: location ?? people[0].location,
    caption,
  };
};

// Oldest generation first.
export const TREE_ROWS: TreeRow[] = [
  row(
    ["Wixted of Tipperary"],
    "The Wixted name has been rooted in Tipperary since the 1600s — a blacksmith trade passed from father to son.",
  ),
  row(
    ["Thomas James Wixted", "Mary Hogan"],
    "Thomas James and Irish-born Mary Hogan — patriarchs of the American Wixted line.",
    "Lambeth, London",
  ),
  row(
    ["Henry Wixted"],
    "Son of Thomas and Mary, documented in the Corning censuses from 1855 to 1880.",
  ),
  row(
    ["Henry Joseph Wixted"],
    "Corning-born in the Erie Railroad era, traced by census from 1870.",
  ),
  row(
    ["Bruce John Wixted", "Evelyn Ruth Jones"],
    "They carried the Wixted name west — to Phoenix in 1963, then Orange County in 1971.",
  ),
  row(
    ["Daniel Scott Wixted", "Mary Joan (Tracy) Wixted"],
    "Daniel of Rochester and Mary Joan of Whittier raised the California generation.",
    "Rochester, NY → Whittier, CA",
  ),
  row(
    ["Matthew Scott Wixted"],
    "Generation 10 — with younger brothers Ryan and Alexander.",
  ),
];

const eraColor = (era: string) =>
  ancestryLine.generations.find((g) => g.era === era)?.eraColor ?? "#c5a059";

export type JourneyStop = {
  place: string;
  note: string;
  color: string;
};

export const JOURNEY_STOPS: JourneyStop[] = [
  { place: "Tipperary", note: "Ireland", color: eraColor("Ireland") },
  { place: "Lambeth", note: "London", color: eraColor("London") },
  { place: "Corning", note: "New York", color: eraColor("Corning") },
  { place: "Rochester", note: "New York", color: eraColor("New York") },
  { place: "Phoenix", note: "Arizona · 1963", color: eraColor("California") },
  { place: "Orange County", note: "California · 1971", color: eraColor("California") },
];

export const PERSON_COUNT = family.meta.personCount ?? family.people.length;

export const BRANCHES = [...family.branches].sort((a, b) => b.count - a.count);

const HERITAGE_COLORS: Record<string, string> = {
  english: "#b07aff",
  irish: "#50c878",
  swedish: "#4a9eff",
  german: "#e8a849",
  mexican: "#ff6b6b",
};

export const HERITAGE = Object.entries(family.heritage.matthew)
  .map(([key, share]) => ({
    label: key[0].toUpperCase() + key.slice(1),
    share,
    color: HERITAGE_COLORS[key] ?? "#c5a059",
  }))
  .sort((a, b) => b.share - a.share);
