"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { ListVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

/** Linked-list renderer: nodes, arrows and named pointers above each node. */
export function NodeChain({ state }: { state: ListVizState }) {
  const { nodes, variant, pointers, counters, floating } = state;
  const pointerNames = pointers ? Object.keys(pointers) : [];
  const doubly = variant === "doubly";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <VizCounters counters={counters} />

      {floating && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] text-muted-foreground">{floating.label}</span>
          <div className="flex h-12 w-14 items-center justify-center rounded-lg border border-viz-inspect bg-viz-inspect font-mono text-sm text-viz-inspect-fg">
            {floating.value}
          </div>
        </div>
      )}

      {nodes.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">head → null (empty list)</p>
      ) : (
        <ul
          className="flex max-w-full flex-wrap items-start justify-center gap-1"
          aria-label="Linked list"
        >
          {nodes.map((node, i) => {
            const active = pointerNames.filter((p) => pointers?.[p] === node.id);
            return (
              <li key={node.id} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-4 flex-wrap items-end justify-center gap-1">
                    {active.map((p) => (
                      <span
                        key={p}
                        className="rounded bg-primary/12 px-1 font-mono text-[10px] font-semibold text-primary"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <div
                    className={cn(
                      "flex h-12 w-14 items-center justify-center rounded-lg border font-mono text-sm font-medium transition-all duration-300",
                      CELL_CLASS[node.state],
                    )}
                    aria-label={`Node ${i}, value ${node.value}, ${CELL_LABEL[node.state]}`}
                  >
                    {node.value}
                  </div>
                  <span
                    aria-hidden
                    className="h-3 font-mono text-[10px] leading-3 text-muted-foreground"
                  >
                    {CELL_MARK[node.state]}
                  </span>
                </div>
                <span aria-hidden className="pb-4 font-mono text-xs text-muted-foreground">
                  {i === nodes.length - 1
                    ? variant === "circular"
                      ? "↺"
                      : "→ null"
                    : doubly
                      ? "⇄"
                      : "→"}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {pointerNames.some((p) => pointers?.[p] === null) && (
        <p className="font-mono text-[11px] text-muted-foreground">
          {pointerNames
            .filter((p) => pointers?.[p] === null)
            .map((p) => `${p} = null`)
            .join("  ·  ")}
        </p>
      )}

      <VizLegend states={nodes.map((n) => n.state)} />
    </div>
  );
}
