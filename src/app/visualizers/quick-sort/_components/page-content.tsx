"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { quickSort } from "@/lib/viz/algorithms/quickSort";

export default function QuickSortPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Sorting / Quick Sort"
      title={quickSort.title}
      intro={`${quickSort.tagline} Run the sorted preset and compare it with the classic input to see the O(n²) worst case of this pivot strategy.`}
      complexity={quickSort.complexity}
    >
      <SortVisualizer definition={quickSort} initial={[8, 3, 5, 1, 9, 6]} maxLength={10} />
      <section className="mt-10 max-w-3xl border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">What to remember</h2>
        <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
          Partitioning is the important move. It also powers quickselect, which finds a k-th value
          without fully sorting the array.
        </p>
      </section>
    </VisualizerPage>
  );
}
