import type { NoteCategory, CategorizedNote } from "../types";

export const NOTE_LABELS: Record<NoteCategory, string> = {
  census: "Census Records",
  death: "Death & Burial",
  research: "Research",
  media: "Photos & Documents",
  immigration: "Immigration",
  marriage: "Marriage",
  occupation: "Occupation",
  location: "Places",
  narrative: "Life Story",
  general: "Notes",
};

export const NOTE_ORDER: NoteCategory[] = [
  "narrative",
  "research",
  "occupation",
  "immigration",
  "marriage",
  "census",
  "location",
  "death",
  "media",
  "general",
];

export function groupNotes(notes: CategorizedNote[]): Map<NoteCategory, string[]> {
  const groups = new Map<NoteCategory, string[]>();
  for (const { category, text } of notes) {
    const list = groups.get(category) ?? [];
    list.push(text);
    groups.set(category, list);
  }
  return groups;
}
