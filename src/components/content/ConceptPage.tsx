import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import type { Concept } from "@/data/concepts";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="max-w-3xl border-t border-border pt-8">
      <h2 className="text-xl leading-[26px] font-semibold tracking-[-0.02em] sm:text-2xl sm:leading-8">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ConceptPage({ concept, visualizer }: { concept: Concept; visualizer: ReactNode }) {
  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb
            items={[
              {
                label: concept.category,
                href: concept.category === "Algorithms" ? "/algorithms" : "/data-structures",
              },
              { label: concept.title },
            ]}
          />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] text-balance sm:text-4xl sm:leading-10">
            {concept.title}
          </h1>
          <p className="mt-5 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
            {concept.intuition}
          </p>
        </header>

        <Section id="key-ideas" title="Key ideas">
          <ul className="mt-5 divide-y border-y border-border">
            {concept.explanation.map((line) => (
              <li key={line} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                {line}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="operations" title="Operations">
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-y border-border text-muted-foreground">
                <tr>
                  <th className="py-3 pr-6 font-medium">Operation</th>
                  <th className="py-3 pr-6 font-medium">Complexity</th>
                  <th className="py-3 font-medium">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {concept.operations.map((operation) => (
                  <tr key={operation.name}>
                    <td className="py-3 pr-6 font-medium">{operation.name}</td>
                    <td className="py-3 pr-6 font-mono text-xs">{operation.complexity}</td>
                    <td className="py-3 text-muted-foreground">{operation.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <section id="visualizer" className="mt-10">
          <h2 className="text-xl leading-[26px] font-semibold tracking-[-0.02em] sm:text-2xl sm:leading-8">
            Visualizer
          </h2>
          <div className="mt-5">{visualizer}</div>
        </section>

        <ComplexityCard
          complexity={concept.complexity}
          articleScale
          className="mt-10 max-w-3xl border-t border-border pt-8"
        />

        <Section id="mistakes" title="Common mistakes">
          <ul className="mt-5 divide-y border-y border-border">
            {concept.mistakes.map((mistake) => (
              <li key={mistake} className="py-4 text-[17px] leading-[27px] text-muted-foreground">
                {mistake}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="next" title="Continue learning">
          <Link
            href={`/patterns/${concept.patternId}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Explore the {concept.patternId.replaceAll("-", " ")} pattern
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </Section>
      </div>
    </AppShell>
  );
}
