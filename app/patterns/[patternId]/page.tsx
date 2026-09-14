import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { ProblemCard } from "@/components/app/ProblemCard";
import { Badge } from "@/components/ui/badge";
import { PatternVisualizer } from "@/components/viz/PatternVisualizer";
import { getPattern, patterns } from "@/data/patterns";
import { problems } from "@/data/problems";

type Props = {
  params: Promise<{ patternId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return patterns.map((pattern) => ({ patternId: pattern.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { patternId } = await params;
  const pattern = getPattern(patternId);

  if (!pattern) {
    return { title: "Pattern not found" };
  }

  const title = `${pattern.name}: DSA Interview Pattern`;

  return {
    title,
    description: pattern.summary,
    openGraph: { title, description: pattern.summary },
  };
}

export default async function PatternPage({ params }: Props) {
  const { patternId } = await params;
  const pattern = getPattern(patternId);

  if (!pattern) notFound();

  const related = problems.filter((problem) => problem.patternIds.includes(pattern.id));

  return (
    <AppShell breadcrumb={`Interview prep / Patterns / ${pattern.name}`}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <Link
          href="/patterns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All patterns
        </Link>

        <header className="mt-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{pattern.name}</h1>
            <Badge variant="outline" className="font-mono text-[11px]">
              {pattern.complexity}
            </Badge>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {pattern.summary}
          </p>
        </header>

        <section aria-labelledby="interactive-example" className="mt-8">
          <div className="mb-3 flex items-center justify-between border-b pb-3">
            <h2 id="interactive-example" className="text-sm font-semibold">
              Interactive example
            </h2>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Change the input, then step through the solution
            </span>
          </div>
          <PatternVisualizer patternId={pattern.id} />
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <section aria-labelledby="recognize-pattern">
            <h2 id="recognize-pattern" className="border-b pb-3 text-sm font-semibold">
              Recognize this pattern
            </h2>
            <ul className="mt-4 space-y-3">
              {pattern.recognize.map((cue) => (
                <li key={cue} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="font-medium text-primary">
                    →
                  </span>
                  {cue}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="common-mistakes">
            <h2 id="common-mistakes" className="border-b pb-3 text-sm font-semibold">
              Common mistakes
            </h2>
            <ul className="mt-4 space-y-3">
              {pattern.mistakes.map((mistake) => (
                <li
                  key={mistake}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span aria-hidden="true" className="font-semibold text-viz-compare">
                    !
                  </span>
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="pattern-template" className="mt-10">
          <h2 id="pattern-template" className="border-b pb-3 text-sm font-semibold">
            Implementation template
          </h2>
          <pre className="mt-4 overflow-auto rounded-lg border bg-viz-surface p-4 font-mono text-xs leading-6">
            <code>{pattern.template}</code>
          </pre>
        </section>

        <section aria-labelledby="practice-problems" className="mt-10">
          <div className="flex items-end justify-between border-b pb-3">
            <h2 id="practice-problems" className="text-sm font-semibold">
              Practice problems
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {related.length} available
            </span>
          </div>
          {related.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Practice problems for this pattern are coming soon.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
