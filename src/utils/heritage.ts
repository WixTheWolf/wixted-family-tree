import type { Person } from "../types";

const HERITAGE_BY_PERSON: Record<string, string> = {
  "wixted-114-29": "matthew",
  "wixted-104-37": "kevin",
  "wixted-114-39": "katie",
};

/** Workbook Katie sheet — Mexican applies to Katie/Angela Amor line only. */
export function getHeritageKey(person: Person): string | null {
  return HERITAGE_BY_PERSON[person.id] ?? (person.isFocus ? "matthew" : null);
}
