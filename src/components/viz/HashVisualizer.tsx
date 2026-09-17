"use client";

import { useMemo, useState } from "react";
import { HASH_OPS } from "@/lib/viz/algorithms/hashing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { BucketTable } from "./BucketTable";
import { NumberField } from "./NumberField";
import { OperationPicker } from "./OperationPicker";
import { VizWorkspace } from "./VizWorkspace";

export function HashVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? HASH_OPS[0]!.slug);
  const [keysText, setKeysText] = useState("cat dog bird fish owl");
  const [lookup, setLookup] = useState("dog");
  const [bucketCount, setBucketCount] = useState(5);
  const [values, setValues] = useState<number[]>([2, 7, 11, 15]);
  const [target, setTarget] = useState(18);

  const definition = HASH_OPS.find((o) => o.slug === slug) ?? HASH_OPS[0]!;
  const keys = keysText
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 8);
  const steps = useMemo(
    () => definition.generate({ keys, buckets: bucketCount, lookup, values, target }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [definition, keysText, bucketCount, lookup, values, target],
  );

  const isTwoSum = slug === "two-sum-hash";

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      complexity={definition.complexity}
      renderVisual={(state) => <BucketTable state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={HASH_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
            active={slug}
            onSelect={setSlug}
          />
          {isTwoSum ? (
            <ArrayInputPanel
              values={values}
              onChange={setValues}
              maxLength={8}
              presets={[
                { label: "Classic", values: [2, 7, 11, 15] },
                { label: "No answer", values: [1, 2, 3] },
              ]}
              extra={
                <NumberField id="hash-target" label="Target" value={target} onChange={setTarget} />
              }
            />
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-52 flex-1 space-y-1.5">
                <Label htmlFor="hash-keys" className="text-xs text-muted-foreground">
                  Keys (space separated)
                </Label>
                <Input
                  id="hash-keys"
                  value={keysText}
                  onChange={(e) => setKeysText(e.target.value)}
                  className="font-mono"
                />
              </div>
              {slug === "hash-lookup" && (
                <div className="w-32 space-y-1.5">
                  <Label htmlFor="hash-lookup" className="text-xs text-muted-foreground">
                    Look up
                  </Label>
                  <Input
                    id="hash-lookup"
                    value={lookup}
                    onChange={(e) => setLookup(e.target.value)}
                    className="font-mono"
                  />
                </div>
              )}
              <NumberField
                id="hash-buckets"
                label="Buckets"
                value={bucketCount}
                onChange={setBucketCount}
                min={3}
                max={8}
              />
            </div>
          )}
        </div>
      }
    />
  );
}
