"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { selectionSort } from "@/lib/viz/algorithms/selectionSort";

export default SelectionSortPage;

function SelectionSortPage() {
  return (
    <AppShell breadcrumb="Algorithms / Sorting / Selection Sort">
      <div className="mx-auto space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <PageBreadcrumb
            items={[
              { label: "Algorithms", href: "/algorithms" },
              { label: "Sorting", href: "/algorithms" },
              { label: "Selection Sort" },
            ]}
          />
          <h1 className="text-2xl font-semibold tracking-tight py-4">{selectionSort.title}</h1>
          <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>{selectionSort.tagline}</p>
            <p>
              Run the already sorted preset and watch the comparison counter: it does not drop at
              all. Selection sort cannot detect a sorted array, which is the key difference from
              bubble and insertion sort.
            </p>
          </div>
        </header>

        <SortVisualizer definition={selectionSort} />

        <ComplexityCard complexity={selectionSort.complexity} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">In place, not stable</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              It sorts in place with O(1) extra space. It is not stable — swapping the smallest
              value into place can move equal values past each other.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">When to use it</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Rarely asked to code. Useful when writes are expensive — it does at most n − 1 swaps,
              the fewest of any simple sort.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
