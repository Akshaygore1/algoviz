"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { CharVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

/** Character-by-character string renderer with pointers and a side table. */
export function CharRow({ state }: { state: CharVizState }) {
  const { chars, pointers, counters, table, tableLabel, output } = state;
  const names = pointers ? Object.keys(pointers) : [];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <VizCounters counters={counters} />

      <ul
        className="flex max-w-full flex-wrap items-start justify-center gap-1"
        aria-label="String visualization"
      >
        {chars.map((c, i) => {
          const active = names.filter((n) => pointers?.[n] === i);
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
              <div
                className={cn(
                  "flex h-11 w-9 items-center justify-center rounded-md border font-mono text-sm font-medium transition-all duration-300",
                  CELL_CLASS[c.state],
                )}
                aria-label={`Index ${i}, character ${c.char}, ${CELL_LABEL[c.state]}`}
              >
                {c.char === " " ? "␣" : c.char}
              </div>
              <span
                aria-hidden
                className="h-3 font-mono text-[10px] leading-3 text-muted-foreground"
              >
                {CELL_MARK[c.state]}
              </span>
              <div className="flex h-4 flex-wrap items-start justify-center gap-1">
                {active.map((n) => (
                  <span
                    key={n}
                    className="rounded bg-primary/12 px-1 font-mono text-[10px] font-semibold text-primary"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {table && Object.keys(table).length > 0 && (
        <div className="w-full max-w-xl">
          <p className="mb-1.5 text-center text-[11px] tracking-wide text-muted-foreground uppercase">
            {tableLabel ?? "Map"}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {Object.entries(table).map(([k, v]) => (
              <span
                key={k}
                className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs"
              >
                {k === " " ? "␣" : k}
                <span className="text-muted-foreground"> → </span>
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {output && <p className="font-mono text-xs text-muted-foreground">{output}</p>}

      <VizLegend states={chars.map((c) => c.state)} />
    </div>
  );
}
