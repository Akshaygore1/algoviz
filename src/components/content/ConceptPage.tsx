"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, Bookmark, BookmarkCheck, Check, CircleHelp, Lightbulb } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProblemCard } from "./ProblemCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { getPattern } from "@/data/patterns";
import { problems } from "@/data/problems";
import type { Concept } from "@/data/concepts";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function ConceptPage({ concept, visualizer }: { concept: Concept; visualizer: ReactNode }) {
  const progress = useProgress();
  const { setTopicProgress } = progress;
  const pattern = getPattern(concept.patternId);
  const related = problems.filter((p) => concept.relatedProblemIds.includes(p.id));
  const done = progress.completedConcepts.includes(concept.id);
  const bookmarked = progress.bookmarks.includes(concept.id);

  useEffect(() => {
    setTopicProgress(concept.id, 25);
  }, [concept.id, setTopicProgress]);

  return (
    <AppShell breadcrumb={`${concept.category} / ${concept.title}`}>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{concept.category}</Badge>
            <Badge variant="outline">{concept.difficulty}</Badge>
            {pattern && <Badge variant="outline">Pattern: {pattern.name}</Badge>}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{concept.title}</h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {concept.intuition}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => progress.markConceptComplete(concept.id)}
              variant={done ? "secondary" : "default"}
              size="sm"
            >
              <Check className="h-4 w-4" />
              {done ? "Marked complete" : "Mark concept complete"}
            </Button>
            <Button onClick={() => progress.toggleBookmark(concept.id)} variant="outline" size="sm">
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        </header>

        <Separator />

        <Section id="visual" title="Visual explanation">
          <ul className="space-y-2.5">
            {concept.explanation.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="operations" title="Operations">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operation</TableHead>
                    <TableHead className="w-32">Complexity</TableHead>
                    <TableHead>Why</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {concept.operations.map((op) => (
                    <TableRow key={op.name}>
                      <TableCell className="font-medium">{op.name}</TableCell>
                      <TableCell className="font-mono text-xs">{op.complexity}</TableCell>
                      <TableCell className="text-muted-foreground">{op.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Section>

        <Section id="visualizer" title="Interactive visualizer">
          {visualizer}
        </Section>

        <Section id="complexity" title="Complexity">
          <ComplexityCard complexity={concept.complexity} />
        </Section>

        <Section id="mistakes" title="Common mistakes">
          <Card>
            <CardContent className="space-y-3 pt-6">
              {concept.mistakes.map((m) => (
                <div key={m} className="flex gap-3 text-sm leading-relaxed">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-viz-compare" />
                  <span>{m}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>

        {pattern && (
          <Section id="pattern" title="Interview pattern">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{pattern.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{pattern.summary}</p>
                <div>
                  <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase">
                    How do I recognize this pattern?
                  </h4>
                  <ul className="space-y-1.5">
                    {pattern.recognize.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <pre className="overflow-auto rounded-lg border border-border bg-viz-surface p-3 font-mono text-xs leading-6">
                  {pattern.template}
                </pre>
                <Link
                  href="/patterns"
                  className="inline-block text-sm font-medium text-primary hover:underline"
                >
                  See all interview patterns →
                </Link>
              </CardContent>
            </Card>
          </Section>
        )}

        <Section id="interview" title="Interview tips">
          <Card>
            <CardContent className="space-y-3 pt-6">
              {concept.interviewTips.map((t) => (
                <div key={t} className="flex gap-3 text-sm leading-relaxed">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>

        <Section id="quiz" title="Quick quiz">
          <div className="space-y-4">
            {concept.quiz.map((q) => (
              <QuizCard key={q.question} item={q} />
            ))}
          </div>
        </Section>

        <Section id="problems" title="Practice problems">
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </div>
        </Section>

        <Section id="summary" title="Summary">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {concept.summary.map((s) => (
                <div key={s} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-viz-success" />
                  <span>{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>
      </div>
    </AppShell>
  );
}

function QuizCard({
  item,
}: {
  item: { question: string; options: string[]; answerIndex: number; explanation: string };
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <p className="flex gap-2 text-sm font-medium">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {item.question}
        </p>
        <div className="grid gap-2">
          {item.options.map((opt, i) => {
            const isAnswer = i === item.answerIndex;
            const chosen = picked === i;
            return (
              <button
                key={opt}
                onClick={() => setPicked(i)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  picked === null && "border-border hover:bg-accent",
                  picked !== null && isAnswer && "border-viz-success bg-viz-success/12",
                  picked !== null && chosen && !isAnswer && "border-viz-error bg-viz-error/12",
                  picked !== null && !chosen && !isAnswer && "border-border opacity-60",
                )}
              >
                {opt}
                {picked !== null && isAnswer && <span className="ml-2 font-mono text-xs">✓</span>}
                {picked !== null && chosen && !isAnswer && (
                  <span className="ml-2 font-mono text-xs">✕</span>
                )}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            {item.explanation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
