"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { CELL_LABEL, type ArrayVizState, type CellState } from "@/lib/viz/types";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK, STATE_ORDER } from "./cellStyles";
import { useVizMotion } from "./VizMotionContext";

interface Props {
  state: ArrayVizState;
}

export function SortCanvas({ state }: Props) {
  const motionMode = useVizMotion();
  const { values, cells, pointers, counters, auxiliary } = state;
  const n = values.length;
  const pointerNames = pointers ? Object.keys(pointers) : [];
  const hasValues = n > 0;

  // Scale: handle all-positive, all-negative, and mixed ranges.
  const min = hasValues ? Math.min(...values) : 0;
  const max = hasValues ? Math.max(...values) : 1;
  const range = max - min || 1;
  const allNonNegative = min >= 0;
  const allNonPositive = max <= 0;
  const hasMixedSign = !allNonNegative && !allNonPositive;

  // Height in px: reserve baseline and label space.
  const minH = 28;
  const maxH = 168;
  const itemIds = useMemo(() => {
    const occurrences = new Map<number, number>();
    return values.map((value) => {
      const occurrence = occurrences.get(value) ?? 0;
      occurrences.set(value, occurrence + 1);
      return `${value}:${occurrence}`;
    });
  }, [values]);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const previousRects = useRef(new Map<string, DOMRect>());
  const animations = useRef(new Map<string, Animation>());

  useLayoutEffect(() => {
    const nextRects = new Map<string, DOMRect>();
    itemRefs.current.forEach((element, id) => nextRects.set(id, element.getBoundingClientRect()));

    if (motionMode === "full") {
      nextRects.forEach((rect, id) => {
        const previous = previousRects.current.get(id);
        const element = itemRefs.current.get(id);
        if (!previous || !element) return;
        const deltaX = previous.left - rect.left;
        const deltaY = previous.top - rect.top;
        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

        animations.current.get(id)?.cancel();
        const animation = element.animate(
          [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: "translate(0, 0)" }],
          { duration: 200, easing: "cubic-bezier(0.77, 0, 0.175, 1)" },
        );
        animations.current.set(id, animation);
      });
    } else {
      animations.current.forEach((animation) => animation.cancel());
      animations.current.clear();
    }

    previousRects.current = nextRects;
  }, [itemIds, motionMode]);

  const barHeight = (v: number) => {
    if (allNonNegative) {
      const r = max === 0 ? 0 : v / max;
      return minH + r * (maxH - minH);
    }
    if (allNonPositive) {
      const r = min === 0 ? 0 : v / min; // v negative, min negative
      return minH + r * (maxH - minH);
    }
    // Mixed: map min -> minH, max -> maxH, zero in the middle
    const t = (v - min) / range;
    return minH + t * (maxH - minH);
  };

  // Zero baseline offset from bottom when mixed (in px, inside the bar track)
  const zeroOffset = hasMixedSign ? minH + ((0 - min) / range) * (maxH - minH) : 0;

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 sm:p-5">
      {/* Counters */}
      {counters && Object.keys(counters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(counters).map(([label, value]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
            >
              <span className="text-[11px] tracking-wide">{label}</span>
              <span className="font-mono text-xs font-medium text-foreground">{value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Chart stage */}
      <div className="relative flex flex-1 flex-col justify-end">
        {/* Subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg border border-border/60 bg-card/40"
        />

        <ul
          aria-label="Array bars"
          className="relative flex max-w-full items-end justify-center gap-1 px-3 pb-2 sm:gap-1.5"
          style={{ minHeight: maxH + 48 }}
        >
          {values.map((value, i) => {
            const cellState: CellState = cells[i] ?? "default";
            const h = barHeight(value);
            const activePointers = pointerNames.filter((p) => pointers?.[p] === i);
            const isActive =
              cellState !== "default" && cellState !== "visited" && cellState !== "done";

            return (
              <li
                key={itemIds[i]}
                ref={(element) => {
                  const id = itemIds[i]!;
                  if (element) itemRefs.current.set(id, element);
                  else itemRefs.current.delete(id);
                }}
                className="flex min-w-0 flex-1 max-w-18 flex-col items-center sm:max-w-16"
                style={{ maxWidth: n > 10 ? 44 : n > 8 ? 52 : 64 }}
              >
                {/* Value label above bar */}
                <span
                  className={cn(
                    "mb-1 font-mono text-xs font-medium tabular-nums",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {value}
                </span>

                {/* Bar */}
                <div
                  style={{ height: h }}
                  className={cn(
                    "viz-state-motion flex w-full items-end justify-center rounded-t-md border text-[11px] font-medium",
                    CELL_CLASS[cellState],
                    isActive && "shadow-sm",
                  )}
                  data-cell-state={cellState}
                  aria-label={`Index ${i}, value ${value}, ${CELL_LABEL[cellState]}`}
                >
                  <span aria-hidden className="pb-1 font-mono text-[10px] leading-none opacity-80">
                    {CELL_MARK[cellState]}
                  </span>
                </div>

                {/* Index */}
                <span className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground">
                  {i}
                </span>

                {/* Pointer + mark */}
                <span
                  aria-hidden
                  className="h-3 font-mono text-[10px] leading-3 text-muted-foreground"
                >
                  {!isActive && activePointers.length === 0 ? "" : CELL_MARK[cellState]}
                </span>
                <div className="flex min-h-4 flex-wrap items-center justify-center gap-1">
                  {activePointers.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-primary px-1 py-0.5 font-mono text-[10px] font-semibold leading-none text-primary-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Zero line for mixed sign */}
        {hasMixedSign && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-3 border-t border-dashed border-foreground/20"
            style={{ bottom: 36 + zeroOffset }}
          >
            <span className="absolute -top-2 right-1 rounded bg-card px-1 font-mono text-[10px] text-muted-foreground">
              0
            </span>
          </div>
        )}
      </div>

      {/* Auxiliary row (merge buffer, etc.) */}
      {auxiliary && (
        <div className="rounded-lg border border-border bg-card/60 px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {auxiliary.label}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {auxiliary.values.filter((v) => v !== null).length} filled
            </span>
          </div>
          <ul aria-label={auxiliary.label} className="flex flex-wrap items-center gap-1.5">
            {auxiliary.values.map((v, i) => {
              const s: CellState = auxiliary.cells[i] ?? "default";
              return (
                <li key={i}>
                  <div
                    className={cn(
                      "viz-state-motion flex h-8 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-xs",
                      v === null
                        ? "border-dashed bg-transparent text-muted-foreground/40"
                        : CELL_CLASS[s],
                    )}
                    data-cell-state={s}
                    aria-label={
                      v === null
                        ? `${auxiliary.label} ${i} empty`
                        : `${auxiliary.label} ${i} value ${v}, ${CELL_LABEL[s]}`
                    }
                  >
                    {v === null ? "·" : v}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Legend */}
      <Legend states={Array.from(new Set(cells))} />
    </div>
  );
}

function Legend({ states }: { states: CellState[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 pt-3 text-[11px] text-muted-foreground">
      {STATE_ORDER.map((s) => (
        <li
          key={s}
          className={cn("flex items-center gap-1.5", !states.includes(s) && "opacity-35")}
        >
          <span className={cn("h-2.5 w-2.5 rounded-sm border", CELL_CLASS[s])} aria-hidden />
          <span className="capitalize leading-none">{CELL_LABEL[s]}</span>
        </li>
      ))}
    </ul>
  );
}
