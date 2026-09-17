"use client";

import type { AlgorithmStep, StepType } from "@/lib/viz/types";

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

export function ExplanationPanel<T>({
  step,
  index,
  total,
}: {
  step: AlgorithmStep<T>;
  index: number;
  total: number;
}) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-2 px-4 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground">What&apos;s happening</h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          {TYPE_LABEL[step.type]} · {index + 1}/{total}
        </span>
      </header>
      <div className="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-3">
        <p aria-live="polite" className="text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
        <div>
          <h4 className="mb-2 text-[11px] font-semibold text-muted-foreground">Variables</h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(step.variables).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-2 px-2 py-1.5">
                <dt className="font-mono text-[11px] text-muted-foreground">{key}</dt>
                <dd className="font-mono text-xs font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
