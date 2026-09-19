"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { CallTreeNode } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS } from "./cellStyles";

interface Placed extends CallTreeNode {
  x: number;
  depth: number;
}

/**
 * Lays the recursion tree out by depth (y) and leaf order (x), so sibling
 * subtrees never overlap and the shape of the recursion is obvious.
 */
function layout(nodes: CallTreeNode[]) {
  const children = new Map<string | null, CallTreeNode[]>();
  for (const node of nodes) {
    const list = children.get(node.parentId) ?? [];
    list.push(node);
    children.set(node.parentId, list);
  }

  const placed: Placed[] = [];
  const byId = new Map<string, Placed>();
  let leaf = 0;

  const walk = (node: CallTreeNode, depth: number): number => {
    const kids = children.get(node.id) ?? [];
    let x: number;
    if (kids.length === 0) {
      x = leaf++;
    } else {
      const xs = kids.map((k) => walk(k, depth + 1));
      x = (Math.min(...xs) + Math.max(...xs)) / 2;
    }
    const self: Placed = { ...node, x, depth };
    placed.push(self);
    byId.set(node.id, self);
    return x;
  };

  for (const root of children.get(null) ?? []) walk(root, 0);

  const edges = placed
    .filter((n) => n.parentId && byId.has(n.parentId))
    .map((n) => ({ from: byId.get(n.parentId!)!, to: n }));

  const maxDepth = placed.reduce((m, n) => Math.max(m, n.depth), 0);
  return { placed, edges, columns: Math.max(1, leaf), maxDepth };
}

export function CallTree({ nodes }: { nodes: CallTreeNode[] }) {
  const { placed, edges, columns, maxDepth } = layout(nodes);
  const colWidth = 130;
  const rowHeight = 66;
  const width = Math.max(columns * colWidth, 320);
  const height = (maxDepth + 1) * rowHeight + 16;
  const px = (x: number) => x * colWidth + colWidth / 2;
  const py = (d: number) => d * rowHeight + 24;

  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Recursion tree</p>
      <div className="max-w-full overflow-auto rounded-lg border border-border bg-card p-2">
        {placed.length === 0 ? (
          <p className="py-16 text-center font-mono text-xs text-muted-foreground">no calls yet</p>
        ) : (
          <svg width={width} height={height} role="img" aria-label="Recursion tree">
            {edges.map((e, i) => (
              <line
                key={i}
                x1={px(e.from.x)}
                y1={py(e.from.depth) + 14}
                x2={px(e.to.x)}
                y2={py(e.to.depth) - 14}
                className="stroke-viz-edge"
                strokeWidth={1.75}
              />
            ))}
            {placed.map((n) => (
              <foreignObject
                key={n.id}
                x={px(n.x) - 58}
                y={py(n.depth) - 15}
                width={116}
                height={34}
              >
                <div
                  className={cn(
                    "viz-state-motion viz-enter flex h-[30px] items-center justify-center gap-1 rounded-md border px-1.5 font-mono text-[11px] whitespace-nowrap",
                    CELL_CLASS[n.state],
                  )}
                  data-cell-state={n.state}
                  aria-label={`${n.label}, ${CELL_LABEL[n.state]}${n.result ? `, returns ${n.result}` : ""}`}
                >
                  <span className="truncate">{n.label}</span>
                  {n.result !== undefined && <span className="opacity-80">= {n.result}</span>}
                  {n.note && (
                    <span
                      aria-hidden
                      className="rounded-sm border px-1 text-[8px] uppercase opacity-80"
                    >
                      {n.note}
                    </span>
                  )}
                </div>
              </foreignObject>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
