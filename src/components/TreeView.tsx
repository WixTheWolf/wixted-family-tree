import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import type { Person } from "../types";
import { buildTree, layoutForest, flattenTree, getConnections, getTreeBounds } from "../utils/tree";
import PersonCard from "./PersonCard";

interface Props {
  people: Person[];
  selectedId: string | null;
  highlightId: string | null;
  focusLine?: string[];
  onSelect: (p: Person) => void;
}

export default function TreeView({ people, selectedId, highlightId, focusLine, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const roots = layoutForest(buildTree(people));
  const nodes = flattenTree(roots);
  const lines = getConnections(roots);
  const bounds = getTreeBounds(roots);
  const focusPeople = new Set(focusLine ?? []);
  const focusEdges = new Set(
    (focusLine ?? []).slice(1).map((id, idx) => `${focusLine?.[idx]}-${id}`)
  );

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
        className="tree-canvas"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
      >
        <defs>
          <linearGradient id="tree-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(201, 162, 39, 0.9)" />
            <stop offset="100%" stopColor="rgba(74, 158, 255, 0.72)" />
          </linearGradient>
          <filter id="tree-line-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((l, i) => {
          const isFocusEdge = focusEdges.has(`${l.fromId}-${l.toId}`);
          const touchesSelected = selectedId === l.fromId || selectedId === l.toId;

          return (
            <motion.path
            key={i}
            d={`M${l.x1},${l.y1} C${l.x1},${l.y1 + 40} ${l.x2},${l.y2 - 40} ${l.x2},${l.y2}`}
            fill="none"
            className={`tree-line ${isFocusEdge ? "focus" : ""} ${touchesSelected ? "selected" : ""}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isFocusEdge ? 1 : touchesSelected ? 0.9 : 0.42 }}
            transition={{ duration: 0.55, delay: Math.min(i * 0.012, 0.35), ease: "easeOut" }}
          />
          );
        })}
        {nodes.map((n) => (
          <PersonCard
            key={n.person.id}
            person={n.person}
            x={n.x}
            y={n.y}
            selected={selectedId === n.person.id}
            highlighted={highlightId === n.person.id}
            onFocusLine={focusPeople.has(n.person.id)}
            onClick={() => onSelect(n.person)}
          />
        ))}
      </svg>

      <style>{`
        .tree-container {
          position: relative; flex: 1; overflow: hidden;
          background:
            radial-gradient(ellipse at 20% 0%, rgba(201,162,39,0.12) 0%, transparent 44%),
            radial-gradient(ellipse at 80% 28%, rgba(74,158,255,0.08) 0%, transparent 50%),
            linear-gradient(180deg, rgba(255,255,255,0.025), transparent 38%);
          border-radius: var(--radius); border: 1px solid var(--border);
          min-height: 540px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), var(--shadow-sm);
        }
        .tree-canvas { overflow: visible; }
        .tree-line {
          stroke: rgba(232, 197, 71, 0.36);
          stroke-width: 1.75;
          stroke-linecap: round;
          vector-effect: non-scaling-stroke;
        }
        .tree-line.selected {
          stroke: rgba(74, 158, 255, 0.68);
          stroke-width: 2.25;
        }
        .tree-line.focus {
          stroke: url(#tree-line-gradient);
          stroke-width: 3;
          filter: url(#tree-line-glow);
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
        .tree-controls button:hover { background: rgba(201,162,39,0.1); color: var(--text); }
        .tree-empty {
          flex: 1; display: flex; align-items: center; justify-content: center;
          color: var(--text-tertiary); font-size: 17px;
          min-height: 400px;
        }
      `}</style>
    </div>
  );
}