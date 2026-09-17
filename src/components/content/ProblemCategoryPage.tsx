"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
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
  recognise: string;
  mistakes: string[];
  problems: ProblemDefinition[];
}

export function ProblemCategoryPage({ title, intro, recognise, mistakes, problems }: Props) {
  const [slug, setSlug] = useState(problems[0]!.slug);
  const definition = problems.find((problem) => problem.slug === slug) ?? problems[0]!;
  const [inputs, setInputs] = useState<Record<string, ProblemInput>>({});
  const input = inputs[definition.slug] ?? definition.defaults;
  const steps = useMemo(() => {
    try {
      return definition.generate(input);
    } catch {
      return [];
    }
  }, [definition, input]);

  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb items={[{ label: "Problems", href: "/problems" }, { label: title }]} />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] sm:text-4xl sm:leading-10">
            {title}
          </h1>
          <p className="mt-5 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
            {intro}
          </p>
        </header>

        <div className="mt-10">
          <OperationPicker
            label="Problem"
            operations={problems.map((problem) => ({ slug: problem.slug, title: problem.title }))}
            active={definition.slug}
            onSelect={setSlug}
          />
        </div>

        <section className="mt-8 max-w-3xl border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">{definition.title}</h2>
          <p className="mt-3 text-[17px] leading-[27px] text-muted-foreground">
            {definition.tagline}
          </p>
        </section>

        <div className="mt-8">
          {steps.length === 0 ? (
            <p className="border-y border-border py-4 text-sm text-muted-foreground">
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
                  onChange={(next) =>
                    setInputs((previous) => ({ ...previous, [definition.slug]: next }))
                  }
                />
              }
            />
          )}
        </div>

        <ComplexityCard
          complexity={definition.complexity}
          articleScale
          className="mt-10 max-w-3xl border-t border-border pt-8"
        />

        <section className="mt-10 max-w-3xl border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Recognising the pattern</h2>
          <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">{recognise}</p>
        </section>

        <section className="mt-10 max-w-3xl border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Common mistakes</h2>
          <ul className="mt-5 divide-y border-y border-border">
            {mistakes.map((mistake) => (
              <li key={mistake} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                {mistake}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
