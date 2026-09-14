import type { ReactNode } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import type { ComplexityInfo } from "@/lib/viz/types";

interface Props {
  breadcrumb: string;
  badges: string[];
  title: string;
  intro: string;
  children: ReactNode;
  complexity?: ComplexityInfo;
  interviewNote?: { heading: string; body: string; to?: string; linkLabel?: string };
}

/** Shared layout for every visualizer page so they all read the same way. */
export function VisualizerPage({
  breadcrumb,
  badges,
  title,
  intro,
  children,
  complexity,
  interviewNote,
}: Props) {
  return (
    <AppShell breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((b, i) => (
              <Badge
                key={b}
                variant={i === 0 ? "secondary" : "outline"}
                className={i > 1 ? "font-mono" : undefined}
              >
                {b}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
        </header>

        {children}

        {complexity && <ComplexityCard complexity={complexity} />}

        {interviewNote && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">{interviewNote.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {interviewNote.body}
            </p>
            {interviewNote.to && (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href={interviewNote.to}>{interviewNote.linkLabel ?? "Learn more →"}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
