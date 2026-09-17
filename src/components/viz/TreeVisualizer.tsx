"use client";

import { useMemo, useState } from "react";
import { TREE_OPS } from "@/lib/viz/algorithms/treeOps";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { TreeCanvas } from "./TreeCanvas";
import { VizWorkspace } from "./VizWorkspace";

const NEEDS_VALUE = new Set(["bst-insert", "bst-search", "bst-delete"]);

export function TreeVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? TREE_OPS[0]!.slug);
  const [values, setValues] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [value, setValue] = useState(45);

  const definition = TREE_OPS.find((o) => o.slug === slug) ?? TREE_OPS[0]!;
  const steps = useMemo(() => definition.generate({ values, value }), [definition, values, value]);

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      complexity={definition.complexity}
      renderVisual={(state) => <TreeCanvas state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={TREE_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
            active={slug}
            onSelect={setSlug}
          />
          <ArrayInputPanel
            values={values}
            onChange={setValues}
            maxLength={12}
            presets={[
              { label: "Balanced", values: [50, 30, 70, 20, 40, 60, 80] },
              { label: "Degenerate (sorted)", values: [10, 20, 30, 40, 50] },
              { label: "Left heavy", values: [50, 40, 60, 30, 20, 10] },
            ]}
          />
          {NEEDS_VALUE.has(slug) && (
            <NumberField
              id="tree-value"
              label={
                slug === "bst-insert"
                  ? "Value to insert"
                  : slug === "bst-search"
                    ? "Value to search"
                    : "Value to delete"
              }
              value={value}
              onChange={setValue}
              min={0}
              max={999}
            />
          )}
        </div>
      }
    />
  );
}
