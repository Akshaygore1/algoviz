"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PatternVisualizer } from "@/components/viz/PatternVisualizer";
import { getPattern } from "@/data/patterns";
import { problems } from "@/data/problems";

export default function PatternPageContent({ patternId }: { patternId: string }) {
  const pattern = getPattern(patternId);
  if (!pattern) return null;

  const related = problems.filter((problem) => problem.patternIds.includes(pattern.id));

  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb
            items={[{ label: "Patterns", href: "/patterns" }, { label: pattern.name }]}
          />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] text-balance sm:text-4xl sm:leading-10">
            {pattern.name}
          </h1>
          <p className="mt-5 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
            {pattern.summary}
          </p>
        </header>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Interactive example</h2>
          <p className="mt-3 text-[17px] leading-[27px] text-muted-foreground">
            Change the input, then walk through the solution one step at a time.
          </p>
          <div className="mt-5">
            <PatternVisualizer patternId={pattern.id} />
          </div>
        </section>

        <div className="mt-10 grid max-w-3xl gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Recognize it</h2>
            <ul className="mt-5">
              {pattern.recognize.map((cue) => (
                <li key={cue} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                  {cue}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Common mistakes</h2>
            <ul className="mt-5">
              {pattern.mistakes.map((mistake) => (
                <li key={mistake} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Implementation template</h2>
          <pre className="mt-5 overflow-auto bg-viz-surface p-4 font-mono text-xs leading-6">
            <code>{pattern.template}</code>
          </pre>
        </section>

        {related.length > 0 && (
          <section className="mt-10 max-w-3xl">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Related practice</h2>
            <ul className="mt-5">
              {related.slice(0, 5).map((problem) => (
                <li key={problem.id} className="py-3 text-sm text-muted-foreground">
                  {problem.title}
                </li>
              ))}
            </ul>
            <Link
              href="/problems"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Explore visualized problems
            </Link>
          </section>
        )}
      </div>
    </AppShell>
  );
}
