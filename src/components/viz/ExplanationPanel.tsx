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
    <section aria-label="Current step explanation" className="flex h-full min-h-0 flex-col bg-card">
      <header className="flex items-center justify-between gap-3 px-4 py-2.5">
        <h3 className="text-sm font-semibold text-foreground">Explanation</h3>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
          {TYPE_LABEL[step.type]} · {index + 1}/{total}
        </span>
      </header>

      <div
        key={step.id}
        className="viz-explanation-enter flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-4 pb-3"
      >
        <p aria-live="polite" className="text-sm leading-6 text-foreground">
          {step.description}
        </p>

        {Object.keys(step.variables).length > 0 && (
          <dl className="flex flex-wrap gap-x-5 gap-y-2">
            {Object.entries(step.variables).map(([key, value]) => (
              <div key={key} className="flex items-baseline gap-2">
                <dt className="font-mono text-[11px] text-muted-foreground">{key}</dt>
                <dd className="font-mono text-xs font-semibold text-foreground">{String(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
