"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PATTERN_DEMOS } from "@/lib/viz/patternDemos";
import type { PatternId } from "@/data/patterns";
import type { ProblemInput } from "@/lib/viz/problemState";
import { ProblemCanvas } from "./ProblemCanvas";
import { ProblemInputPanel } from "./ProblemInputPanel";
import { VizWorkspace } from "./VizWorkspace";

export function PatternVisualizer({ patternId }: { patternId: PatternId }) {
  const demo = PATTERN_DEMOS[patternId]!;
  const [input, setInput] = useState<ProblemInput>(demo.definition.defaults);
  const steps = useMemo(() => {
    try {
      return demo.definition.generate(input);
    } catch {
      return [];
    }
  }, [demo, input]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3 border-y border-border px-3 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">Try it: {demo.example}</h3>
            <span className="font-mono text-[10px] text-muted-foreground">
              {demo.definition.complexity.timeAverage}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Change the input, then step through the same shape you would explain in an interview.
          </p>
        </div>
        {demo.route && (
          <Link
            href={demo.route}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Full problem set
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>

      {steps.length > 0 ? (
        <VizWorkspace
          definition={demo.definition}
          steps={steps}
          renderVisual={(state) => <ProblemCanvas state={state} />}
          keyboardShortcuts={false}
          inputPanel={
            <ProblemInputPanel
              fields={demo.definition.fields}
              value={input}
              idPrefix={`pattern-${patternId}`}
              onChange={setInput}
            />
          }
        />
      ) : (
        <p className="border-y border-border py-4 text-sm text-muted-foreground">
          Enter a valid input above to run this example.
        </p>
      )}
    </div>
  );
}
