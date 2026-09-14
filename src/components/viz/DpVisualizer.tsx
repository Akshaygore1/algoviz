"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DP_SPECS } from "@/lib/viz/algorithms/dp/problems";
import { dpStage, type DpInput, type DpStage } from "@/lib/viz/algorithms/dp/shared";
import type { DpVizState } from "@/lib/viz/state";
import type { CellState } from "@/lib/viz/types";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { CallStackPanel } from "./CallStackPanel";
import { CallTree } from "./CallTree";
import { DpTable } from "./DpTable";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { StagePicker } from "./StagePicker";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";
import { VizWorkspace } from "./VizWorkspace";

const GRIDS: { label: string; grid: number[][] }[] = [
  {
    label: "3×3",
    grid: [
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ],
  },
  {
    label: "4×4",
    grid: [
      [1, 2, 5, 3],
      [4, 1, 2, 6],
      [2, 7, 1, 1],
      [3, 1, 4, 2],
    ],
  },
];

const DEFAULT_INPUT: DpInput = {
  n: 6,
  amount: 11,
  coins: [1, 2, 5],
  houses: [2, 7, 9, 3, 1],
  weights: [2, 3, 4],
  values: [3, 4, 6],
  capacity: 6,
  a: "abcd",
  b: "acbd",
  rows: 3,
  cols: 4,
  grid: GRIDS[0]!.grid,
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(v)));

function DpCanvas({ state }: { state: DpVizState }) {
  const states: CellState[] = [
    ...(state.table?.cells.flatMap((r) => r.map((c) => c.state)) ?? []),
    ...(state.treeNodes ?? []).map((n) => n.state),
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <VizCounters counters={state.counters} />

      {state.formula && (
        <p className="text-center font-mono text-[11px] text-muted-foreground">{state.formula}</p>
      )}

      {state.table && (
        <div className="flex justify-center">
          <DpTable table={state.table} />
        </div>
      )}

      {state.frames && (
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <CallStackPanel frames={state.frames} />
          <CallTree nodes={state.treeNodes ?? []} />
        </div>
      )}

      {state.memo && Object.keys(state.memo).length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            {state.memoLabel ?? "memo"}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {Object.entries(state.memo).map(([key, value]) => (
              <li
                key={key}
                className="rounded-md border border-viz-done bg-viz-done px-2 py-1 font-mono text-[11px] text-viz-done-fg"
              >
                {key}: {value}
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

export function DpVisualizer() {
  const [slug, setSlug] = useState(DP_SPECS[0]!.slug);
  const [stage, setStage] = useState<DpStage>("brute");
  const [input, setInput] = useState<DpInput>(DEFAULT_INPUT);

  const spec = DP_SPECS.find((s) => s.slug === slug) ?? DP_SPECS[0]!;
  const definition = useMemo(() => dpStage(spec, stage), [spec, stage]);

  /** Inputs are capped so the brute-force stage stays walkable. */
  const safeInput = useMemo<DpInput>(() => {
    const recursive = stage === "brute" || stage === "repeat";
    return {
      ...input,
      n: clamp(input.n, 2, recursive ? 8 : 12),
      amount: clamp(input.amount, 1, recursive ? 11 : 16),
      coins: input.coins.slice(0, 4),
      houses: input.houses.slice(0, 7),
      weights: input.weights.slice(0, 4),
      values: input.values.slice(0, 4),
      capacity: clamp(input.capacity, 1, 8),
      a: input.a.slice(0, 5),
      b: input.b.slice(0, 5),
      rows: clamp(input.rows, 2, 5),
      cols: clamp(input.cols, 2, 5),
    };
  }, [input, stage]);

  const steps = useMemo(() => definition.generate(safeInput), [definition, safeInput]);
  const set = (patch: Partial<DpInput>) => setInput((prev) => ({ ...prev, ...patch }));

  const controls = () => {
    switch (spec.slug) {
      case "fibonacci":
      case "climbing-stairs":
        return (
          <NumberField
            id="dp-n"
            label={spec.slug === "fibonacci" ? "n" : "Steps"}
            value={safeInput.n}
            onChange={(n) => set({ n })}
            min={2}
            max={12}
          />
        );
      case "coin-change":
        return (
          <div className="space-y-3">
            <NumberField
              id="dp-amount"
              label="Amount"
              value={safeInput.amount}
              onChange={(amount) => set({ amount })}
              min={1}
              max={16}
            />
            <ArrayInputPanel
              key="coins"
              values={input.coins}
              onChange={(coins) => set({ coins: coins.filter((c) => c > 0) })}
              maxLength={4}
              presets={[
                { label: "1, 2, 5", values: [1, 2, 5] },
                { label: "2, 5, 7", values: [2, 5, 7] },
                { label: "3, 7", values: [3, 7] },
              ]}
            />
          </div>
        );
      case "house-robber":
        return (
          <ArrayInputPanel
            key="houses"
            values={input.houses}
            onChange={(houses) => set({ houses: houses.map((h) => Math.max(0, h)) })}
            maxLength={7}
            presets={[
              { label: "Alternating", values: [2, 7, 9, 3, 1] },
              { label: "Big middle", values: [5, 1, 20, 1, 5] },
              { label: "Flat", values: [4, 4, 4, 4, 4] },
            ]}
          />
        );
      case "knapsack":
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-end gap-3">
              <NumberField
                id="dp-capacity"
                label="Capacity"
                value={safeInput.capacity}
                onChange={(capacity) => set({ capacity })}
                min={1}
                max={8}
              />
              <p className="pb-2 text-xs text-muted-foreground">
                Weights and values are paired by position.
              </p>
            </div>
            <ArrayInputPanel
              key="weights"
              values={input.weights}
              onChange={(weights) => set({ weights: weights.map((w) => Math.max(1, w)) })}
              maxLength={4}
              presets={[
                { label: "Weights 2 3 4", values: [2, 3, 4] },
                { label: "Weights 1 3 4 5", values: [1, 3, 4, 5] },
              ]}
            />
            <ArrayInputPanel
              key="values"
              values={input.values}
              onChange={(values) => set({ values: values.map((v) => Math.max(0, v)) })}
              maxLength={4}
              presets={[
                { label: "Values 3 4 6", values: [3, 4, 6] },
                { label: "Values 2 5 7 9", values: [2, 5, 7, 9] },
              ]}
            />
          </div>
        );
      case "lcs":
        return (
          <div className="flex flex-wrap items-end gap-3">
            {(["a", "b"] as const).map((field) => (
              <div key={field} className="w-32 space-y-1.5">
                <Label htmlFor={`dp-${field}`} className="text-xs text-muted-foreground">
                  String {field.toUpperCase()} (max 5)
                </Label>
                <Input
                  id={`dp-${field}`}
                  value={input[field]}
                  onChange={(e) => set({ [field]: e.target.value.slice(0, 5) } as Partial<DpInput>)}
                  className="font-mono"
                />
              </div>
            ))}
            <p className="pb-2 text-xs text-muted-foreground">
              Try “abcd” vs “acbd” to see matches and mismatches side by side.
            </p>
          </div>
        );
      case "unique-paths":
        return (
          <div className="flex flex-wrap items-end gap-3">
            <NumberField
              id="dp-rows"
              label="Rows"
              value={safeInput.rows}
              onChange={(rows) => set({ rows })}
              min={2}
              max={5}
            />
            <NumberField
              id="dp-cols"
              label="Columns"
              value={safeInput.cols}
              onChange={(cols) => set({ cols })}
              min={2}
              max={5}
            />
          </div>
        );
      case "min-path-sum":
        return (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Grid:</span>
            {GRIDS.map((g) => (
              <Button
                key={g.label}
                size="sm"
                variant={input.grid.length === g.grid.length ? "default" : "secondary"}
                className="h-7 text-xs"
                onClick={() => set({ grid: g.grid })}
              >
                {g.label}
              </Button>
            ))}
            <span className="font-mono text-xs text-muted-foreground">
              costs: {input.grid.map((r) => r.join(",")).join(" / ")}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      renderVisual={(state) => <DpCanvas state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={DP_SPECS.map((s) => ({ slug: s.slug, title: s.title }))}
            active={slug}
            onSelect={(next) => setSlug(next)}
            label="Problem"
          />
          <StagePicker active={stage} onSelect={setStage} />
          <p className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">What one cell means: </span>
            {spec.stateMeaning}
          </p>
          {controls()}
        </div>
      }
    />
  );
}
