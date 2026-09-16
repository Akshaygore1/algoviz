import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { BubbleSortVisualizer } from "@/components/viz/BubbleSortVisualizer";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { bubbleSort } from "@/lib/viz/algorithms/bubbleSort";

export default BubbleSortPage;

function BubbleSortPage() {
  return (
    <AppShell breadcrumb="Algorithms / Sorting / Bubble Sort">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Sorting</Badge>
            <Badge variant="outline">Beginner</Badge>
            <Badge variant="outline" className="font-mono">
              O(n²)
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{bubbleSort.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {bubbleSort.tagline} Try the reversed preset to see the worst case, then the sorted
            preset: a single pass with no swaps proves the array is already ordered, which is why
            the best case is O(n).
          </p>
        </header>

        <BubbleSortVisualizer />

        <ComplexityCard complexity={bubbleSort.complexity} />

        <section aria-labelledby="interviews-heading" className="pt-2">
          <h2 id="interviews-heading" className="text-base font-semibold">
            Where this shows up in interviews
          </h2>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted-foreground">
            Nobody will ask you to write bubble sort to impress them; they ask it to check whether
            you can reason about nested loops and complexity. The valuable takeaway is the
            comparison count: it grows with n², which is exactly the cost you are trying to avoid in
            array questions by reaching for hashing, two pointers or a sliding window.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
