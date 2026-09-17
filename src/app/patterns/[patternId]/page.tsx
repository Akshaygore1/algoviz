import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PatternVisualizer } from "@/components/viz/PatternVisualizer";
import { getPattern, patterns } from "@/data/patterns";
import { problems } from "@/data/problems";

type Props = { params: Promise<{ patternId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return patterns.map((pattern) => ({ patternId: pattern.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { patternId } = await params;
  const pattern = getPattern(patternId);
  if (!pattern) return { title: "Pattern not found" };
  return {
    title: `${pattern.name}: DSA Interview Pattern`,
    description: pattern.summary,
    openGraph: { title: `${pattern.name}: DSA Interview Pattern`, description: pattern.summary },
  };
}

export default async function PatternPage({ params }: Props) {
  const { patternId } = await params;
  const pattern = getPattern(patternId);
  if (!pattern) notFound();
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
          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Recognize it</h2>
            <ul className="mt-5 divide-y border-y border-border">
              {pattern.recognize.map((cue) => (
                <li key={cue} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                  {cue}
                </li>
              ))}
            </ul>
          </section>
          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Common mistakes</h2>
            <ul className="mt-5 divide-y border-y border-border">
              {pattern.mistakes.map((mistake) => (
                <li key={mistake} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10 max-w-3xl border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Implementation template</h2>
          <pre className="mt-5 overflow-auto border-y border-border bg-viz-surface p-4 font-mono text-xs leading-6">
            <code>{pattern.template}</code>
          </pre>
        </section>

        {related.length > 0 && (
          <section className="mt-10 max-w-3xl border-t border-border pt-8">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Related practice</h2>
            <ul className="mt-5 divide-y border-y border-border">
              {related.slice(0, 5).map((problem) => (
                <li key={problem.id} className="py-3 text-sm text-muted-foreground">
                  {problem.title} <span className="font-mono text-xs">· {problem.difficulty}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/problems"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Explore visualized problems <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </section>
        )}
      </div>
    </AppShell>
  );
}
