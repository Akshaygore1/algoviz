"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { mergeSort } from "@/lib/viz/algorithms/mergeSort";

export default function MergeSortPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Sorting / Merge Sort"
      title={mergeSort.title}
      intro={`${mergeSort.tagline} The second row is the merge buffer: the extra O(n) memory buys a guaranteed O(n log n) run.`}
      complexity={mergeSort.complexity}
    >
      <SortVisualizer definition={mergeSort} initial={[8, 3, 5, 1, 9, 6]} maxLength={10} />
      <section className="mt-10 max-w-3xl border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">What to remember</h2>
        <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
          Merge sort is stable but not in place. Its reusable operation is the merge itself: two
          pointers walk sorted inputs and choose the next smallest value.
        </p>
      </section>
    </VisualizerPage>
  );
}
