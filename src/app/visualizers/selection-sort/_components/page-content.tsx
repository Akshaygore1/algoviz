"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { selectionSort } from "@/lib/viz/algorithms/selectionSort";

export default SelectionSortPage;

function SelectionSortPage() {
  return (
    <AppShell breadcrumb="Algorithms / Sorting / Selection Sort">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Sorting</Badge>
            <Badge variant="outline">Beginner</Badge>
            <Badge variant="outline" className="font-mono">
              O(n²)
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{selectionSort.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {selectionSort.tagline} Run the already sorted preset and watch the comparison counter:
            it does not drop at all. Selection sort cannot detect a sorted array, which is the key
            difference from bubble and insertion sort.
          </p>
        </header>

        <SortVisualizer definition={selectionSort} />

        <ComplexityCard complexity={selectionSort.complexity} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Stable? In place?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              In place, yes: only a couple of variables are needed. Stable, no: swapping a distant
              minimum into place can jump equal values past each other. Interviewers like this
              question because it separates people who memorised the code from people who traced it.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Where this shows up in interviews</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Rarely as a coding question, often as a comparison question: "why would you ever use
              selection sort?" The answer is write cost: at most n − 1 swaps, the fewest of any
              simple sort, which matters when a write is far more expensive than a read.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
