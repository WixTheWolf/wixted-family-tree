import type { Person, TreeNode } from "../types";

const CARD_W = 200;
const CARD_H = 88;
const GAP_X = 32;
const GAP_Y = 120;

export function buildTree(people: Person[]): TreeNode[] {
  const byId = new Map(people.map((p) => [p.id, p]));
  const childrenOf = new Map<string, Person[]>();

  for (const p of people) {
    if (p.parentId && byId.has(p.parentId)) {
      const list = childrenOf.get(p.parentId) ?? [];
      list.push(p);
      childrenOf.set(p.parentId, list);
    }
  }

  const roots = people.filter(
    (p) => !p.parentId || !byId.has(p.parentId)
  );

  function makeNode(person: Person): TreeNode {
    const kids = (childrenOf.get(person.id) ?? []).sort((a, b) => a.col - b.col);
    const childNodes = kids.map(makeNode);
    return { person, children: childNodes, x: 0, y: 0 };
  }

  return roots.sort((a, b) => a.col - b.col).map(makeNode);
}

function layoutNode(node: TreeNode, depth: number): number {
  node.y = depth * (CARD_H + GAP_Y);

  if (node.children.length === 0) {
    node.x = 0;
    return CARD_W + GAP_X;
  }

  let total = 0;
  for (const child of node.children) {
    total += layoutNode(child, depth + 1);
  }
  total -= GAP_X;

  let cursor = node.children[0].x;
  for (const child of node.children) {
    child.x = cursor;
    cursor += layoutSubtreeWidth(child) + GAP_X;
  }

  const first = node.children[0];
  const last = node.children[node.children.length - 1];
  node.x = (first.x + last.x + CARD_W) / 2 - CARD_W / 2;

  return Math.max(total, CARD_W + GAP_X);
}

function layoutSubtreeWidth(node: TreeNode): number {
  if (node.children.length === 0) return CARD_W;
  const first = node.children[0];
  const last = node.children[node.children.length - 1];
  return last.x + CARD_W - first.x;
}

export function layoutForest(roots: TreeNode[]): TreeNode[] {
  let offset = 0;
  for (const root of roots) {
    layoutNode(root, 0);
    shiftTree(root, offset);
    offset += layoutSubtreeWidth(root) + GAP_X * 2;
  }
  return roots;
}

function shiftTree(node: TreeNode, dx: number) {
  node.x += dx;
  for (const child of node.children) shiftTree(child, dx);
}

export function flattenTree(roots: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  function walk(n: TreeNode) {
    result.push(n);
    for (const c of n.children) walk(c);
  }
  for (const r of roots) walk(r);
  return result;
}

export function getConnections(roots: TreeNode[]): { x1: number; y1: number; x2: number; y2: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  function walk(n: TreeNode) {
    for (const c of n.children) {
      lines.push({
        x1: n.x + CARD_W / 2,
        y1: n.y + CARD_H,
        x2: c.x + CARD_W / 2,
        y2: c.y,
      });
      walk(c);
    }
  }
  for (const r of roots) walk(r);
  return lines;
}

export function getTreeBounds(roots: TreeNode[]): { width: number; height: number } {
  const flat = flattenTree(roots);
  if (!flat.length) return { width: 800, height: 600 };
  const maxX = Math.max(...flat.map((n) => n.x)) + CARD_W + 80;
  const maxY = Math.max(...flat.map((n) => n.y)) + CARD_H + 80;
  return { width: maxX, height: maxY };
}

export { CARD_W, CARD_H };