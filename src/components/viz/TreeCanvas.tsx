"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { TreeVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

interface Placed {
  id: string;
  value: number;
  x: number;
  y: number;
  state: TreeVizState["nodes"][string]["state"];
}

/**
 * Lays the tree out by in-order position (x) and depth (y), which keeps
 * subtrees visually separate and never overlaps nodes.
 */
function layout(state: TreeVizState) {
  const placed: Placed[] = [];
  const edges: { from: Placed; to: Placed }[] = [];
  let counter = 0;
  let maxDepth = 0;

  const walk = (id: string | null, depth: number): Placed | null => {
    if (!id) return null;
    const node = state.nodes[id];
    if (!node) return null;
    const left = walk(node.left, depth + 1);
    const self: Placed = { id, value: node.value, x: counter++, y: depth, state: node.state };
    placed.push(self);
    maxDepth = Math.max(maxDepth, depth);
    const right = walk(node.right, depth + 1);
    if (left) edges.push({ from: self, to: left });
    if (right) edges.push({ from: self, to: right });
    return self;
  };

  walk(state.rootId, 0);
  return { placed, edges, columns: Math.max(1, counter), maxDepth };
}

export function TreeCanvas({ state }: { state: TreeVizState }) {
  const { placed, edges, columns, maxDepth } = layout(state);
  const colWidth = 56;
  const rowHeight = 74;
  const width = Math.max(columns * colWidth, 320);
  const height = (maxDepth + 1) * rowHeight + 20;
  const px = (x: number) => x * colWidth + colWidth / 2;
  const py = (y: number) => y * rowHeight + 34;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <VizCounters counters={state.counters} />

      {placed.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">empty tree</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <svg
            width={width}
            height={height}
            role="img"
            aria-label="Tree visualization"
            className="overflow-visible"
          >
            {edges.map((e, i) => (
              <line
                key={i}
                x1={px(e.from.x)}
                y1={py(e.from.y) + 4}
                x2={px(e.to.x)}
                y2={py(e.to.y) - 18}
                className="stroke-viz-edge"
                strokeWidth={1.75}
              />
            ))}
            {placed.map((n) => (
              <foreignObject key={n.id} x={px(n.x) - 22} y={py(n.y) - 22} width={44} height={44}>
                <div
                  className={cn(
                    "viz-state-motion viz-enter flex h-11 w-11 items-center justify-center rounded-full border font-mono text-sm",
                    CELL_CLASS[n.state],
                  )}
                  data-cell-state={n.state}
                  aria-label={`Node ${n.value}, ${CELL_LABEL[n.state]}`}
                >
                  {n.value}
                  <span aria-hidden className="ml-0.5 text-[9px] opacity-70">
                    {CELL_MARK[n.state]}
                  </span>
                </div>
              </foreignObject>
            ))}
          </svg>
        </div>
      )}

      {state.arrayView && (
        <div className="w-full max-w-2xl">
          <p className="mb-1.5 text-center text-[11px] tracking-wide text-muted-foreground uppercase">
            Array representation (parent i → children 2i+1, 2i+2)
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-1">
            {state.arrayView.values.map((v, i) => (
              <li key={i} className="flex flex-col items-center">
                <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
                <span
                  className={cn(
                    "flex h-9 w-10 items-center justify-center rounded border font-mono text-xs",
                    CELL_CLASS[state.arrayView!.states[i] ?? "default"],
                  )}
                >
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.output && state.output.length > 0 && (
        <p className="font-mono text-xs text-muted-foreground">
          {state.outputLabel ?? "output"}:{" "}
          <span className="text-foreground">{state.output.join(" → ")}</span>
        </p>
      )}

      <VizLegend states={placed.map((p) => p.state)} />
    </div>
  );
}
