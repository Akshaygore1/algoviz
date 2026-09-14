"use client";

import { CELL_LABEL, type ArrayVizState, type CellState } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

const CELL_CLASS: Record<CellState, string> = {
  default: "bg-viz-default text-viz-default-fg border-transparent",
  inspect: "bg-viz-inspect text-viz-inspect-fg border-viz-inspect shadow-sm",
  compare: "bg-viz-compare text-viz-compare-fg border-viz-compare shadow-sm",
  success: "bg-viz-success text-viz-success-fg border-viz-success shadow-sm",
  error: "bg-viz-error text-viz-error-fg border-viz-error shadow-sm",
  visited: "bg-viz-visited text-viz-visited-fg border-viz-visited",
  done: "bg-viz-done text-viz-done-fg border-viz-done",
  eliminated: "bg-transparent text-muted-foreground/50 border-dashed border-border line-through",
};

/** Non-color marker so state is readable without relying on hue. */
const CELL_MARK: Record<CellState, string> = {
  default: "",
  inspect: "◆",
  compare: "↔",
  success: "✓",
  error: "✕",
  visited: "•",
  done: "✓",
  eliminated: "—",
};

interface Props {
  state: ArrayVizState;
  /** Render values as bars scaled by magnitude (sorting) or flat cells. */
  mode?: "bars" | "cells";
}

export function ArrayCanvas({ state, mode = "cells" }: Props) {
  const { values, cells, pointers, counters, auxiliary } = state;
  const max = Math.max(1, ...values.map((v) => Math.abs(v)));
  const pointerNames = pointers ? Object.keys(pointers) : [];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-4">
      {counters && Object.keys(counters).length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(counters).map(([label, value]) => (
            <span
              key={label}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
            >
              {label}: <span className="font-mono text-foreground">{value}</span>
            </span>
          ))}
        </div>
      )}

      <ul
        className="flex max-w-full flex-wrap items-end justify-center gap-1.5 sm:gap-2"
        aria-label="Array visualization"
      >
        {values.map((value, i) => {
          const cellState = cells[i] ?? "default";
          const height = mode === "bars" ? 44 + (Math.abs(value) / max) * 150 : 56;
          const activePointers = pointerNames.filter((p) => pointers?.[p] === i);
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
              <div
                style={{ height }}
                className={cn(
                  "flex w-10 items-center justify-center rounded-lg border font-mono text-sm font-medium transition-all duration-300 ease-out sm:w-12 sm:text-base",
                  CELL_CLASS[cellState],
                )}
                aria-label={`Index ${i}, value ${value}, ${CELL_LABEL[cellState]}`}
              >
                {value}
              </div>
              <span
                aria-hidden
                className="h-3 font-mono text-[10px] leading-3 text-muted-foreground"
              >
                {CELL_MARK[cellState]}
              </span>
              <div className="flex h-4 flex-wrap items-start justify-center gap-1">
                {activePointers.map((p) => (
                  <span
                    key={p}
                    className="rounded bg-primary/12 px-1 font-mono text-[10px] font-semibold text-primary"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {auxiliary && (
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">{auxiliary.label}</span>
          <ul
            className="flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            aria-label={auxiliary.label}
          >
            {auxiliary.values.map((value, i) => {
              const cellState = auxiliary.cells[i] ?? "default";
              return (
                <li key={i}>
                  <div
                    className={cn(
                      "flex h-9 w-10 items-center justify-center rounded-lg border font-mono text-xs transition-all duration-300 ease-out sm:w-12 sm:text-sm",
                      value === null
                        ? "border-dashed border-border bg-transparent text-muted-foreground/40"
                        : CELL_CLASS[cellState],
                    )}
                    aria-label={
                      value === null
                        ? `${auxiliary.label} index ${i}, empty`
                        : `${auxiliary.label} index ${i}, value ${value}, ${CELL_LABEL[cellState]}`
                    }
                  >
                    {value === null ? "·" : value}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Legend states={Array.from(new Set(cells))} />
    </div>
  );
}

function Legend({ states }: { states: CellState[] }) {
  const order: CellState[] = [
    "default",
    "inspect",
    "compare",
    "success",
    "error",
    "visited",
    "done",
    "eliminated",
  ];
  const shown = order.filter((s) => states.includes(s));
  if (shown.length <= 1) return null;
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      {shown.map((s) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-sm border", CELL_CLASS[s])} />
          <span className="capitalize">{CELL_LABEL[s]}</span>
        </li>
      ))}
    </ul>
  );
}
