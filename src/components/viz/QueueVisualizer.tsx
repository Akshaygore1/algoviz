"use client";

import { useMemo, useState } from "react";
import { QUEUE_OPS } from "@/lib/viz/algorithms/queueOps";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { QueueRow } from "./QueueRow";
import { VizWorkspace } from "./VizWorkspace";

export function QueueVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? QUEUE_OPS[0]!.slug);
  const [values, setValues] = useState<number[]>([5, 8, 12, 3, 7]);
  const [capacity, setCapacity] = useState(5);

  const definition = QUEUE_OPS.find((o) => o.slug === slug) ?? QUEUE_OPS[0]!;
  const steps = useMemo(
    () => definition.generate({ values, capacity }),
    [definition, values, capacity],
  );

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      complexity={definition.complexity}
      renderVisual={(state) => <QueueRow state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={QUEUE_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
            active={slug}
            onSelect={setSlug}
          />
          <ArrayInputPanel
            values={values}
            onChange={setValues}
            maxLength={8}
            presets={[
              { label: "Five jobs", values: [5, 8, 12, 3, 7] },
              { label: "Three jobs", values: [1, 2, 3] },
            ]}
            extra={
              slug === "circular-queue" ? (
                <NumberField
                  id="q-cap"
                  label="Capacity"
                  value={capacity}
                  onChange={setCapacity}
                  min={3}
                  max={8}
                />
              ) : undefined
            }
          />
        </div>
      }
    />
  );
}
