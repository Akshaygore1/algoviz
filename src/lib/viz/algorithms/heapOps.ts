import { createRecorder } from "../recorder";
import type { TreeNodeViz, TreeVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface HeapInput {
  values: number[];
  value?: number;
  variant?: "min" | "max";
}

type Def = AlgorithmDefinition<TreeVizState, HeapInput>;

/**
 * A heap is one array; the tree is just a way of reading it.
 * Node i has children 2i+1 and 2i+2, which is why both views must stay in sync.
 */
function heapState(
  values: number[],
  states: Record<number, CellState>,
  counters?: Record<string, number>,
): TreeVizState {
  const nodes: Record<string, TreeNodeViz> = {};
  const cellStates: CellState[] = values.map((_, i) => states[i] ?? "default");
  values.forEach((value, i) => {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    nodes[`h${i}`] = {
      id: `h${i}`,
      value,
      left: left < values.length ? `h${left}` : null,
      right: right < values.length ? `h${right}` : null,
      state: cellStates[i]!,
    };
  });
  return {
    nodes,
    rootId: values.length ? "h0" : null,
    arrayView: { values: [...values], states: cellStates },
    ...(counters ? { counters } : {}),
  };
}

const better = (variant: "min" | "max", a: number, b: number) =>
  variant === "min" ? a < b : a > b;
const word = (variant: "min" | "max") => (variant === "min" ? "smaller" : "larger");

/* --------------------------------------------------------------- insert */

export const heapInsert: Def = {
  slug: "heap-insert",
  title: "Insert (sift up)",
  tagline:
    "A new value is dropped at the end of the array and then bubbles up while it beats its parent. Only one root-to-leaf path is ever touched, so it costs O(log n).",
  language: "JavaScript",
  code: [
    "function insert(heap, value) {",
    "  heap.push(value);",
    "  let i = heap.length - 1;",
    "  while (i > 0) {",
    "    const parent = Math.floor((i - 1) / 2);",
    "    if (heap[parent] <= heap[i]) break;   // heap order restored",
    "    [heap[i], heap[parent]] = [heap[parent], heap[i]];",
    "    i = parent;",
    "  }",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(log n)",
    timeWorst: "O(log n)",
    space: "O(1)",
    plainEnglish:
      "The value can rise at most once per level, and a heap is always a complete tree with about log n levels. Best case it stays put immediately.",
  },
  generate: ({ values, value = 0, variant = "min" }) => {
    const r = createRecorder<TreeVizState>();
    const heap = [...values];
    let swaps = 0;

    r.push(
      "highlight",
      `Current ${variant}-heap. The only guarantee is that every parent is ${word(variant)} than its children; siblings are unordered, which is why a heap is not a sorted array.`,
      [1],
      { size: heap.length, inserting: value },
      heapState(heap, {}, { size: heap.length, swaps }),
    );

    heap.push(value);
    let i = heap.length - 1;
    r.push(
      "insert",
      `Append ${value} at index ${i}, the next free slot. That keeps the tree complete, but it may now break the heap order with its parent.`,
      [2, 3],
      { i, value, size: heap.length },
      heapState(heap, { [i]: "inspect" }, { size: heap.length, swaps }),
    );

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      const ok = !better(variant, heap[i]!, heap[parent]!);
      r.push(
        "compare",
        ok
          ? `${heap[i]} does not beat its parent ${heap[parent]}, so the heap order already holds. We can stop: everything above is untouched.`
          : `${heap[i]} is ${word(variant)} than its parent ${heap[parent]}, so it must move up.`,
        [4, 5, 6],
        { i, parent, child: heap[i]!, parentValue: heap[parent]! },
        heapState(heap, { [i]: "compare", [parent]: "compare" }, { size: heap.length, swaps }),
      );
      if (ok) break;
      [heap[i], heap[parent]] = [heap[parent]!, heap[i]!];
      swaps += 1;
      r.push(
        "swap",
        `Swap them. ${heap[parent]} rises to index ${parent}; we continue checking from there. Only this single path is ever rearranged.`,
        [7, 8],
        { i: parent, swaps },
        heapState(heap, { [parent]: "success", [i]: "visited" }, { size: heap.length, swaps }),
      );
      i = parent;
    }

    r.push(
      "complete",
      `Heap order restored after ${swaps} swap(s). The root ${heap[0]} is the ${variant === "min" ? "minimum" : "maximum"}: that O(1) peek is the whole point of a heap.`,
      [9],
      { root: heap[0] ?? null, swaps, size: heap.length },
      heapState(heap, { 0: "done" }, { size: heap.length, swaps }),
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- extract */

export const heapExtract: Def = {
  slug: "heap-extract",
  title: "Extract root (sift down)",
  tagline:
    "Take the root, move the last element into its place, then sink it down past the better child. This is one step of heap sort and one poll of a priority queue.",
  language: "JavaScript",
  code: [
    "function extractMin(heap) {",
    "  const top = heap[0];",
    "  heap[0] = heap.pop();",
    "  let i = 0;",
    "  while (true) {",
    "    const l = 2 * i + 1, rgt = 2 * i + 2;",
    "    let best = i;",
    "    if (l < heap.length && heap[l] < heap[best]) best = l;",
    "    if (rgt < heap.length && heap[rgt] < heap[best]) best = rgt;",
    "    if (best === i) break;",
    "    [heap[i], heap[best]] = [heap[best], heap[i]];",
    "    i = best;",
    "  }",
    "  return top;",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(log n)",
    timeWorst: "O(log n)",
    space: "O(1)",
    plainEnglish:
      "The replacement value sinks at most one level per iteration, so at most log n comparisons: two per level, one for each child.",
  },
  generate: ({ values, variant = "min" }) => {
    const r = createRecorder<TreeVizState>();
    const heap = [...values];
    let swaps = 0;

    if (heap.length === 0) {
      r.push(
        "complete",
        "The heap is empty, so there is nothing to extract.",
        [1],
        { size: 0 },
        heapState(heap, {}),
      );
      return r.steps;
    }

    const top = heap[0]!;
    r.push(
      "highlight",
      `The root ${top} is the ${variant === "min" ? "minimum" : "maximum"} by definition, so extracting it is just reading index 0. The work is repairing the heap afterwards.`,
      [2],
      { extracted: top, size: heap.length },
      heapState(heap, { 0: "success" }, { size: heap.length, swaps }),
    );

    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      r.push(
        "update",
        `Move the last element ${last} into the root. Using the last element (rather than promoting a child) is what keeps the tree complete with no holes.`,
        [3, 4],
        { root: last, size: heap.length },
        heapState(heap, { 0: "inspect" }, { size: heap.length, swaps }),
      );
    } else {
      r.push(
        "complete",
        `That was the only element, so the heap is now empty. Extracted ${top}.`,
        [14],
        { extracted: top, size: 0 },
        heapState(heap, {}, { size: 0, swaps }),
      );
      return r.steps;
    }

    let i = 0;
    for (;;) {
      const l = 2 * i + 1;
      const rg = 2 * i + 2;
      let best = i;
      if (l < heap.length && better(variant, heap[l]!, heap[best]!)) best = l;
      if (rg < heap.length && better(variant, heap[rg]!, heap[best]!)) best = rg;

      const marks: Record<number, CellState> = { [i]: "compare" };
      if (l < heap.length) marks[l] = "inspect";
      if (rg < heap.length) marks[rg] = "inspect";

      r.push(
        "compare",
        best === i
          ? `${heap[i]} already beats both children, so the heap order holds and the sift stops here.`
          : `Child ${heap[best]} at index ${best} is ${word(variant)} than ${heap[i]}, so it has to become the parent. We always compare against the better of the two children.`,
        [6, 7, 8, 9],
        {
          i,
          left: l < heap.length ? heap[l]! : null,
          right: rg < heap.length ? heap[rg]! : null,
          best,
        },
        heapState(heap, marks, { size: heap.length, swaps }),
      );

      if (best === i) break;
      [heap[i], heap[best]] = [heap[best]!, heap[i]!];
      swaps += 1;
      r.push(
        "swap",
        `Swap and sink to index ${best}. Everything above index ${best} is now a valid heap again.`,
        [11, 12],
        { i: best, swaps },
        heapState(heap, { [i]: "visited", [best]: "success" }, { size: heap.length, swaps }),
      );
      i = best;
    }

    r.push(
      "complete",
      `Extracted ${top} in O(log n) after ${swaps} swap(s). The new root ${heap[0]} is the next ${variant === "min" ? "minimum" : "maximum"}.`,
      [14],
      { extracted: top, root: heap[0] ?? null, swaps, size: heap.length },
      heapState(heap, { 0: "done" }, { size: heap.length, swaps }),
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- heapify */

export const heapBuild: Def = {
  slug: "heapify",
  title: "Build heap (heapify)",
  tagline:
    "Sifting down from the last parent backwards turns any array into a heap in O(n), not O(n log n). Inserting one by one is the slower way.",
  language: "JavaScript",
  code: [
    "function buildHeap(a) {",
    "  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {",
    "    siftDown(a, i);",
    "  }",
    "}",
    "function siftDown(a, i) {",
    "  const l = 2 * i + 1, r = 2 * i + 2;",
    "  let best = i;",
    "  if (l < a.length && a[l] < a[best]) best = l;",
    "  if (r < a.length && a[r] < a[best]) best = r;",
    "  if (best === i) return;",
    "  [a[i], a[best]] = [a[best], a[i]];",
    "  siftDown(a, best);",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "Most nodes are near the bottom and can barely sink at all; only the few nodes near the root can sink far. The sum works out to O(n), which is the classic follow-up question after 'why not insert n times?'.",
  },
  generate: ({ values, variant = "min" }) => {
    const r = createRecorder<TreeVizState>();
    const heap = [...values];
    let swaps = 0;
    let comparisons = 0;

    r.push(
      "highlight",
      `An arbitrary array read as a tree. Leaves are already valid one-node heaps, so we only need to fix the ${Math.floor(heap.length / 2)} internal node(s), starting from the last one.`,
      [1, 2],
      { size: heap.length },
      heapState(heap, {}, { comparisons, swaps }),
    );

    const sift = (start: number) => {
      let i = start;
      for (;;) {
        const l = 2 * i + 1;
        const rg = 2 * i + 2;
        let best = i;
        if (l < heap.length && better(variant, heap[l]!, heap[best]!)) best = l;
        if (rg < heap.length && better(variant, heap[rg]!, heap[best]!)) best = rg;
        comparisons += (l < heap.length ? 1 : 0) + (rg < heap.length ? 1 : 0);

        const marks: Record<number, CellState> = { [i]: "compare" };
        if (l < heap.length) marks[l] = "inspect";
        if (rg < heap.length) marks[rg] = "inspect";
        r.push(
          "compare",
          best === i
            ? `${heap[i]} already beats its children, so the subtree rooted at index ${i} is a valid heap.`
            : `${heap[best]} at index ${best} is ${word(variant)} than ${heap[i]}, so this subtree breaks the heap rule.`,
          [6, 7, 8, 9],
          { i, best, comparisons },
          heapState(heap, marks, { comparisons, swaps }),
        );
        if (best === i) return;
        [heap[i], heap[best]] = [heap[best]!, heap[i]!];
        swaps += 1;
        r.push(
          "swap",
          `Swap ${heap[best]} and ${heap[i]}. The value keeps sinking until it stops beating a child: because we work bottom-up, everything below is already a heap.`,
          [11, 12],
          { swaps },
          heapState(heap, { [i]: "success", [best]: "visited" }, { comparisons, swaps }),
        );
        i = best;
      }
    };

    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
      r.push(
        "highlight",
        `Fix the subtree rooted at index ${i} (value ${heap[i]}). Its children are already valid heaps, which is the invariant that makes one sift-down enough.`,
        [2, 3],
        { i },
        heapState(heap, { [i]: "inspect" }, { comparisons, swaps }),
      );
      sift(i);
    }

    r.push(
      "complete",
      `Every parent now beats its children, so the array is a valid ${variant}-heap: ${heap.join(", ")}. Built in O(n) with ${swaps} swap(s): no extra memory used.`,
      [4],
      { root: heap[0] ?? null, swaps, comparisons },
      heapState(heap, Object.fromEntries(heap.map((_, i) => [i, "done" as CellState])), {
        comparisons,
        swaps,
      }),
    );
    return r.steps;
  },
};

export const HEAP_OPS: Def[] = [heapBuild, heapInsert, heapExtract];
