"use client";

import { Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPatternNames } from "@/data/patterns";
import type { Problem } from "@/data/problems";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const DIFF_CLASS: Record<Problem["difficulty"], string> = {
  Easy: "text-viz-success border-viz-success/40",
  Medium: "text-viz-compare border-viz-compare/50",
  Hard: "text-viz-error border-viz-error/40",
};

export function ProblemCard({ problem }: { problem: Problem }) {
  const progress = useProgress();
  const solved = progress.solved.some((s) => s.id === problem.id);

  return (
    <Card className={cn("transition-colors", solved && "border-viz-success/40")}>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm leading-snug font-medium">{problem.title}</h3>
          <button
            onClick={() => progress.toggleSolved(problem.id, problem.difficulty)}
            aria-pressed={solved}
            aria-label={solved ? "Mark as unsolved" : "Mark as solved"}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            {solved ? (
              <Check className="h-4 w-4 text-viz-success" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={cn("text-[11px]", DIFF_CLASS[problem.difficulty])}>
            {problem.difficulty}
          </Badge>
          {problem.topics.map((t) => (
            <Badge key={t} variant="secondary" className="text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
        <dl className="space-y-1 text-[11px] text-muted-foreground">
          <div className="flex gap-1.5">
            <dt>Pattern:</dt>
            <dd className="text-foreground">{getPatternNames(problem.patternIds).join(" / ")}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Companies:</dt>
            <dd>{problem.companies.join(", ")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
