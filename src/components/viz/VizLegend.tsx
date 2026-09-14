"use client";

import { CELL_LABEL, type CellState } from "@/lib/viz/types";
import { cn } from "@/lib/utils";
import { CELL_CLASS, STATE_ORDER } from "./cellStyles";

export function VizLegend({ states }: { states: CellState[] }) {
  const shown = STATE_ORDER.filter((s) => states.includes(s));
  if (shown.length <= 1) return null;
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      {shown.map((s) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-sm border", CELL_CLASS[s])} />
          <span>{CELL_LABEL[s]}</span>
        </li>
      ))}
    </ul>
  );
}
