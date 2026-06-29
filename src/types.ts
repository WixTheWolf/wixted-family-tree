export interface Person {
  id: string;
  name: string;
  dates: string;
  notes: string[];
  col: number;
  row: number;
  branch: string;
  generation?: number;
  parentId?: string;
}

export interface CemeteryRecord {
  id: string;
  name: string;
  age: string;
  died: string;
  relation: string;
  location: string;
  born: string;
  notes: string;
}

export interface Branch {
  id: string;
  label: string;
  desc: string;
  count: number;
}

export interface FamilyData {
  meta: {
    title: string;
    version: string;
    updated: string;
    focus: string;
  };
  branches: Branch[];
  people: Person[];
  cemetery: CemeteryRecord[];
  heritage: Record<string, Record<string, number>>;
}

export interface TreeNode {
  person: Person;
  children: TreeNode[];
  x: number;
  y: number;
}