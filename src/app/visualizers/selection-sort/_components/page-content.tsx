"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { selectionSort } from "@/lib/viz/algorithms/selectionSort";

export default function SelectionSortPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Sorting / Selection Sort"
      title={selectionSort.title}
      intro={`${selectionSort.tagline} Run the sorted preset and watch the comparison counter: selection sort cannot detect an already ordered array.`}
      complexity={selectionSort.complexity}
    >
      <SortVisualizer definition={selectionSort} />
      <section className="mt-10 max-w-3xl border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">Characteristics</h2>
        <dl className="mt-5 divide-y border-y border-border">
          <div className="py-4">
            <dt className="text-[17px] leading-[27px] font-semibold">In place, not stable</dt>
            <dd className="mt-3 text-[17px] leading-[27px] text-muted-foreground">
              It uses O(1) extra space, but swapping the smallest value into place can move equal
              values past each other.
            </dd>
          </div>
          <div className="py-4">
            <dt className="text-[17px] leading-[27px] font-semibold">When to use it</dt>
            <dd className="mt-3 text-[17px] leading-[27px] text-muted-foreground">
              It is useful when writes are expensive: it makes at most n − 1 swaps.
            </dd>
          </div>
        </dl>
      </section>
    </VisualizerPage>
  );
}
