"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { insertionSort } from "@/lib/viz/algorithms/insertionSort";

export default function InsertionSortPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Sorting / Insertion Sort"
      title={insertionSort.title}
      intro={`${insertionSort.tagline} Try the sorted preset: the shift counter stays at zero, which makes the best case linear.`}
      complexity={insertionSort.complexity}
    >
      <SortVisualizer definition={insertionSort} />
      <section className="mt-10 max-w-3xl border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">What to remember</h2>
        <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
          Insertion sort is stable and in place. It is useful for very small or nearly sorted
          inputs, where its low overhead can outweigh a more complex O(n log n) sort.
        </p>
      </section>
    </VisualizerPage>
  );
}
