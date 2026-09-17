"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RECURSION_OPS } from "@/lib/viz/algorithms/recursion";
import type { FrameVizState } from "@/lib/viz/state";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { CallStackPanel } from "./CallStackPanel";
import { CallTree } from "./CallTree";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { VizCounters } from "./VizCounters";
import { VizLegend } from "./VizLegend";
import { VizWorkspace } from "./VizWorkspace";

const N_LIMITS: Record<string, { label: string; min: number; max: number }> = {
  factorial: { label: "n", min: 1, max: 9 },
  "fibonacci-naive": { label: "n", min: 2, max: 6 },
  "fibonacci-memo": { label: "n", min: 2, max: 12 },
  "tower-of-hanoi": { label: "Discs", min: 1, max: 4 },
};

function RecursionCanvas({ state }: { state: FrameVizState }) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <VizCounters counters={state.counters} />

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <CallStackPanel frames={state.frames} />
        <CallTree nodes={state.treeNodes ?? []} />
      </div>

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

      {state.moves && state.moves.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            {state.movesLabel ?? "moves"} ({state.moves.length})
          </p>
          <ol className="flex flex-wrap gap-1.5">
            {state.moves.map((move, i) => (
              <li
                key={i}
                className="rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {i + 1}. {move}
              </li>
            ))}
          </ol>
        </div>
      )}

      {state.output && (
        <p className="font-mono text-xs text-muted-foreground">
          result: <span className="text-foreground">{state.output}</span>
        </p>
      )}

      <VizLegend states={(state.treeNodes ?? []).map((n) => n.state)} />
    </div>
  );
}

export function RecursionVisualizer() {
  const [slug, setSlug] = useState(RECURSION_OPS[0]!.slug);
  const [n, setN] = useState(5);
  const [values, setValues] = useState<number[]>([4, 8, 2, 7]);
  const [text, setText] = useState("recursion");

  const definition = RECURSION_OPS.find((o) => o.slug === slug) ?? RECURSION_OPS[0]!;
  const steps = useMemo(
    () => definition.generate({ n, values, text }),
    [definition, n, values, text],
  );
  const limits = N_LIMITS[slug];

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      complexity={definition.complexity}
      renderVisual={(state) => <RecursionCanvas state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={RECURSION_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
            active={slug}
            onSelect={setSlug}
            label="Example"
          />

          {limits && (
            <div className="flex flex-wrap items-end gap-3">
              <NumberField
                id="recursion-n"
                label={limits.label}
                value={Math.min(limits.max, Math.max(limits.min, n))}
                onChange={(next) => setN(Math.min(limits.max, Math.max(limits.min, next)))}
                min={limits.min}
                max={limits.max}
              />
              <p className="pb-2 text-xs text-muted-foreground">
                Between {limits.min} and {limits.max}; beyond that the tree stops being readable.
              </p>
            </div>
          )}

          {slug === "sum-array" && (
            <ArrayInputPanel
              values={values}
              onChange={setValues}
              maxLength={8}
              presets={[
                { label: "Small", values: [4, 8, 2, 7] },
                { label: "Longer", values: [5, 1, 9, 3, 6, 2] },
                { label: "With negatives", values: [10, -4, 7, -2] },
              ]}
            />
          )}

          {slug === "reverse-string" && (
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-52 space-y-1.5">
                <Label htmlFor="recursion-text" className="text-xs text-muted-foreground">
                  Word (max 8 characters)
                </Label>
                <Input
                  id="recursion-text"
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 8))}
                  className="font-mono"
                  placeholder="stack"
                />
              </div>
              <p className="pb-2 text-xs text-muted-foreground">
                Every character adds one frame to the stack.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
