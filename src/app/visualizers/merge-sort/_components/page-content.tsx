"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { mergeSort } from "@/lib/viz/algorithms/mergeSort";

export default MergeSortPage;

function MergeSortPage() {
  return (
    <AppShell breadcrumb="Algorithms / Sorting / Merge Sort">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Sorting</Badge>
            <Badge variant="outline">Intermediate</Badge>
            <Badge variant="outline" className="font-mono">
              O(n log n)
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{mergeSort.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {mergeSort.tagline} Values outside the range currently being worked on are dimmed, and
            the second row is the merge buffer: the extra O(n) memory merge sort pays for its
            guaranteed O(n log n).
          </p>
        </header>

        <SortVisualizer definition={mergeSort} initial={[8, 3, 5, 1, 9, 6]} maxLength={10} />

        <ComplexityCard complexity={mergeSort.complexity} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Stable? In place?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Stable, as long as the merge takes from the left half on ties (
              <span className="font-mono">left[i] &lt;= right[j]</span>). Not in place: it needs an
              O(n) buffer, which is the usual trade-off question against quick sort.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Where this shows up in interviews</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The merge step itself is the interview payload: merge two sorted lists, merge k sorted
              lists, sort a linked list, count inversions. If you can write merge cleanly with two
              pointers, all of those become variations.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
