"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { insertionSort } from "@/lib/viz/algorithms/insertionSort";

export default InsertionSortPage;

function InsertionSortPage() {
  return (
    <AppShell breadcrumb="Algorithms / Sorting / Insertion Sort">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Sorting</Badge>
            <Badge variant="outline">Beginner</Badge>
            <Badge variant="outline" className="font-mono">
              O(n²)
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{insertionSort.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {insertionSort.tagline} It is exactly how you sort a hand of cards. Try the already
            sorted preset: the shift counter stays at zero and the whole run finishes in one pass,
            which is the O(n) best case.
          </p>
        </header>

        <SortVisualizer definition={insertionSort} />

        <ComplexityCard complexity={insertionSort.complexity} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Stable? In place?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Both. The shift condition is <span className="font-mono">arr[j] &gt; key</span>, not
              <span className="font-mono"> &gt;=</span>, so equal values never hop over each other;
              that single character is what makes it stable.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Where this shows up in interviews</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Insertion sort is the sort real libraries fall back to for small chunks, so "why is
              O(n²) sometimes faster than O(n log n)?" is a fair follow-up. The answer: tiny inputs,
              nearly sorted data and almost no overhead per element.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
