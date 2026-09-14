"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKTRACKING_OPS, type BtInput } from "@/lib/viz/algorithms/backtracking";
import type { BacktrackVizState } from "@/lib/viz/state";
import type { CellState } from "@/lib/viz/types";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { BoardGrid, ChipRow } from "./BoardGrid";
import { CallStackPanel } from "./CallStackPanel";
import { CallTree } from "./CallTree";
import { ComplexityCard } from "./ComplexityCard";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";
import { VizWorkspace } from "./VizWorkspace";

const MAZES: { label: string; maze: number[][] }[] = [
  {
    label: "4×4",
    maze: [
      [1, 0, 0, 0],
      [1, 1, 0, 1],
      [0, 1, 0, 0],
      [1, 1, 1, 1],
    ],
  },
  {
    label: "4×4 with a dead end",
    maze: [
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 1],
      [1, 0, 0, 1],
    ],
  },
];

const GRIDS: { label: string; grid: string[][]; word: string }[] = [
  {
    label: "ABCCED",
    grid: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    word: "ABCCED",
  },
  {
    label: "SEE",
    grid: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    word: "SEE",
  },
];

const DEFAULT_INPUT: BtInput = {
  items: [1, 2, 3],
  candidates: [2, 3, 5],
  target: 8,
  n: 4,
  maze: MAZES[0]!.maze,
  grid: GRIDS[0]!.grid,
  word: GRIDS[0]!.word,
};

function BacktrackingCanvas({ state }: { state: BacktrackVizState }) {
  const states: CellState[] = [
    ...(state.board?.cells.flatMap((row) => row.map((c) => c.state)) ?? []),
    ...(state.items ?? []).map((c) => c.state),
    ...(state.treeNodes ?? []).map((n) => n.state),
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <VizCounters counters={state.counters} />

      {state.items && <ChipRow cells={state.items} label={state.itemsLabel} />}

      {state.board && (
        <div className="flex justify-center">
          <BoardGrid
            cells={state.board.cells}
            label={state.board.label}
            rowLabels={state.board.rowLabels}
            colLabels={state.board.colLabels}
          />
        </div>
      )}

      {state.partial && (
        <p className="font-mono text-xs text-muted-foreground">
          {state.partialLabel ?? "partial"}:{" "}
          <span className="text-foreground">{state.partial}</span>
        </p>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <CallStackPanel frames={state.frames} />
        <CallTree nodes={state.treeNodes ?? []} />
      </div>

      {state.solutions && state.solutions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            {state.solutionsLabel ?? "solutions"} ({state.solutions.length})
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {state.solutions.map((s, i) => (
              <li
                key={i}
                className="rounded-md border border-viz-done bg-viz-done px-2 py-1 font-mono text-[11px] text-viz-done-fg"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.output && (
        <p className="font-mono text-xs text-muted-foreground">
          result: <span className="text-foreground">{state.output}</span>
        </p>
      )}

      <VizLegend states={states} />
    </div>
  );
}

export function BacktrackingVisualizer() {
  const [slug, setSlug] = useState(BACKTRACKING_OPS[0]!.slug);
  const [input, setInput] = useState<BtInput>(DEFAULT_INPUT);

  const definition = BACKTRACKING_OPS.find((o) => o.slug === slug) ?? BACKTRACKING_OPS[0]!;
  const steps = useMemo(() => definition.generate(input), [definition, input]);
  const set = (patch: Partial<BtInput>) => setInput((prev) => ({ ...prev, ...patch }));

  const controls = () => {
    switch (definition.slug) {
      case "subsets":
      case "permutations":
        return (
          <ArrayInputPanel
            key="items"
            values={input.items}
            onChange={(items) => set({ items: items.slice(0, 4) })}
            maxLength={4}
            presets={[
              { label: "1 2 3", values: [1, 2, 3] },
              { label: "1 2 3 4", values: [1, 2, 3, 4] },
              { label: "5 10", values: [5, 10] },
            ]}
          />
        );
      case "combination-sum":
        return (
          <div className="space-y-3">
            <NumberField
              id="bt-target"
              label="Target"
              value={input.target}
              onChange={(target) => set({ target: Math.min(12, Math.max(2, target)) })}
              min={2}
              max={12}
            />
            <ArrayInputPanel
              key="candidates"
              values={input.candidates}
              onChange={(candidates) => set({ candidates: candidates.filter((c) => c > 0) })}
              maxLength={4}
              presets={[
                { label: "2 3 5", values: [2, 3, 5] },
                { label: "2 3 6 7", values: [2, 3, 6, 7] },
                { label: "3 5", values: [3, 5] },
              ]}
            />
          </div>
        );
      case "n-queens":
        return (
          <div className="flex flex-wrap items-end gap-3">
            <NumberField
              id="bt-n"
              label="Board size"
              value={input.n}
              onChange={(n) => set({ n: Math.min(6, Math.max(4, n)) })}
              min={4}
              max={6}
            />
            <p className="pb-2 text-xs text-muted-foreground">
              4 to 6: the search stops at the first solution it finds.
            </p>
          </div>
        );
      case "rat-in-a-maze":
        return (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Maze:</span>
            {MAZES.map((m) => (
              <Button
                key={m.label}
                size="sm"
                variant={input.maze === m.maze ? "default" : "secondary"}
                className="h-7 text-xs"
                onClick={() => set({ maze: m.maze })}
              >
                {m.label}
              </Button>
            ))}
          </div>
        );
      case "word-search":
        return (
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-40 space-y-1.5">
              <Label htmlFor="bt-word" className="text-xs text-muted-foreground">
                Word (max 6 letters)
              </Label>
              <Input
                id="bt-word"
                value={input.word}
                onChange={(e) => set({ word: e.target.value.toUpperCase().slice(0, 6) })}
                className="font-mono"
                placeholder="ABCCED"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-xs text-muted-foreground">Try:</span>
              {GRIDS.map((g) => (
                <Button
                  key={g.label}
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs"
                  onClick={() => set({ grid: g.grid, word: g.word })}
                >
                  {g.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-xs"
                onClick={() => set({ word: "ABCB" })}
              >
                ABCB (fails)
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <VizWorkspace
        definition={definition}
        steps={steps}
        renderVisual={(state) => <BacktrackingCanvas state={state} />}
        inputPanel={
          <div className="space-y-3">
            <OperationPicker
              operations={BACKTRACKING_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
              active={slug}
              onSelect={setSlug}
              label="Problem"
            />
            <p className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{definition.title}: </span>
              {definition.tagline}
            </p>
            {controls()}
          </div>
        }
      />
      <ComplexityCard complexity={definition.complexity} />
    </div>
  );
}
