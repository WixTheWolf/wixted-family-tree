import type { FamilyData, Person, SearchResult } from "../types";
import { isPerson } from "./people";

function scoreMatch(text: string, query: string): number {
  const low = text.toLowerCase();
  const q = query.toLowerCase();
  if (low === q) return 100;
  if (low.startsWith(q)) return 80;
  const words = low.split(/\s+/);
  if (words.some((w) => w.startsWith(q))) return 60;
  if (low.includes(q)) return 40;
  return 0;
}

export function searchAll(data: FamilyData, query: string): SearchResult[] {
  if (query.length < 2) return [];
  const results: SearchResult[] = [];

  for (const p of data.people) {
    if (!isPerson(p)) continue;
    const searchText = p.searchText ?? `${p.name} ${p.dates} ${p.notes.join(" ")}`;
    const nameScore = scoreMatch(p.name, query) * 2;
    const textScore = scoreMatch(searchText, query);
    const score = Math.max(nameScore, textScore);
    if (score > 0) {
      const branch = data.branches.find((b) => b.id === p.branch);
      const snippet = p.notes.find((n) =>
        n.toLowerCase().includes(query.toLowerCase())
      );
      results.push({
        type: "person",
        id: p.id,
        title: p.name,
        subtitle: p.dates || branch?.label || "",
        branch: branch?.label,
        snippet,
        person: p,
      });
    }
  }

  for (const s of data.stories ?? []) {
    const text = `${s.title} ${s.body} ${s.tags.join(" ")}`;
    const score = scoreMatch(text, query);
    if (score > 0) {
      const branch = data.branches.find((b) => b.id === s.branch);
      results.push({
        type: "story",
        id: s.id,
        title: s.title,
        subtitle: branch?.label ?? "Story",
        branch: branch?.label,
        snippet: s.body.slice(0, 120),
        story: s,
      });
    }
  }

  for (const c of data.cemetery) {
    const text = `${c.name} ${c.location} ${c.notes} ${c.relation}`;
    const score = scoreMatch(text, query);
    if (score > 0) {
      results.push({
        type: "cemetery",
        id: c.id,
        title: c.name,
        subtitle: c.location || c.died || "Cemetery",
        snippet: c.notes || c.relation,
        cemetery: c,
      });
    }
  }

  for (const loc of data.locationRefs ?? []) {
    const text = `${loc.name} ${loc.notes.join(" ")}`;
    const score = scoreMatch(text, query);
    if (score > 0) {
      const branch = data.branches.find((b) => b.id === loc.branch);
      results.push({
        type: "location",
        id: loc.id,
        title: loc.name,
        subtitle: branch?.label ?? "Burial Location",
        branch: branch?.label,
        snippet: loc.notes[0],
      });
    }
  }

  return results
    .sort((a, b) => {
      const aExact = a.title.toLowerCase() === query.toLowerCase() ? 1 : 0;
      const bExact = b.title.toLowerCase() === query.toLowerCase() ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      if (a.type === "person" && b.type !== "person") return -1;
      if (b.type === "person" && a.type !== "person") return 1;
      return a.title.localeCompare(b.title);
    })
    .slice(0, 20);
}

export function findPersonById(data: FamilyData, id: string): Person | undefined {
  return data.people.find((p) => p.id === id);
}
