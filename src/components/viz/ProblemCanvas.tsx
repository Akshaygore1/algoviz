"use client";

import { CELL_LABEL, type CellState } from "@/lib/viz/types";
import type {
  ProblemVizState,
  VizChain,
  VizPanel,
  VizRow,
  VizStackPanel,
  VizGraph,
} from "@/lib/viz/problemState";
import { cn } from "@/lib/utils";
import { CELL_CLASS, CELL_MARK } from "./cellStyles";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";

/**
 * One renderer for every interview problem. It draws whichever primitives the
 * current step provides: rows, hash panels, stacks, chains, a grid.
 */
export function ProblemCanvas({ state }: { state: ProblemVizState }) {
  const { rows, panels, stacks, chains, grid, graph, counters, notes, output } = state;
  const allStates: CellState[] = [
    ...(rows ?? []).flatMap((r) => r.cells),
    ...(stacks ?? []).flatMap((s) => s.items.map((i) => i.state)),
    ...(chains ?? []).flatMap((c) => c.nodes.map((n) => n.state)),
    ...(grid ? grid.cells.flatMap((r) => r.map((c) => c.state)) : []),
    ...(graph?.nodes ?? []).map((n) => n.state),
    ...(graph?.edges ?? []).flatMap((e) => (e.state ? [e.state] : [])),
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <VizCounters counters={counters} />

      {rows?.map((r, i) => (
        <Row key={r.label ?? i} row={r} />
      ))}

      {chains
        ?.filter((c) => c.nodes.length > 0)
        .map((c, i) => (
          <Chain key={c.label ?? i} chain={c} />
        ))}

      {grid && <Grid label={grid.label} cells={grid.cells} />}

      {graph && <Graph graph={graph} />}

      {(stacks?.length || panels?.length) && (
        <div className="flex w-full max-w-3xl flex-wrap items-start justify-center gap-4">
          {stacks?.map((s) => (
            <StackPanel key={s.label} stack={s} />
          ))}
          {panels?.map((p) => (
            <Panel key={p.label} panel={p} />
          ))}
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {notes.map((n) => (
            <span
              key={n}
              className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs"
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {output && (
        <p className="max-w-2xl text-center font-mono text-xs text-muted-foreground">{output}</p>
      )}

      <VizLegend states={allStates} />
    </div>
  );
}

function Row({ row }: { row: VizRow }) {
  const {
    values,
    cells,
    pointers,
    mode = "cells",
    window: win,
    showIndex = true,
    fill,
    label,
  } = row;
  const names = pointers ? Object.keys(pointers) : [];
  const nums = values.map((v) => (typeof v === "number" ? Math.abs(v) : 1));
  const max = Math.max(1, ...nums);

  return (
    <div className="flex max-w-full flex-col items-center gap-1">
      {label && (
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
      )}
      <ul
        className="flex max-w-full flex-wrap items-end justify-center gap-1 sm:gap-1.5"
        aria-label={label ?? "Values"}
      >
        {values.map((value, i) => {
          const cellState = cells[i] ?? "default";
          const inWindow = !!win && i >= win.start && i <= win.end;
          const height = mode === "bars" ? 32 + (nums[i]! / max) * 140 : 48;
          const active = names.filter((n) => pointers?.[n] === i);
          const water = fill?.[i] ?? null;
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              {showIndex && (
                <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
              )}
              <div
                style={{ height }}
                className={cn(
                  "relative flex w-9 items-end justify-center overflow-hidden rounded-md border font-mono text-xs font-medium transition-all duration-300 sm:w-10 sm:text-sm",
                  mode === "cells" && "items-center",
                  CELL_CLASS[cellState],
                  inWindow && cellState === "default" && "ring-2 ring-primary/40",
                )}
                aria-label={`Index ${i}, value ${value}, ${CELL_LABEL[cellState]}`}
              >
                {water !== null && water > 0 && (
                  <span
                    aria-hidden
                    style={{ height: `${Math.min(100, water * 100)}%` }}
                    className="absolute inset-x-0 top-0 bg-viz-inspect/45"
                  />
                )}
                <span className="relative px-0.5 pb-1">{value === "" ? "␣" : value}</span>
              </div>
              <span
                aria-hidden
                className="h-3 font-mono text-[10px] leading-3 text-muted-foreground"
              >
                {CELL_MARK[cellState]}
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
      {win?.label && <span className="font-mono text-[11px] text-primary">{win.label}</span>}
    </div>
  );
}

function Panel({ panel }: { panel: VizPanel }) {
  return (
    <div className="min-w-40 rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-[11px] tracking-wide text-muted-foreground uppercase">
        {panel.label}
      </p>
      {panel.entries.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground/70">{panel.empty ?? "empty"}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {panel.entries.map((e) => (
            <span
              key={e.key}
              className={cn(
                "rounded-md border px-2 py-1 font-mono text-xs transition-colors",
                e.state ? CELL_CLASS[e.state] : "border-border bg-background",
              )}
            >
              {e.key === " " ? "␣" : e.key}
              <span className="opacity-60"> → </span>
              {e.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StackPanel({ stack }: { stack: VizStackPanel }) {
  const horizontal = stack.orientation === "horizontal";
  const items = horizontal ? stack.items : [...stack.items].reverse();
  return (
    <div className="min-w-32 rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-[11px] tracking-wide text-muted-foreground uppercase">
        {stack.label}
      </p>
      {items.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground/70">empty</p>
      ) : (
        <ul className={cn("flex gap-1", horizontal ? "flex-row flex-wrap" : "flex-col")}>
          {items.map((item, i) => (
            <li
              key={`${item.value}-${i}`}
              className={cn(
                "flex h-8 min-w-12 items-center justify-center rounded-md border px-2 font-mono text-xs transition-all duration-300",
                CELL_CLASS[item.state],
              )}
            >
              {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chain({ chain }: { chain: VizChain }) {
  const { nodes, pointers, extraLinks, label } = chain;
  const names = pointers ? Object.keys(pointers) : [];
  return (
    <div className="flex max-w-full flex-col items-center gap-1">
      {label && (
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
      )}
      <ul
        className="flex max-w-full flex-wrap items-center justify-center gap-1"
        aria-label={label ?? "Linked list"}
      >
        {nodes.map((n, i) => {
          const active = names.filter((p) => pointers?.[p] === n.id);
          const links = extraLinks?.filter((l) => l.from === n.id) ?? [];
          return (
            <li key={n.id} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-md border font-mono text-sm transition-all duration-300",
                    CELL_CLASS[n.state],
                  )}
                  aria-label={`Node ${n.value}, ${CELL_LABEL[n.state]}`}
                >
                  {n.value}
                </div>
                {i < nodes.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
              <span className="h-4 font-mono text-[10px] text-primary">{active.join(" ")}</span>
              {links.length > 0 && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  ⇢ {links.map((l) => nodes.find((x) => x.id === l.to)?.value ?? "null").join(",")}
                </span>
              )}
            </li>
          );
        })}
        {nodes.length > 0 && <span className="font-mono text-xs text-muted-foreground">null</span>}
      </ul>
    </div>
  );
}

function Grid({
  label,
  cells,
}: {
  label?: string | undefined;
  cells: { value: string | number; state: CellState }[][];
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
      )}
      <div
        className="inline-grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${cells[0]?.length ?? 1}, minmax(0, 1fr))` }}
      >
        {cells.flatMap((r, ri) =>
          r.map((c, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded border font-mono text-xs transition-all duration-300",
                CELL_CLASS[c.state],
                ci % 3 === 2 && ci !== r.length - 1 && "mr-1",
                ri % 3 === 2 && ri !== cells.length - 1 && "mb-1",
              )}
              aria-label={`Row ${ri + 1} column ${ci + 1}, ${c.value === "." ? "empty" : c.value}`}
            >
              {c.value === "." ? "" : c.value}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

function Graph({ graph }: { graph: VizGraph }) {
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));

  return (
    <div
      className="flex w-full max-w-3xl flex-col items-center gap-3"
      aria-label={graph.label ?? "Graph visualization"}
    >
      {graph.label && (
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
          {graph.label}
        </span>
      )}
      <div className="flex max-w-full flex-wrap justify-center gap-2" aria-label="Graph nodes">
        {graph.nodes.map((node) => (
          <span
            key={node.id}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-full border px-2 font-mono text-sm font-medium transition-colors duration-300",
              CELL_CLASS[node.state],
            )}
            aria-label={`Node ${node.label}, ${CELL_LABEL[node.state]}`}
          >
            {node.label}
          </span>
        ))}
      </div>
      <ul className="flex max-w-full flex-wrap justify-center gap-1.5" aria-label="Graph edges">
        {graph.edges.map((edge, i) => (
          <li
            key={`${edge.from}-${edge.to}-${i}`}
            className={cn(
              "flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs transition-colors duration-300",
              CELL_CLASS[edge.state ?? "default"],
            )}
            aria-label={`${labels.get(edge.from) ?? edge.from} ${edge.directed ? "to" : "connected to"} ${labels.get(edge.to) ?? edge.to}`}
          >
            <span>{labels.get(edge.from) ?? edge.from}</span>
            <span aria-hidden>{edge.directed ? "→" : "↔"}</span>
            <span>{labels.get(edge.to) ?? edge.to}</span>
          </li>
        ))}
      </ul>
      {(graph.queue || graph.stack) && (
        <div className="flex flex-wrap justify-center gap-2">
          {graph.queue && (
            <span className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs">
              queue: [{graph.queue.join(", ") || "empty"}]
            </span>
          )}
          {graph.stack && (
            <span className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs">
              stack: [{graph.stack.join(", ") || "empty"}]
            </span>
          )}
        </div>
      )}
    </div>
  );
}
