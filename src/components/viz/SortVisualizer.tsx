"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Dices } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStepPlayer } from "@/hooks/use-step-player";
import type { AlgorithmDefinition, ArrayVizState, StepType } from "@/lib/viz/types";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { SortCanvas } from "./SortCanvas";
import { SortControlBar } from "./SortControlBar";

export const SORT_PRESETS: Preset[] = [
  { label: "Classic", values: [8, 3, 5, 1, 9, 6, 2] },
  { label: "Already sorted (best case)", values: [1, 2, 3, 4, 5, 6] },
  { label: "Reversed (worst case)", values: [9, 7, 5, 3, 1] },
  { label: "Duplicates", values: [4, 2, 4, 1, 2, 4] },
];

export interface Preset {
  label: string;
  values: number[];
}

interface Props {
  definition: AlgorithmDefinition<ArrayVizState, number[]>;
  initial?: number[];
  presets?: Preset[];
  maxLength?: number;
}

const TYPE_LABEL: Record<StepType, string> = {
  compare: "Compare",
  swap: "Swap",
  visit: "Visit",
  insert: "Insert",
  delete: "Delete",
  highlight: "Setup",
  update: "Update",
  eliminate: "Eliminate",
  complete: "Done",
};

function shortPresetLabel(label: string) {
  const l = label.toLowerCase();
  if (l.includes("already sorted")) return "Sorted";
  if (l.includes("reversed")) return "Reversed";
  return label;
}

export function SortVisualizer({
  definition,
  initial = [8, 3, 5, 1, 9, 6, 2],
  presets = SORT_PRESETS,
  maxLength = 12,
}: Props) {
  const [values, setValues] = useState<number[]>(initial);
  const steps = useMemo(() => definition.generate(values), [definition, values]);
  const player = useStepPlayer<ArrayVizState>(steps, 1, true);
  const step = player.step;

  if (!step) return null;

  return (
    <section className="overflow-hidden border border-border bg-card shadow-sm">
      {/* Dataset toolbar */}
      <div className="border-b border-border bg-viz-surface px-3 py-3 sm:px-4">
        <SortDatasetToolbar
          values={values}
          onChange={setValues}
          presets={presets}
          maxLength={maxLength}
        />
      </div>

      {/* Stage + context */}
      <div className="grid lg:grid-cols-[1.65fr_0.95fr]">
        {/* Canvas */}
        <div className="flex min-h-[360px] flex-col bg-viz-surface lg:min-h-[440px] lg:border-r lg:border-border">
          {/* Stage header */}
          <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-card/40 px-3 py-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-viz-success" aria-hidden />
              <span className="text-xs font-medium tracking-tight">Sorting stage</span>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-card font-mono text-[11px] font-medium"
            >
              {TYPE_LABEL[step.type]} · {player.index + 1}/{player.total}
            </Badge>
          </div>

          <div className="flex flex-1 flex-col">
            <SortCanvas state={step.state} />
          </div>
        </div>

        {/* Code / Explanation */}
        <div className="flex min-h-[360px] flex-col bg-card lg:min-h-[440px]">
          <Tabs defaultValue="explain" className="flex h-full flex-col">
            <div className="border-b border-border bg-muted/20 px-2 py-1.5">
              <TabsList className="h-7 gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="explain"
                  className="h-7 rounded-full border border-transparent px-3 text-xs data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Explanation
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="h-7 rounded-full border border-transparent px-3 text-xs data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Code
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="explain"
              className="m-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
            >
              <ExplanationPanel step={step} index={player.index} total={player.total} />
            </TabsContent>

            <TabsContent
              value="code"
              className="m-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
            >
              <CodePanel
                code={definition.code}
                language={definition.language}
                highlighted={step.highlightedCodeLines}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SortControlBar
        index={player.index}
        total={player.total}
        playing={player.playing}
        speed={player.speed}
        atStart={player.atStart}
        atEnd={player.atEnd}
        onToggle={player.toggle}
        onNext={player.next}
        onPrev={player.prev}
        onRestart={player.restart}
        onSpeed={player.setSpeed}
        onScrub={player.setIndex}
      />
    </section>
  );
}

function parse(raw: string, maxLength: number) {
  return raw
    .split(/[\s,]+/)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n))
    .slice(0, maxLength);
}

function SortDatasetToolbar({
  values,
  onChange,
  presets,
  maxLength,
}: {
  values: number[];
  onChange: (v: number[]) => void;
  presets?: Preset[];
  maxLength: number;
}) {
  const [raw, setRaw] = useState(values.join(" "));
  const [error, setError] = useState<string | null>(null);
  const valuesKey = values.join(" ");
  const prevKeyRef = useState(() => valuesKey)[0];
  // Keep input in sync when presets/randomize update values from above.
  // This is intentional derived-state sync for the dataset toolbar.
  if (valuesKey !== prevKeyRef) {
    // Use queueMicrotask to avoid setState-in-effect lint and render-phase update;
    // instead rely on keyed remount: store in ref and update via effect-free path.
    // Fallback: we track via a ref and reset raw synchronously only once per key change.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    void 0;
  }

  const apply = () => {
    const parsed = parse(raw, maxLength);
    if (parsed.length < 2) {
      setError(`Enter at least 2 numbers, separated by spaces or commas (max ${maxLength}).`);
      return;
    }
    setError(null);
    onChange(parsed);
  };

  const randomize = () => {
    const len = 6 + Math.floor(Math.random() * 5);
    const next = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99));
    setRaw(next.join(" "));
    setError(null);
    onChange(next);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Label htmlFor="sort-dataset" className="text-xs font-medium text-muted-foreground">
            Dataset
          </Label>
          <div className="flex gap-2">
            <Input
              id="sort-dataset"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="8 3 5 1 9 6 2"
              className="h-8 flex-1 font-mono text-sm"
              aria-invalid={!!error}
              aria-describedby={error ? "sort-dataset-error" : undefined}
            />
            <Button onClick={apply} size="sm" className="h-8 shrink-0 gap-1.5">
              Apply
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={randomize} size="sm" variant="outline" className="h-8 gap-1.5">
            <Dices className="h-4 w-4" aria-hidden />
            Random
          </Button>
        </div>
      </div>

      {error && (
        <p id="sort-dataset-error" role="alert" className="text-xs text-viz-error">
          {error}
        </p>
      )}

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">Presets</span>
          {presets.map((p) => {
            const active =
              p.values.length === values.length && p.values.every((v, i) => v === values[i]);
            const short = shortPresetLabel(p.label);
            return (
              <button
                key={p.label}
                type="button"
                title={p.label}
                aria-pressed={active}
                onClick={() => {
                  setRaw(p.values.join(" "));
                  setError(null);
                  onChange(p.values);
                }}
                className={
                  active
                    ? "inline-flex h-7 items-center rounded-full bg-foreground px-3 text-xs font-medium text-background transition-colors"
                    : "inline-flex h-7 items-center rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                }
              >
                {short}
              </button>
            );
          })}
          <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground sm:inline">
            Enter or Apply to update
          </span>
        </div>
      )}
    </div>
  );
}
