"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { StackVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

/** Stack renderer: grows upward, top of the stack labelled. */
export function StackColumn({ state }: { state: StackVizState }) {
  const { items, counters, output } = state;
  const top = items.length - 1;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <VizCounters counters={counters} />

      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[11px] text-muted-foreground">
          {items.length === 0 ? "empty · top = null" : `top → index ${top}`}
        </span>
        <ul
          className="flex min-h-[180px] w-40 flex-col-reverse items-stretch justify-start gap-1 rounded-b-xl border-x-2 border-b-2 border-border p-1.5"
          aria-label="Stack visualization"
        >
          {items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "viz-state-motion viz-enter flex h-10 items-center justify-between gap-2 rounded-md border px-3 font-mono text-sm",
                CELL_CLASS[item.state],
              )}
              data-cell-state={item.state}
              aria-label={`Index ${i}, value ${item.value}, ${CELL_LABEL[item.state]}`}
            >
              <span>{item.value}</span>
              <span aria-hidden className="text-[10px] opacity-70">
                {CELL_MARK[item.state] || i}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {output !== undefined && output !== "" && (
        <p className="font-mono text-xs text-muted-foreground">
          output: <span className="text-foreground">{output}</span>
        </p>
      )}

      <VizLegend states={items.map((i) => i.state)} />
    </div>
  );
}
