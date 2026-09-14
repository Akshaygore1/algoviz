"use client";

import type { DpTableViz } from "@/lib/viz/state";
import { CELL_LABEL } from "@/lib/viz/types";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";

const show = (value: number | null) => (value === null ? "∞" : String(value));

/** The dp table: one row for 1-D problems, a full grid for 2-D ones. */
export function DpTable({ table }: { table: DpTableViz }) {
  const { cells, rowLabels, colLabels, label, oneRow } = table;
  const colCount = cells[0]?.length ?? 0;
  const showRowHeader = !oneRow;

  return (
    <div className="flex max-w-full flex-col items-center gap-2">
      {label && (
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
      )}
      <div className="max-w-full overflow-x-auto">
        <table className="border-separate border-spacing-1 font-mono text-xs">
          <thead>
            <tr>
              {showRowHeader && <th className="w-14" />}
              {Array.from({ length: colCount }, (_, ci) => (
                <th
                  key={ci}
                  className="min-w-11 pb-0.5 text-[10px] font-normal text-muted-foreground"
                >
                  {colLabels?.[ci] ?? ci}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, ri) => (
              <tr key={ri}>
                {showRowHeader && (
                  <th className="pr-1 text-right text-[10px] font-normal text-muted-foreground">
                    {rowLabels?.[ri] ?? ri}
                  </th>
                )}
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <div
                      className={cn(
                        "flex h-10 min-w-11 flex-col items-center justify-center rounded-md border transition-all duration-300",
                        CELL_CLASS[cell.state],
                      )}
                      aria-label={`Cell ${rowLabels?.[ri] ?? ri} ${colLabels?.[ci] ?? ci}, ${
                        cell.value === null ? "not computed" : cell.value
                      }, ${CELL_LABEL[cell.state]}`}
                    >
                      <span className="leading-none">
                        {cell.value === null ? "·" : show(cell.value)}
                      </span>
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
    </div>
  );
}
