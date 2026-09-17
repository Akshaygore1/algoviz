"use client";

import { useMemo, useState } from "react";
import { HEAP_OPS } from "@/lib/viz/algorithms/heapOps";
import { Button } from "@/components/ui/button";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { TreeCanvas } from "./TreeCanvas";
import { VizWorkspace } from "./VizWorkspace";

export function HeapVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? HEAP_OPS[0]!.slug);
  const [variant, setVariant] = useState<"min" | "max">("min");
  const [values, setValues] = useState<number[]>([9, 4, 7, 1, 8, 3, 6]);
  const [value, setValue] = useState(2);

  const definition = HEAP_OPS.find((o) => o.slug === slug) ?? HEAP_OPS[0]!;
  const steps = useMemo(
    () => definition.generate({ values, value, variant }),
    [definition, values, value, variant],
  );

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      complexity={definition.complexity}
      renderVisual={(state) => <TreeCanvas state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={HEAP_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
            active={slug}
            onSelect={setSlug}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Heap type:</span>
            {(["min", "max"] as const).map((v) => (
              <Button
                key={v}
                size="sm"
                variant={v === variant ? "default" : "secondary"}
                className="h-7 text-xs"
                onClick={() => setVariant(v)}
                aria-pressed={v === variant}
              >
                {v === "min" ? "Min-heap" : "Max-heap"}
              </Button>
            ))}
          </div>
          <ArrayInputPanel
            values={values}
            onChange={setValues}
            maxLength={15}
            presets={[
              { label: "Random", values: [9, 4, 7, 1, 8, 3, 6] },
              { label: "Already a min-heap", values: [1, 3, 6, 5, 9, 8] },
              { label: "Reverse sorted", values: [9, 8, 7, 6, 5, 4] },
            ]}
            {...(slug === "heap-insert"
              ? {
                  extra: (
                    <NumberField
                      id="heap-value"
                      label="Value to insert"
                      value={value}
                      onChange={setValue}
                      min={0}
                      max={999}
                    />
                  ),
                }
              : {})}
          />
        </div>
      }
    />
  );
}
