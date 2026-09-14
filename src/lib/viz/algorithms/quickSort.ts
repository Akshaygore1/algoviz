import {
  makeCells,
  type AlgorithmDefinition,
  type AlgorithmStep,
  type ArrayVizState,
  type CellState,
} from "../types";

const code = [
  "function quickSort(arr, lo = 0, hi = arr.length - 1) {",
  "  if (lo >= hi) return arr;",
  "  const pivot = arr[hi];",
  "  let i = lo;",
  "  for (let j = lo; j < hi; j++) {",
  "    if (arr[j] < pivot) {",
  "      [arr[i], arr[j]] = [arr[j], arr[i]];",
  "      i++;",
  "    }",
  "  }",
  "  [arr[i], arr[hi]] = [arr[hi], arr[i]];",
  "  quickSort(arr, lo, i - 1);",
  "  quickSort(arr, i + 1, hi);",
  "  return arr;",
  "}",
];

function generate(input: number[]): AlgorithmStep<ArrayVizState>[] {
  const values = [...input];
  const steps: AlgorithmStep<ArrayVizState>[] = [];
  const n = values.length;
  let id = 0;
  let comparisons = 0;
  let swaps = 0;
  const settled = new Set<number>();

  const snapshot = (opts: {
    range?: [number, number];
    marks?: Record<number, CellState>;
    type: AlgorithmStep<ArrayVizState>["type"];
    description: string;
    lines: number[];
    vars: Record<string, string | number | boolean | null>;
    pointers?: Record<string, number>;
  }) => {
    const cells = makeCells(n);
    if (opts.range) {
      for (let k = 0; k < n; k++) {
        if (k < opts.range[0] || k > opts.range[1]) cells[k] = "eliminated";
      }
    }
    for (const idx of settled) cells[idx] = "done";
    for (const key of Object.keys(opts.marks ?? {})) {
      const idx = Number(key);
      const mark = opts.marks?.[idx];
      if (mark) cells[idx] = mark;
    }
    steps.push({
      id: id++,
      type: opts.type,
      description: opts.description,
      highlightedCodeLines: opts.lines,
      variables: opts.vars,
      state: {
        values: [...values],
        cells,
        counters: { comparisons, swaps },
        pointers: opts.pointers,
      },
    });
  };

  const sort = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      settled.add(lo);
      snapshot({
        range: [lo, hi],
        type: "highlight",
        description: `A one-value range (index ${lo}) is already sorted, so this branch stops here and index ${lo} is final.`,
        lines: [2],
        vars: { lo, hi },
      });
      return;
    }

    const pivot = values[hi] as number;
    let i = lo;
    snapshot({
      range: [lo, hi],
      marks: { [hi]: "inspect" },
      type: "highlight",
      description: `Work on indexes ${lo}–${hi}. We pick the last value, ${pivot}, as the pivot. The goal of partitioning is to end up with everything smaller than ${pivot} on its left and everything larger on its right.`,
      lines: [3, 4],
      vars: { lo, hi, pivot, i },
      pointers: { lo, i, pivot: hi },
    });

    for (let j = lo; j < hi; j++) {
      comparisons++;
      const a = values[j] as number;
      snapshot({
        range: [lo, hi],
        marks: { [j]: "compare", [hi]: "inspect" },
        type: "compare",
        description:
          a < pivot
            ? `${a} at index ${j} is smaller than the pivot ${pivot}, so it belongs in the left group. We swap it into the boundary slot ${i}.`
            : `${a} at index ${j} is not smaller than the pivot ${pivot}, so it can stay where it is: it is already on the right side of the boundary.`,
        lines: [5, 6],
        vars: { j, "arr[j]": a, pivot, i, comparisons },
        pointers: { i, j, pivot: hi },
      });
      if (a < pivot) {
        if (i !== j) {
          const tmp = values[i] as number;
          values[i] = a;
          values[j] = tmp;
          swaps++;
        }
        i++;
        snapshot({
          range: [lo, hi],
          marks: { [i - 1]: "success", [hi]: "inspect" },
          type: "swap",
          description: `${a} is now inside the "smaller than pivot" group and the boundary i moves to ${i}. Everything from ${lo} to ${i - 1} is smaller than the pivot.`,
          lines: [7, 8],
          vars: { i, j, swaps },
          pointers: { i, j, pivot: hi },
        });
      }
    }

    if (i !== hi) {
      const tmp = values[i] as number;
      values[i] = pivot;
      values[hi] = tmp;
      swaps++;
    }
    settled.add(i);
    snapshot({
      range: [lo, hi],
      marks: { [i]: "done" },
      type: "swap",
      description: `The pivot ${pivot} is swapped into index ${i}, the boundary between the smaller and larger groups. That is its final position for good: nothing later will move it.`,
      lines: [11],
      vars: { pivotFinalIndex: i, pivot, swaps },
      pointers: { pivot: i },
    });

    sort(lo, i - 1);
    sort(i + 1, hi);
  };

  snapshot({
    type: "highlight",
    description: `Quick sort partitions instead of merging: pick a pivot, push smaller values left and larger values right, and the pivot lands in its final slot. Then it repeats on each side. No extra array is needed, which is why it is usually the fastest in practice.`,
    lines: [1],
    vars: { length: n },
  });

  sort(0, n - 1);

  steps.push({
    id: id++,
    type: "complete",
    description: `Sorted in place with ${comparisons} comparisons and ${swaps} swaps. Balanced pivots give O(n log n); a bad pivot choice (like always taking the last value on an already sorted array) degrades to O(n²), which is why real implementations randomise or use the median of three.`,
    highlightedCodeLines: [14],
    variables: { comparisons, swaps },
    state: { values: [...values], cells: makeCells(n, "done"), counters: { comparisons, swaps } },
  });

  return steps;
}

export const quickSort: AlgorithmDefinition<ArrayVizState, number[]> = {
  slug: "quick-sort",
  title: "Quick Sort",
  tagline: "Partition around a pivot until every pivot lands in its final position.",
  code,
  language: "JavaScript",
  complexity: {
    timeBest: "O(n log n)",
    timeAverage: "O(n log n)",
    timeWorst: "O(n²)",
    space: "O(log n)",
    plainEnglish:
      "Each partition pass touches every value once. If pivots split the range roughly in half there are log n levels, giving n × log n. If the pivot is always the smallest or largest value the range shrinks by one each time, giving n²; try the sorted preset to watch that happen. The extra space is just the recursion stack.",
  },
  generate,
};
