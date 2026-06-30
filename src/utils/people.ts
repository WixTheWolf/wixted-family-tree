import type { Person, Branch, FamilyData } from "../types";

export function isPerson(p: Person): boolean {
  return (p.recordType ?? "person") === "person";
}

export function getPeople(data: FamilyData): Person[] {
  return data.people.filter(isPerson);
}

export function getBranchPeople(data: FamilyData, branchId: string): Person[] {
  return data.people.filter((p) => p.branch === branchId && isPerson(p));
}

export function getBranchLabel(branches: Branch[], branchId: string): string {
  return branches.find((b) => b.id === branchId)?.label ?? branchId;
}

export function getRelatives(person: Person, allPeople: Person[]): Person[] {
  const related: Person[] = [];
  const seen = new Set<string>();

  const add = (p?: Person) => {
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      related.push(p);
    }
  };

  if (person.parentId) add(allPeople.find((p) => p.id === person.parentId));
  if (person.motherId) add(allPeople.find((p) => p.id === person.motherId));

  for (const p of allPeople) {
    if (p.parentId === person.id || p.motherId === person.id) add(p);
  }

  if (person.parentId) {
    for (const p of allPeople) {
      if (p.parentId === person.parentId && p.id !== person.id) add(p);
    }
  }

  for (const sid of person.spouseIds ?? []) add(allPeople.find((p) => p.id === sid));
  for (const sid of person.exSpouseIds ?? []) add(allPeople.find((p) => p.id === sid));

  return related;
}

export function getInnerCircle(rootId: string, allPeople: Person[]): Person[] {
  const root = allPeople.find((p) => p.id === rootId);
  if (!root) return [];

  const ids = new Set<string>([rootId]);

  const collect = (id?: string) => {
    if (id) ids.add(id);
  };

  collect(root.parentId);
  collect(root.motherId);

  for (const id of root.spouseIds ?? []) collect(id);
  for (const id of root.exSpouseIds ?? []) collect(id);

  for (const p of allPeople) {
    if (p.parentId === root.parentId && p.id !== root.id && root.parentId) ids.add(p.id);
  }

  for (const p of allPeople) {
    if (p.parentId === root.id || p.motherId === root.id) ids.add(p.id);
  }

  const ryan = allPeople.find((p) => p.id === "wixted-114-31");
  if (ryan) {
    ids.add(ryan.id);
    for (const id of ryan.exSpouseIds ?? []) collect(id);
    for (const id of ryan.childIds ?? []) collect(id);
  }

  return allPeople.filter((p) => ids.has(p.id));
}

export function isOnFocusLine(personId: string, focusLine?: string[]): boolean {
  return focusLine?.includes(personId) ?? false;
}

export function getLastName(name: string): string {
  const cleaned = name.replace(/\([^)]*\)/g, "").trim();
  const parts = cleaned.split(/[\s\-]+/);
  return (parts[parts.length - 1] || "#").replace(/[^A-Za-z]/g, "") || "#";
}

export function groupByLetter(people: Person[]): Map<string, Person[]> {
  const groups = new Map<string, Person[]>();
  const sorted = [...people].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
  for (const p of sorted) {
    const letter = getLastName(p.name).charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  }
  return groups;
}
