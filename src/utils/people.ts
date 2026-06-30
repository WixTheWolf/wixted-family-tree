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
  if (person.parentId) {
    const parent = allPeople.find((p) => p.id === person.parentId);
    if (parent) related.push(parent);
  }
  related.push(...allPeople.filter((p) => p.parentId === person.id));
  if (person.parentId) {
    related.push(
      ...allPeople.filter(
        (p) => p.parentId === person.parentId && p.id !== person.id
      )
    );
  }
  return related;
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
