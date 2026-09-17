"use client";

import { useMemo, useState } from "react";
import type { AlgorithmDefinition, ArrayVizState } from "@/lib/viz/types";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { SortCanvas } from "./SortCanvas";
import { VizWorkspace } from "./VizWorkspace";

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

export function SortVisualizer({
  definition,
  initial = [8, 3, 5, 1, 9, 6, 2],
  presets = SORT_PRESETS,
  maxLength = 12,
}: Props) {
  const [values, setValues] = useState<number[]>(initial);
  const steps = useMemo(() => definition.generate(values), [definition, values]);

  return (
    <VizWorkspace<ArrayVizState, number[]>
      definition={definition}
      steps={steps}
      renderVisual={(state) => <SortCanvas state={state} />}
      inputPanel={
        <ArrayInputPanel
          values={values}
          onChange={setValues}
          presets={presets}
          maxLength={maxLength}
        />
      }
      keyboardShortcuts
    />
  );
}
