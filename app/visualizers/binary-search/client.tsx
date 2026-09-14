import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BinarySearchVisualizer } from "@/components/viz/BinarySearchVisualizer";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { binarySearch } from "@/lib/viz/algorithms/binarySearch";

export default BinarySearchPage;

function BinarySearchPage() {
  return (
    <AppShell breadcrumb="Algorithms / Searching / Binary Search">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Searching</Badge>
            <Badge variant="outline">Beginner</Badge>
            <Badge variant="outline" className="font-mono">
              O(log n)
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{binarySearch.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {binarySearch.tagline} Your values are sorted automatically before the search runs,
            since binary search is only valid on ordered data. Watch the &ldquo;search space&rdquo;
            counter: it halves on every step, which is the whole idea behind O(log n).
          </p>
        </header>

        <BinarySearchVisualizer />

        <ComplexityCard complexity={binarySearch.complexity} />

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Recognising it in an interview</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>The input is sorted, or the property you are testing is monotonic.</li>
            <li>
              The question asks for a boundary: the first or last value that satisfies something.
            </li>
            <li>Constraints go up to 10⁸–10⁹, which rules out anything linear per query.</li>
          </ul>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/learn/binary-search">Full concept page →</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
