import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { PageBreadcrumb, type PageBreadcrumbItem } from "@/components/layout/PageBreadcrumb";
import type { ComplexityInfo } from "@/lib/viz/types";

interface Props {
  breadcrumb: string;
  breadcrumbs?: PageBreadcrumbItem[];
  title: string;
  intro: string;
  children: ReactNode;
  complexity?: ComplexityInfo;
  note?: { title: string; body: string };
}

const BREADCRUMB_LINKS: Record<string, string> = {
  Algorithms: "/algorithms",
  "Data Structures": "/data-structures",
  Visualizers: "/visualizers",
  Patterns: "/patterns",
  Problems: "/problems",
  Roadmap: "/roadmap",
};

/** Shared article layout for every visualizer page. */
export function VisualizerPage({
  breadcrumb,
  breadcrumbs,
  title,
  intro,
  children,
  complexity,
  note,
}: Props) {
  const items =
    breadcrumbs ??
    breadcrumb.split(" / ").map((label, index, all) => {
      const href = index === all.length - 1 ? undefined : BREADCRUMB_LINKS[label];
      return href ? { label, href } : { label };
    });

  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb items={items} />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] text-balance sm:text-4xl sm:leading-10">
            {title}
          </h1>
          <p className="mt-5 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
            {intro}
          </p>
        </header>

        <div className="mt-10">{children}</div>

        {complexity && (
          <ComplexityCard complexity={complexity} articleScale className="mt-9 max-w-3xl" />
        )}
        {note && (
          <section className="mt-10 max-w-3xl border-t border-border pt-8">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">{note.title}</h2>
            <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">{note.body}</p>
          </section>
        )}
      </div>
    </AppShell>
  );
}
