"use client";

import { useEffect, useMemo, useState } from "react";
import { bubbleSort } from "@/lib/viz/algorithms/bubbleSort";
import { ArrayCanvas } from "@/components/viz/ArrayCanvas";
import { usePrefersReducedMotion } from "@/hooks/use-step-player";

/** Self-running mini demo for the homepage hero. */
export function HeroDemo() {
  const steps = useMemo(() => bubbleSort.generate([8, 3, 5, 1, 9, 6]), []);
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((prev) => (prev + 1) % steps.length), 1100);
    return () => clearInterval(t);
  }, [steps.length, reduced]);

  const step = steps[i] ?? steps[0];
  if (!step) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-viz-error/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-viz-compare/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-viz-success/70" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          bubbleSort.ts: step {i + 1}/{steps.length}
        </span>
      </div>
      <div className="bg-viz-surface">
        <ArrayCanvas state={step.state} mode="bars" />
      </div>
      <div className="grid gap-0 border-t border-border sm:grid-cols-2">
        <div className="border-border p-4 sm:border-r">
          <div className="font-mono text-[11px] leading-6" aria-label="Bubble sort code excerpt">
            {bubbleSort.code.slice(3, 8).map((line, idx) => {
              const lineNo = idx + 4;
              const active = step.highlightedCodeLines.includes(lineNo);
              return (
                <div
                  key={lineNo}
                  className={active ? "border-l-2 border-primary bg-primary/12 pl-2" : "pl-2.5"}
                >
                  <span className="mr-3 text-muted-foreground/60">{lineNo}</span>
                  <code>{line.trim()}</code>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        </div>
      </div>
    </div>
  );
}
