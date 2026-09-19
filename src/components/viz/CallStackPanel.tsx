"use client";

import { CELL_LABEL } from "@/lib/viz/types";
import type { FrameVizState } from "@/lib/viz/state";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";

/** Call stack: outermost call on top, active frame highlighted at the bottom. */
export function CallStackPanel({ frames }: { frames: FrameVizState["frames"] }) {
  return (
    <div className="w-full shrink-0 space-y-1.5 md:w-56">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Call stack</p>
      <ul
        className="flex min-h-[180px] flex-col gap-1 rounded-lg border border-border bg-card p-1.5"
        aria-label="Call stack"
      >
        {frames.length === 0 ? (
          <li className="flex flex-1 items-center justify-center font-mono text-xs text-muted-foreground">
            empty
          </li>
        ) : (
          frames.map((frame, i) => (
            <li
              key={`${frame.id}-${i}`}
              className={cn(
                "viz-state-motion viz-enter flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs",
                CELL_CLASS[frame.state],
              )}
              data-cell-state={frame.state}
              aria-label={`Frame ${frame.label}, ${CELL_LABEL[frame.state]}`}
            >
              <span className="truncate">{frame.label}</span>
              <span className="shrink-0 text-[10px] opacity-80">
                {frame.result !== undefined ? `→ ${frame.result}` : CELL_MARK[frame.state]}
              </span>
            </li>
          ))
        )}
      </ul>
      <p className="font-mono text-[10px] text-muted-foreground">
        {frames.length === 0 ? "nothing running" : `${frames.length} frame(s) · bottom = running`}
      </p>
    </div>
  );
}
