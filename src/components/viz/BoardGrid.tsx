"use client";

import type { BoardCell } from "@/lib/viz/state";
import { CELL_LABEL } from "@/lib/viz/types";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";

interface Props {
  cells: BoardCell[][];
  label?: string | undefined;
  rowLabels?: string[] | undefined;
  colLabels?: string[] | undefined;
}

/** A square board: n-queens, a maze, a letter grid. */
export function BoardGrid({ cells, label, rowLabels, colLabels }: Props) {
  const colCount = cells[0]?.length ?? 0;

  return (
    <div className="flex max-w-full flex-col items-center gap-2">
      <div className="max-w-full overflow-x-auto">
        <table className="border-separate border-spacing-1 font-mono text-sm">
          <thead>
            <tr>
              <th className="w-10" />
              {Array.from({ length: colCount }, (_, ci) => (
                <th
                  key={ci}
                  className="min-w-10 pb-0.5 text-[10px] font-normal text-muted-foreground"
                >
                  {colLabels?.[ci] ?? ci}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, ri) => (
              <tr key={ri}>
                <th className="pr-1 text-right text-[10px] font-normal text-muted-foreground">
                  {rowLabels?.[ri] ?? ri}
                </th>
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <div
                      className={cn(
                        "flex h-10 w-10 flex-col items-center justify-center rounded-md border transition-all duration-300",
                        CELL_CLASS[cell.state],
                      )}
                      aria-label={`${rowLabels?.[ri] ?? ri} ${colLabels?.[ci] ?? ci}: ${cell.label}, ${CELL_LABEL[cell.state]}`}
                    >
                      <span className="leading-none">{cell.label}</span>
                      <span aria-hidden className="h-2.5 text-[9px] leading-none opacity-80">
                        {CELL_MARK[cell.state]}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {label && <p className="text-[11px] text-muted-foreground">{label}</p>}
    </div>
  );
}

/** A single row of chips: a pool of items, or the letters of a target word. */
export function ChipRow({ cells, label }: { cells: BoardCell[]; label?: string | undefined }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      )}
      <ul className="flex flex-wrap gap-1.5">
        {cells.map((cell, i) => (
          <li
            key={i}
            className={cn(
              "flex h-9 min-w-9 flex-col items-center justify-center rounded-md border px-2 font-mono text-xs transition-all duration-300",
              CELL_CLASS[cell.state],
            )}
            aria-label={`${cell.label}, ${CELL_LABEL[cell.state]}`}
          >
            <span className="leading-none">{cell.label}</span>
            <span aria-hidden className="h-2.5 text-[9px] leading-none opacity-80">
              {CELL_MARK[cell.state]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
