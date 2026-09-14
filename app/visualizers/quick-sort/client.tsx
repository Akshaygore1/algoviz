"use client";

import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/badge";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { quickSort } from "@/lib/viz/algorithms/quickSort";

export default QuickSortPage;

function QuickSortPage() {
  return (
    <AppShell breadcrumb="Algorithms / Sorting / Quick Sort">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Sorting</Badge>
            <Badge variant="outline">Intermediate</Badge>
            <Badge variant="outline" className="font-mono">
              O(n log n) avg
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{quickSort.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {quickSort.tagline} This uses Lomuto partitioning with the last value as the pivot. Run
            the already sorted preset and compare the comparison counter with the classic preset:
            that gap is the O(n²) worst case appearing in front of you.
          </p>
        </header>

        <SortVisualizer definition={quickSort} initial={[8, 3, 5, 1, 9, 6]} maxLength={10} />

        <ComplexityCard complexity={quickSort.complexity} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Stable? In place?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              In place, apart from O(log n) of recursion stack. Not stable: partition swaps values
              across long distances, so equal values lose their original order. That is why
              libraries use quick sort for numbers and merge-based sorts for objects.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Where this shows up in interviews</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Partitioning is the reusable idea, not the sort. Quickselect finds the kth largest
              element in O(n) average time with the same partition step, and Dutch national flag
              (sort colours) is a three-way version of it.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
