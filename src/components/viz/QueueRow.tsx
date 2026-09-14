"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { QueueVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

/** Queue / circular queue / deque renderer with front and rear markers. */
export function QueueRow({ state }: { state: QueueVizState }) {
  const { slots, front, rear, circular, counters, output } = state;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <VizCounters counters={counters} />

      <ul
        className="flex max-w-full flex-wrap items-start justify-center gap-1.5"
        aria-label="Queue visualization"
      >
        {slots.map((slot, i) => {
          const labels = [front === i ? "front" : null, rear === i ? "rear" : null].filter(Boolean);
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
              <div
                className={cn(
                  "flex h-12 w-14 items-center justify-center rounded-lg border font-mono text-sm transition-all duration-300",
                  slot
                    ? CELL_CLASS[slot.state]
                    : "border-dashed border-border text-muted-foreground/60",
                )}
                aria-label={
                  slot
                    ? `Slot ${i}, value ${slot.value}, ${CELL_LABEL[slot.state]}`
                    : `Slot ${i}, empty`
                }
              >
                {slot ? slot.value : "·"}
              </div>
              <span
                aria-hidden
                className="h-3 font-mono text-[10px] leading-3 text-muted-foreground"
              >
                {slot ? CELL_MARK[slot.state] : ""}
              </span>
              <div className="flex h-4 flex-wrap items-start justify-center gap-1">
                {labels.map((l) => (
                  <span
                    key={l}
                    className="rounded bg-primary/12 px-1 font-mono text-[10px] font-semibold text-primary"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="font-mono text-[11px] text-muted-foreground">
        {circular ? "circular: indexes wrap with % capacity" : "front removes · rear inserts"}
        {output ? ` · output: ${output}` : ""}
      </p>

      <VizLegend states={slots.filter((s) => s !== null).map((s) => s!.state)} />
    </div>
  );
}
