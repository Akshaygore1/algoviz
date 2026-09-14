"use client";

import { useMemo, useState } from "react";
import { LINKED_LIST_OPS, type ListInput } from "@/lib/viz/algorithms/linkedList";
import type { ListVizState } from "@/lib/viz/state";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { NodeChain } from "./NodeChain";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { VizWorkspace } from "./VizWorkspace";

const presets = [
  { label: "Short list", values: [7, 3, 9, 1] },
  { label: "Longer list", values: [4, 8, 15, 16, 23, 42] },
  { label: "Sorted", values: [1, 3, 5, 7, 9] },
];

const needsValue = new Set([
  "linked-list-insert-head",
  "linked-list-insert-tail",
  "linked-list-insert-at",
  "linked-list-delete",
  "linked-list-search",
]);

export function LinkedListVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? LINKED_LIST_OPS[0]!.slug);
  const [values, setValues] = useState<number[]>([7, 3, 9, 1]);
  const [value, setValue] = useState(5);
  const [position, setPosition] = useState(2);
  const [second, setSecond] = useState<number[]>([2, 6, 8]);

  const definition = LINKED_LIST_OPS.find((o) => o.slug === slug) ?? LINKED_LIST_OPS[0]!;
  const variant: ListVizState["variant"] = slug === "linked-list-cycle" ? "circular" : "singly";

  const input: ListInput = { values, value, position, variant, second };
  const steps = useMemo(
    () => definition.generate(input),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [definition, values, value, position, second, variant],
  );

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      renderVisual={(state) => <NodeChain state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={LINKED_LIST_OPS.map((o) => ({
              slug: o.slug,
              title: o.title.replace(" a linked list", ""),
            }))}
            active={slug}
            onSelect={setSlug}
          />
          <ArrayInputPanel
            values={values}
            onChange={setValues}
            presets={presets}
            maxLength={10}
            extra={
              <>
                {needsValue.has(slug) && (
                  <NumberField id="ll-value" label="Value" value={value} onChange={setValue} />
                )}
                {slug === "linked-list-insert-at" && (
                  <NumberField
                    id="ll-pos"
                    label="Position"
                    value={position}
                    onChange={setPosition}
                    min={0}
                    max={values.length}
                  />
                )}
                {slug === "linked-list-cycle" && (
                  <NumberField
                    id="ll-cycle"
                    label="Loop to index (-1 = none)"
                    value={position}
                    onChange={setPosition}
                    min={-1}
                    max={Math.max(0, values.length - 1)}
                    className="w-44"
                  />
                )}
              </>
            }
          />
          {slug === "linked-list-merge" && (
            <ArrayInputPanel values={second} onChange={setSecond} maxLength={8} />
          )}
        </div>
      }
    />
  );
}
