"use client";

import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Progress } from "@/components/ui/progress";
import { roadmap } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";

export default RoadmapPage;

function RoadmapPage() {
  const progress = useProgress();

  return (
    <AppShell breadcrumb="Progress / Roadmap">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Learning roadmap</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Work top to bottom. Each topic is complete when you finish its concept page: visualizer,
          quiz and practice problems included.
        </p>

        <div className="mt-8 divide-y border-y border-border">
          {roadmap.map((track) => {
            const values = track.topics.map((t) => progress.topics[t.id] ?? 0);
            const trackPct = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
            return (
              <section key={track.id} className="py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight">{track.title}</h2>
                  <span className="font-mono text-xs text-muted-foreground">{trackPct}%</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{track.description}</p>
                <div className="mt-5 space-y-3">
                  {track.topics.map((topic) => {
                    const pct = progress.topics[topic.id] ?? 0;
                    return (
                      <div key={topic.id} className="flex items-center gap-3">
                        <div className="w-44 shrink-0 truncate text-sm">
                          {topic.href ? (
                            <Link
                              href={topic.href}
                              className="inline-flex items-center gap-1.5 font-medium hover:text-primary"
                            >
                              {topic.title}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                              <Lock className="h-3 w-3" />
                              {topic.title}
                            </span>
                          )}
                        </div>
                        <Progress value={pct} className="h-2 flex-1" />
                        <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                          {pct}%
                        </span>
                        {pct === 100 && <Check className="h-4 w-4 text-viz-success" />}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
