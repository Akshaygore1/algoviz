"use client";

import { useMemo, useState } from "react";
import { STACK_OPS } from "@/lib/viz/algorithms/stackOps";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrayInputPanel } from "./ArrayInputPanel";
import { ComplexityCard } from "./ComplexityCard";
import { OperationPicker } from "./OperationPicker";
import { StackColumn } from "./StackColumn";
import { VizWorkspace } from "./VizWorkspace";

export function StackVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? STACK_OPS[0]!.slug);
  const [values, setValues] = useState<number[]>([4, 9, 2, 7]);
  const [text, setText] = useState("{[()]}");

  const definition = STACK_OPS.find((o) => o.slug === slug) ?? STACK_OPS[0]!;
  const steps = useMemo(() => definition.generate({ values, text }), [definition, values, text]);

  return (
    <>
      <VizWorkspace
        definition={definition}
        steps={steps}
        renderVisual={(state) => <StackColumn state={state} />}
        inputPanel={
          <div className="space-y-3">
            <OperationPicker
              operations={STACK_OPS.map((o) => ({ slug: o.slug, title: o.title }))}
              active={slug}
              onSelect={setSlug}
            />
            {slug === "valid-parentheses" ? (
              <div className="max-w-sm space-y-1.5">
                <Label htmlFor="stack-text" className="text-xs text-muted-foreground">
                  Bracket string
                </Label>
                <Input
                  id="stack-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="{[()]}"
                  className="font-mono"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {["{[()]}", "([)]", "(((", "()[]{}"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setText(t)}
                      className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ArrayInputPanel
                values={values}
                onChange={setValues}
                maxLength={9}
                presets={[
                  { label: "Mixed", values: [4, 9, 2, 7] },
                  { label: "Increasing", values: [1, 2, 3, 4] },
                  { label: "Decreasing", values: [9, 7, 5, 3] },
                ]}
              />
            )}
          </div>
        }
      />
      <ComplexityCard complexity={definition.complexity} articleScale className="mt-9 max-w-3xl" />
    </>
  );
}
