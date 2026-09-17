import { VisualizerPage } from "@/components/content/VisualizerPage";
import { BubbleSortVisualizer } from "@/components/viz/BubbleSortVisualizer";
import { bubbleSort } from "@/lib/viz/algorithms/bubbleSort";

export default function BubbleSortPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Sorting / Bubble Sort"
      title={bubbleSort.title}
      intro={`${bubbleSort.tagline} Try the reversed preset to see the worst case, then the sorted preset: a single pass with no swaps proves the array is already ordered.`}
      complexity={bubbleSort.complexity}
    >
      <BubbleSortVisualizer />
      <section className="mt-10 max-w-3xl border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">When it matters</h2>
        <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
          Bubble sort is mainly useful for seeing nested-loop cost. The comparison count grows with
          n², exactly the work you avoid by reaching for a hash map, two pointers, or a window.
        </p>
      </section>
    </VisualizerPage>
  );
}
