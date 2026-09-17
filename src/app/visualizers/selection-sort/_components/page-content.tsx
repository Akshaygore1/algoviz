"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { ComplexityCard } from "@/components/viz/ComplexityCard";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { selectionSort } from "@/lib/viz/algorithms/selectionSort";

export default SelectionSortPage;

function SelectionSortPage() {
  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16">
        <header className="max-w-3xl">
          <PageBreadcrumb
            items={[
              { label: "Algorithms", href: "/algorithms" },
              { label: "Sorting", href: "/algorithms" },
              { label: "Selection Sort" },
            ]}
          />
          <h1 className="mt-6 text-lg leading-8.5 font-semibold tracking-[-0.04em] text-balance sm:text-4xl sm:leading-10">
            {selectionSort.title}
          </h1>
          <div className="mt-5 max-w-[70ch] space-y-5 text-[17px] leading-6.75 text-muted-foreground">
            <p>{selectionSort.tagline}</p>
            <p>
              Run the already sorted preset and watch the comparison counter: it does not drop at
              all. Selection sort cannot detect a sorted array, which is the key difference from
              bubble and insertion sort.
            </p>
          </div>
        </header>

        <div className="mt-10">
          <SortVisualizer definition={selectionSort} />
        </div>

        <ComplexityCard
          complexity={selectionSort.complexity}
          articleScale
          className="mt-9 max-w-3xl pt-0"
        />

        <section aria-labelledby="characteristics-heading" className="mt-9 max-w-3xl">
          <h2
            id="characteristics-heading"
            className="text-xl leading-[26px] font-semibold tracking-[-0.02em] sm:text-2xl sm:leading-8 sm:tracking-[-0.04em]"
          >
            Characteristics
          </h2>

          <dl className="mt-3">
            <div className="py-3">
              <dt className="text-[17px] leading-[27px] font-semibold">In place, not stable</dt>
              <dd className="mt-3 text-[17px] leading-[27px] text-muted-foreground">
                It sorts in place with O(1) extra space. It is not stable. Swapping the smallest
                value into place can move equal values past each other.
              </dd>
            </div>
            <div className="mt-2 py-3">
              <dt className="text-[17px] leading-[27px] font-semibold">When to use it</dt>
              <dd className="mt-3 text-[17px] leading-[27px] text-muted-foreground">
                Rarely asked to code. Useful when writes are expensive. It does at most n − 1 swaps,
                the fewest of any simple sort.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </AppShell>
  );
}
