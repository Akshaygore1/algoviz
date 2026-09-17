import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default VisualizersIndex;

const ready = [
  {
    to: "/visualizers/bubble-sort" as const,
    title: "Bubble Sort",
    body: "Neighbour comparisons and swaps, with live counters, an early-exit best case and the sorted region locking in from the right.",
    meta: "Sorting · O(n²)",
  },
  {
    to: "/visualizers/selection-sort" as const,
    title: "Selection Sort",
    body: "Scan the unsorted region for the smallest value, then one swap per pass, with a comparison count that never drops, even when sorted.",
    meta: "Sorting · O(n²)",
  },
  {
    to: "/visualizers/insertion-sort" as const,
    title: "Insertion Sort",
    body: "A growing sorted prefix, the key lifted out and larger values shifting right until it drops into place. O(n) on sorted input.",
    meta: "Sorting · O(n²)",
  },
  {
    to: "/visualizers/merge-sort" as const,
    title: "Merge Sort",
    body: "Divide and conquer: ranges split down to single values, then two read pointers merge into a working buffer shown under the array.",
    meta: "Sorting · O(n log n)",
  },
  {
    to: "/visualizers/quick-sort" as const,
    title: "Quick Sort",
    body: "Lomuto partitioning: pivot, moving boundary, and each pivot landing in its final slot, plus the sorted-input worst case.",
    meta: "Sorting · O(n log n) avg",
  },
  {
    to: "/visualizers/binary-search" as const,
    title: "Binary Search",
    body: "left, mid and right pointers with the eliminated half shaded out after every comparison.",
    meta: "Searching · O(log n)",
  },
  {
    to: "/visualizers/linked-list" as const,
    title: "Linked List",
    body: "Singly, doubly and circular lists: insert, delete, search, reverse, find middle and Floyd's cycle detection with prev/current/next animated.",
    meta: "Data structure · O(1) insert at head",
  },
  {
    to: "/visualizers/stack" as const,
    title: "Stack",
    body: "Push, pop and peek, plus valid parentheses and the monotonic stack behind next greater element.",
    meta: "Data structure · O(1)",
  },
  {
    to: "/visualizers/queue" as const,
    title: "Queue",
    body: "Enqueue and dequeue, the circular queue that reuses freed slots, and a double-ended deque.",
    meta: "Data structure · O(1)",
  },
  {
    to: "/visualizers/strings" as const,
    title: "Strings",
    body: "Character traversal, frequency maps, palindrome two-pointers and the sliding window for longest unique substring.",
    meta: "Data structure · O(n)",
  },
  {
    to: "/visualizers/hashing" as const,
    title: "Hash Map",
    body: "Watch the hash function pick a bucket, see a collision chain form, and follow two-sum resolving in one pass.",
    meta: "Data structure · O(1) average",
  },
  {
    to: "/visualizers/tree" as const,
    title: "Binary Search Tree",
    body: "Insert, search and all three delete cases, plus inorder, preorder, postorder and level-order traversals.",
    meta: "Data structure · O(log n)",
  },
  {
    to: "/visualizers/heap" as const,
    title: "Heap",
    body: "Sift up, sift down and O(n) heapify, with the tree view and the array view kept in sync.",
    meta: "Data structure · O(log n)",
  },
  {
    to: "/visualizers/recursion" as const,
    title: "Recursion",
    body: "Call stack and recursion tree side by side across six examples, including naive vs memoized Fibonacci with live call counters.",
    meta: "Algorithm · O(n) → O(2ⁿ)",
  },
  {
    to: "/visualizers/dynamic-programming" as const,
    title: "Dynamic Programming",
    body: "Eight problems, each solved five ways: brute force, the repeated work exposed, memoization, tabulation and the space-optimised version.",
    meta: "Algorithm · O(2ⁿ) → O(n)",
  },
  {
    to: "/visualizers/backtracking" as const,
    title: "Backtracking",
    body: "Choose, explore, un-choose across subsets, permutations, combination sum, n-queens, rat in a maze and word search, with every pruned branch marked.",
    meta: "Algorithm · O(branchingᵈᵉᵖᵗʰ)",
  },
];

function VisualizersIndex() {
  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb items={[{ label: "Visualizers" }]} />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] sm:text-4xl sm:leading-10">
            Visualizers
          </h1>
          <p className="mt-5 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
            Each visualizer runs on the same step engine: custom input, play/pause, forward and
            backward stepping, speed control, synced code, live variables and a plain-language
            explanation of every step.
          </p>
        </header>

        <div className="mt-10 max-w-3xl divide-y border-y border-border">
          {ready.map((v) => (
            <Link
              key={v.to}
              href={v.to}
              className="group flex flex-col gap-2 py-4 transition-colors hover:bg-accent/40 sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold tracking-tight">{v.title}</h2>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{v.body}</p>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground sm:pt-1">{v.meta}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
