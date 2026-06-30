export function parseBirthDate(person: {
  birthDate?: string;
  dates?: string;
  notes?: string[];
}): Date | null {
  if (person.birthDate) {
    const d = new Date(person.birthDate + "T12:00:00");
    if (!isNaN(d.getTime())) return d;
  }

  const sources = [person.dates ?? "", ...(person.notes ?? [])];
  for (const text of sources) {
    if (/age\s*(today|e today)/i.test(text)) continue;

    let m = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    if (m) {
      let [, mo, day, yr] = m;
      let y = parseInt(yr, 10);
      if (y < 100) y += y > 30 ? 1900 : 2000;
      const d = new Date(y, parseInt(mo, 10) - 1, parseInt(day, 10));
      if (!isNaN(d.getTime())) return d;
    }

    m = text.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

export function computeAge(birth: Date, asOf = new Date()): string {
  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  if (asOf.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 2) {
    const totalMonths =
      (asOf.getFullYear() - birth.getFullYear()) * 12 +
      (asOf.getMonth() - birth.getMonth()) -
      (asOf.getDate() < birth.getDate() ? 1 : 0);
    return totalMonths === 1 ? "1 month" : `${totalMonths} months`;
  }

  if (months === 0) return years === 1 ? "1 year" : `${years} years`;
  return `${years}.${Math.round((months / 12) * 10)} years`;
}

export function getPersonAge(person: {
  age?: string;
  birthDate?: string;
  dates?: string;
  notes?: string[];
}): string | null {
  if (person.age) return person.age;
  const birth = parseBirthDate(person);
  return birth ? computeAge(birth) : null;
}

export function filterDisplayNotes(notes: string[]): string[] {
  return notes.filter(
    (n) =>
      !/age\s*(today|e today)/i.test(n) &&
      !/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(n.trim())
  );
}
