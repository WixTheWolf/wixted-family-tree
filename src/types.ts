export type RecordType = "person" | "location" | "narrative";
export type NoteCategory =
  | "census"
  | "death"
  | "research"
  | "media"
  | "immigration"
  | "marriage"
  | "occupation"
  | "location"
  | "narrative"
  | "general";

export interface CategorizedNote {
  category: NoteCategory;
  text: string;
}

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
  motherId?: string;
  spouseIds?: string[];
  exSpouseIds?: string[];
  childIds?: string[];
  birthDate?: string;
  age?: string;
  isFocus?: boolean;
  recordType?: RecordType;
  categorizedNotes?: CategorizedNote[];
  searchText?: string;
}

export interface Story {
  id: string;
  title: string;
  body: string;
  personIds: string[];
  branch: string;
  tags: string[];
  source: string;
}

export interface LocationRef {
  id: string;
  name: string;
  branch: string;
  notes: string[];
  relatedPersonIds: string[];
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
    enriched?: boolean;
    personCount?: number;
    storyCount?: number;
    rootPersonId?: string;
    focusLine?: string[];
  };
  branches: Branch[];
  people: Person[];
  cemetery: CemeteryRecord[];
  heritage: Record<string, Record<string, number>>;
  stories?: Story[];
  locationRefs?: LocationRef[];
}

export interface TreeNode {
  person: Person;
  children: TreeNode[];
  x: number;
  y: number;
}

export interface SearchResult {
  type: "person" | "story" | "cemetery" | "location";
  id: string;
  title: string;
  subtitle: string;
  branch?: string;
  snippet?: string;
  person?: Person;
  story?: Story;
  cemetery?: CemeteryRecord;
}

export type AssetType = "photo" | "document" | "headstone" | "obituary" | "census" | "other";

export interface FamilyAsset {
  id: string;
  personId: string;
  personName?: string;
  title: string;
  type: AssetType;
  url: string;
  caption?: string;
  uploadedBy?: string;
  addedAt?: string;
  source: "site" | "local" | "cloud";
  mimeType?: string;
}

export interface ContributionDraft {
  id: string;
  personId: string;
  personName: string;
  title: string;
  type: AssetType;
  caption: string;
  uploadedBy: string;
  fileName: string;
  mimeType: string;
  blob: Blob;
  createdAt: string;
}
