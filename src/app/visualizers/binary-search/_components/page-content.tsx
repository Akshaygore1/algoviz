import Link from "next/link";
import { VisualizerPage } from "@/components/content/VisualizerPage";
import { BinarySearchVisualizer } from "@/components/viz/BinarySearchVisualizer";
import { binarySearch } from "@/lib/viz/algorithms/binarySearch";

export default function BinarySearchPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Searching / Binary Search"
      title={binarySearch.title}
      intro={`${binarySearch.tagline} The search space halves on every step, which is the whole idea behind O(log n).`}
      complexity={binarySearch.complexity}
    >
      <BinarySearchVisualizer />
      <section className="mt-10 max-w-3xl border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">Recognising it</h2>
        <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
          Use binary search when an input is ordered or a yes/no test changes only once as a value
          increases. Boundaries such as the first or last value that works use the same structure.
        </p>
        <Link
          href="/learn/binary-search"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          Learn the full concept
        </Link>
      </section>
    </VisualizerPage>
  );
}
