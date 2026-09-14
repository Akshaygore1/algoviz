"use client";

import { useMemo, useState } from "react";
import type { AlgorithmDefinition, ArrayVizState } from "@/lib/viz/types";
import { ArrayCanvas } from "./ArrayCanvas";
import { ArrayInputPanel, type Preset } from "./ArrayInputPanel";
import { VizWorkspace } from "./VizWorkspace";

export const SORT_PRESETS: Preset[] = [
  { label: "Classic", values: [8, 3, 5, 1, 9, 6, 2] },
  { label: "Already sorted (best case)", values: [1, 2, 3, 4, 5, 6] },
  { label: "Reversed (worst case)", values: [9, 7, 5, 3, 1] },
  { label: "Duplicates", values: [4, 2, 4, 1, 2, 4] },
];

interface Props {
  definition: AlgorithmDefinition<ArrayVizState, number[]>;
  initial?: number[];
  presets?: Preset[];
  maxLength?: number;
}

export function SortVisualizer({
  definition,
  initial = [8, 3, 5, 1, 9, 6, 2],
  presets = SORT_PRESETS,
  maxLength = 12,
}: Props) {
  const [values, setValues] = useState<number[]>(initial);
  const steps = useMemo(() => definition.generate(values), [definition, values]);

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      renderVisual={(state) => <ArrayCanvas state={state} mode="bars" />}
      inputPanel={
        <ArrayInputPanel
          values={values}
          onChange={setValues}
          presets={presets}
          maxLength={maxLength}
        />
      }
    />
  );
}
