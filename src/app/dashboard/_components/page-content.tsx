"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, Gauge, ListChecks, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { concepts } from "@/data/concepts";
import { problems } from "@/data/problems";
import { allRoadmapTopics } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";
import { readinessScore } from "@/lib/progress";

export default Dashboard;

const TRACKED = allRoadmapTopics.map((t) => t.id);

function Dashboard() {
  const progress = useProgress();
  const score = readinessScore(progress.topics, TRACKED);
  const byDifficulty = (d: "Easy" | "Medium" | "Hard") =>
    progress.solved.filter((s) => s.difficulty === d).length;

  const ranked = allRoadmapTopics
    .map((t) => ({ ...t, pct: progress.topics[t.id] ?? 0 }))
    .sort((a, b) => a.pct - b.pct);
  const visibleTopics = ranked.filter((t) => t.href || t.pct > 0).slice(0, 6);
  const nextUp = ranked.find((t) => t.href);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your progress is saved in this browser.
            </p>
          </div>
          {progress.hydrated && progress.visits.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={progress.reset}>
              <RotateCcw data-icon="inline-start" />
              Reset progress
            </Button>
          ) : null}
        </header>

        <div className="mt-8 grid divide-y border-y border-border py-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-6">
          <Stat
            icon={Flame}
            label="Learning streak"
            value={`${progress.streak} day${progress.streak === 1 ? "" : "s"}`}
          />
          <Stat
            icon={ListChecks}
            label="Concepts completed"
            value={`${progress.completedConcepts.length} / ${concepts.length}`}
          />
          <Stat
            icon={CheckCircle2}
            label="Problems solved"
            value={`${progress.solved.length} / ${problems.length}`}
          />
        </div>

        <section className="border-b border-border py-8">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Gauge className="h-4 w-4 text-primary" />
                Interview readiness
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on concept progress across the roadmap.
              </p>
            </div>
            <div className="ml-auto flex items-baseline gap-2">
              <span className="font-mono text-4xl font-semibold">{score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>

          <Progress value={score} className="mt-5 h-2" />

          <div className="mt-6 grid gap-3">
            {visibleTopics.map((topic) => (
              <div key={topic.id} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-sm">{topic.title}</span>
                <Progress value={topic.pct} className="h-1.5 flex-1" />
                <span className="w-9 text-right font-mono text-xs text-muted-foreground">
                  {topic.pct}%
                </span>
              </div>
            ))}
          </div>

          {score === 0 && (
            <p className="mt-5 text-sm text-muted-foreground">
              Finish a concept page to start filling this in.
            </p>
          )}
        </section>

        <section className="grid gap-8 border-b border-border py-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h2 className="text-base font-semibold">Recommended next</h2>
            {nextUp ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-medium">{nextUp.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start with the least-complete topic that has a page ready.
                  </p>
                </div>
                {nextUp.href && (
                  <Button size="sm" className="sm:ml-auto" asChild>
                    <Link href={nextUp.href}>
                      Study it
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Everything available is complete. More topics are on the way.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold">Problems solved</h2>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              {(["Easy", "Medium", "Hard"] as const).map((difficulty) => (
                <div key={difficulty}>
                  <dt className="text-muted-foreground">{difficulty}</dt>
                  <dd className="mt-1 font-mono">
                    {byDifficulty(difficulty)} /{" "}
                    {problems.filter((p) => p.difficulty === difficulty).length}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/problems"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Open problem set
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="py-3 first:pt-0 last:pb-0 sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
