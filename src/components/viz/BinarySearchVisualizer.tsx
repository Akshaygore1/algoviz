"use client";

import { useMemo, useState } from "react";
import { binarySearch } from "@/lib/viz/algorithms/binarySearch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrayCanvas } from "./ArrayCanvas";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { VizWorkspace } from "./VizWorkspace";

const presets = [
  { label: "Target in the middle", values: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] },
  { label: "Target at the end", values: [1, 3, 4, 7, 9, 11, 15] },
  { label: "Target missing", values: [4, 8, 15, 16, 23, 42] },
];

export function BinarySearchVisualizer({
  initial = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
  initialTarget = 23,
}: {
  initial?: number[];
  initialTarget?: number;
}) {
  const [values, setValues] = useState<number[]>(initial);
  const [target, setTarget] = useState<number>(initialTarget);
  const steps = useMemo(() => binarySearch.generate({ values, target }), [values, target]);

  return (
    <VizWorkspace
      definition={binarySearch}
      steps={steps}
      renderVisual={(state) => <ArrayCanvas state={state} mode="cells" />}
      inputPanel={
        <ArrayInputPanel
          values={values}
          onChange={setValues}
          presets={presets}
          maxLength={16}
          extra={
            <div className="w-28 space-y-1.5">
              <Label htmlFor="bs-target" className="text-xs text-muted-foreground">
                Target
              </Label>
              <Input
                id="bs-target"
                className="font-mono"
                value={String(target)}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) setTarget(n);
                }}
              />
            </div>
          }
        />
      }
    />
  );
}
