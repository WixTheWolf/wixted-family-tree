import { useRef, useState, useCallback, useEffect } from "react";
import type { Person } from "../types";
import {
  buildTree,
  buildDescendantTree,
  layoutForest,
  flattenTree,
  getConnections,
  getTreeBounds,
} from "../utils/tree";
import PersonCard from "./PersonCard";

interface Props {
  people: Person[];
  selectedId: string | null;
  highlightId: string | null;
  focusLine?: string[];
  treeRootId?: string;
  onSelect: (p: Person) => void;
}

export default function TreeView({
  people,
  selectedId,
  highlightId,
  focusLine,
  treeRootId,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const roots = layoutForest(
    treeRootId ? buildDescendantTree(treeRootId, people) : buildTree(people)
  );
  const nodes = flattenTree(roots);
  const lines = getConnections(roots);
  const bounds = getTreeBounds(roots);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom((z) => Math.min(2, Math.max(0.3, z * delta)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".person-card")) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  };

  const onMouseUp = () => setDragging(false);

  if (!people.length) {
    return (
      <div className="tree-empty">
        <p>No family members found in this branch.</p>
      </div>
    );
  }

  return (
    <div className="tree-container" ref={containerRef}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="tree-controls">
        <button onClick={() => setZoom((z) => Math.min(2, z * 1.2))} title="Zoom in">+</button>
        <button onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))} title="Zoom out">−</button>
        <button onClick={() => { setZoom(1); setPan({ x: 40, y: 40 }); }} title="Reset">⟲</button>
      </div>

      <svg
        width={bounds.width * zoom + 80}
        height={bounds.height * zoom + 80}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
      >
        {lines.map((l, i) => (
          <path
            key={i}
            d={`M${l.x1},${l.y1} C${l.x1},${l.y1 + 40} ${l.x2},${l.y2 - 40} ${l.x2},${l.y2}`}
            fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5"
          />
        ))}
        {nodes.map((n) => (
          <PersonCard
            key={n.person.id}
            person={n.person}
            x={n.x}
            y={n.y}
            selected={selectedId === n.person.id}
            highlighted={highlightId === n.person.id}
            onFocusLine={focusLine?.includes(n.person.id) ?? false}
            onClick={() => onSelect(n.person)}
          />
        ))}
      </svg>

      <style>{`
        .tree-container {
          position: relative; flex: 1; overflow: hidden;
          background: radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.06) 0%, transparent 60%);
          border-radius: var(--radius); border: 1px solid var(--border);
          min-height: 500px;
        }
        .tree-controls {
          position: absolute; bottom: 16px; right: 16px; z-index: 10;
          display: flex; gap: 4px;
          background: var(--bg-elevated); border-radius: 10px;
          padding: 4px; box-shadow: var(--shadow-md); border: 1px solid var(--border);
        }
        .tree-controls button {
          width: 32px; height: 32px; border-radius: 8px;
          font-size: 16px; color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .tree-controls button:hover { background: rgba(0,0,0,0.05); color: var(--text); }
        .tree-empty {
          flex: 1; display: flex; align-items: center; justify-content: center;
          color: var(--text-tertiary); font-size: 17px;
          min-height: 400px;
        }
      `}</style>
    </div>
  );
}