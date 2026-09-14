"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { OperationPicker } from "@/components/viz/OperationPicker";
import { ProblemCanvas } from "@/components/viz/ProblemCanvas";
import { ProblemInputPanel } from "@/components/viz/ProblemInputPanel";
import { VizWorkspace } from "@/components/viz/VizWorkspace";
import type { ProblemDefinition, ProblemInput, ProblemVizState } from "@/lib/viz/problemState";

interface Props {
  breadcrumb: string;
  title: string;
  intro: string;
  /** How to spot this family of problems in an interview. */
  recognise: string;
  mistakes: string[];
  problems: ProblemDefinition[];
}

/** Shared shell for a category of interview problems with a problem picker. */
export function ProblemCategoryPage({
  breadcrumb,
  title,
  intro,
  recognise,
  mistakes,
  problems,
}: Props) {
  const [slug, setSlug] = useState(problems[0]!.slug);
  const definition = problems.find((p) => p.slug === slug) ?? problems[0]!;
  const [inputs, setInputs] = useState<Record<string, ProblemInput>>({});
  const input = inputs[definition.slug] ?? definition.defaults;

  const steps = useMemo(() => {
    try {
      return definition.generate(input);
    } catch {
      return [];
    }
  }, [definition, input]);

  const select = (next: string) => {
    setSlug(next);
  };

  return (
    <AppShell breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Interview pattern</Badge>
            <Badge variant="outline">{problems.length} problems</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
        </header>

        <div className="space-y-4">
          <OperationPicker
            label="Problem"
            operations={problems.map((p) => ({ slug: p.slug, title: p.title }))}
            active={definition.slug}
            onSelect={select}
          />

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{definition.title}</h2>
              <Badge variant="outline">{definition.difficulty}</Badge>
              <Badge variant="outline" className="font-mono text-[11px]">
                {definition.pattern}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {definition.tagline}
            </p>
          </div>

          {steps.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Enter a valid input above to run this problem.
            </p>
          ) : (
            <VizWorkspace<ProblemVizState, ProblemInput>
              definition={definition}
              steps={steps}
              renderVisual={(state) => <ProblemCanvas state={state} />}
              inputPanel={
                <ProblemInputPanel
                  fields={definition.fields}
                  value={input}
                  onChange={(next) => setInputs((prev) => ({ ...prev, [definition.slug]: next }))}
                />
              }
            />
          )}
        </div>

        <ComplexityCard complexity={definition.complexity} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">What this problem teaches</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {definition.insight}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Recognising the pattern</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recognise}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Common mistakes</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {mistakes.map((m) => (
              <li key={m} className="flex gap-2">
                <span aria-hidden className="text-viz-error">
                  ✕
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
