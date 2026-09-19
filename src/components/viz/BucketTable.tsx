"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { HashVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

/** Hash table renderer: buckets with chained entries. */
export function BucketTable({ state }: { state: HashVizState }) {
  const { buckets, counters, probe, output } = state;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <VizCounters counters={counters} />

      {probe && (
        <p className="font-mono text-xs text-muted-foreground">
          hash("{probe.key}") ={" "}
          <span className="text-foreground">{probe.hash === null ? "…" : probe.hash}</span>
        </p>
      )}

      <ul className="w-full max-w-lg space-y-1.5" aria-label="Hash table buckets">
        {buckets.map((bucket, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded border font-mono text-xs",
                CELL_CLASS[bucket.state],
              )}
              aria-label={`Bucket ${i}, ${CELL_LABEL[bucket.state]}`}
            >
              {i}
            </span>
            <div className="flex min-h-8 flex-1 flex-wrap items-center gap-1.5 rounded border border-dashed border-border px-2 py-1">
              {bucket.entries.length === 0 ? (
                <span className="font-mono text-[11px] text-muted-foreground/60">empty</span>
              ) : (
                bucket.entries.map((entry, k) => (
                  <span key={entry.key + k} className="flex items-center gap-1">
                    {k > 0 && (
                      <span aria-hidden className="font-mono text-[10px] text-muted-foreground">
                        →
                      </span>
                    )}
                    <span
                      className={cn(
                        "viz-state-motion viz-enter rounded border px-2 py-0.5 font-mono text-xs",
                        CELL_CLASS[entry.state],
                      )}
                      data-cell-state={entry.state}
                      aria-label={`Key ${entry.key}, value ${entry.value}, ${CELL_LABEL[entry.state]}`}
                    >
                      {entry.key}:{entry.value}
                    </span>
                  </span>
                ))
              )}
            </div>
          </li>
        ))}
      </ul>

      {output && <p className="font-mono text-xs text-muted-foreground">{output}</p>}

      <VizLegend states={buckets.flatMap((b) => [b.state, ...b.entries.map((e) => e.state)])} />
    </div>
  );
}
