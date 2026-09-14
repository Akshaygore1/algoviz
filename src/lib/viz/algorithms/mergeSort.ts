import {
  makeCells,
  type AlgorithmDefinition,
  type AlgorithmStep,
  type ArrayVizState,
  type CellState,
} from "../types";

const code = [
  "function mergeSort(arr, lo = 0, hi = arr.length - 1) {",
  "  if (lo >= hi) return arr;",
  "  const mid = Math.floor((lo + hi) / 2);",
  "  mergeSort(arr, lo, mid);",
  "  mergeSort(arr, mid + 1, hi);",
  "  const left = arr.slice(lo, mid + 1);",
  "  const right = arr.slice(mid + 1, hi + 1);",
  "  let i = 0, j = 0, k = lo;",
  "  while (i < left.length && j < right.length) {",
  "    arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];",
  "  }",
  "  while (i < left.length) arr[k++] = left[i++];",
  "  while (j < right.length) arr[k++] = right[j++];",
  "  return arr;",
  "}",
];

function generate(input: number[]): AlgorithmStep<ArrayVizState>[] {
  const values = [...input];
  const steps: AlgorithmStep<ArrayVizState>[] = [];
  const n = values.length;
  let id = 0;
  let comparisons = 0;
  let writes = 0;
  let depth = 0;

  const snapshot = (opts: {
    range?: [number, number];
    marks?: Record<number, CellState>;
    buffer?: (number | null)[];
    bufferMarks?: Record<number, CellState>;
    bufferLabel?: string;
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
    for (const key of Object.keys(opts.marks ?? {})) {
      const idx = Number(key);
      const mark = opts.marks?.[idx];
      if (mark) cells[idx] = mark;
    }

    let auxiliary: ArrayVizState["auxiliary"];
    if (opts.buffer) {
      const bufCells = makeCells(n);
      for (const key of Object.keys(opts.bufferMarks ?? {})) {
        const idx = Number(key);
        const mark = opts.bufferMarks?.[idx];
        if (mark) bufCells[idx] = mark;
      }
      auxiliary = {
        label: opts.bufferLabel ?? "Merge buffer",
        values: opts.buffer,
        cells: bufCells,
      };
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
        counters: { comparisons, writes },
        pointers: opts.pointers,
        auxiliary,
      },
    });
  };

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) {
      snapshot({
        range: [lo, hi],
        marks: { [lo]: "done" },
        type: "highlight",
        description: `A single value (index ${lo}) is sorted by definition, so this branch of the recursion returns immediately.`,
        lines: [2],
        vars: { lo, hi, depth },
      });
      return;
    }
    const mid = Math.floor((lo + hi) / 2);
    snapshot({
      range: [lo, hi],
      marks: { [mid]: "inspect" },
      type: "highlight",
      description: `Split indexes ${lo}–${hi} at the midpoint ${mid}. Merge sort never compares anything while splitting; it just keeps halving until each piece has one value.`,
      lines: [3, 4],
      vars: { lo, mid, hi, depth },
      pointers: { lo, mid, hi },
    });

    depth++;
    sort(lo, mid);
    sort(mid + 1, hi);
    depth--;

    // merge
    const left = values.slice(lo, mid + 1);
    const right = values.slice(mid + 1, hi + 1);
    const buffer: (number | null)[] = Array.from({ length: n }, () => null);
    let i = 0;
    let j = 0;
    let k = lo;

    snapshot({
      range: [lo, hi],
      buffer: [...buffer],
      type: "highlight",
      description: `Both halves (indexes ${lo}–${mid} and ${mid + 1}–${hi}) are sorted on their own. Now we merge them by repeatedly taking the smaller front value into an empty buffer.`,
      lines: [6, 7, 8],
      vars: { lo, mid, hi, left: left.join(","), right: right.join(",") },
      pointers: { lo, mid, hi },
    });

    while (i < left.length && j < right.length) {
      comparisons++;
      const a = left[i] as number;
      const b = right[j] as number;
      const takeLeft = a <= b;
      snapshot({
        range: [lo, hi],
        marks: { [lo + i]: "compare", [mid + 1 + j]: "compare" },
        buffer: [...buffer],
        bufferMarks: { [k]: "inspect" },
        type: "compare",
        description: `Compare the fronts of the two halves: ${a} and ${b}. ${takeLeft ? `${a} is smaller (or equal, which keeps the sort stable), so it goes into the buffer.` : `${b} is smaller, so it goes into the buffer.`}`,
        lines: [9, 10],
        vars: { i, j, k, "left[i]": a, "right[j]": b, comparisons },
        pointers: { i: lo + i, j: mid + 1 + j },
      });
      buffer[k] = takeLeft ? a : b;
      writes++;
      if (takeLeft) i++;
      else j++;
      snapshot({
        range: [lo, hi],
        buffer: [...buffer],
        bufferMarks: { [k]: "success" },
        type: "update",
        description: `Buffer slot ${k} now holds ${buffer[k]}. The buffer is always sorted so far, which is the whole point of merging.`,
        lines: [10],
        vars: { i, j, k, writes },
      });
      k++;
    }

    while (i < left.length) {
      buffer[k] = left[i] as number;
      writes++;
      snapshot({
        range: [lo, hi],
        buffer: [...buffer],
        bufferMarks: { [k]: "success" },
        type: "update",
        description: `The right half is exhausted, so the remaining left value ${left[i]} is copied straight across: no comparison needed, it is already bigger than everything in the buffer.`,
        lines: [12],
        vars: { i, k, writes },
      });
      i++;
      k++;
    }
    while (j < right.length) {
      buffer[k] = right[j] as number;
      writes++;
      snapshot({
        range: [lo, hi],
        buffer: [...buffer],
        bufferMarks: { [k]: "success" },
        type: "update",
        description: `The left half is exhausted, so the remaining right value ${right[j]} is copied straight across.`,
        lines: [13],
        vars: { j, k, writes },
      });
      j++;
      k++;
    }

    for (let t = lo; t <= hi; t++) values[t] = buffer[t] as number;
    const marks: Record<number, CellState> = {};
    const bufferMarks: Record<number, CellState> = {};
    for (let t = lo; t <= hi; t++) {
      marks[t] = "done";
      bufferMarks[t] = "visited";
    }
    snapshot({
      range: [lo, hi],
      marks,
      buffer: [...buffer],
      bufferMarks,
      type: "update",
      description: `The buffer is copied back over indexes ${lo}–${hi}, which are now sorted as a block. This copying is why merge sort needs O(n) extra space.`,
      lines: [14],
      vars: { lo, hi, writes },
    });
  };

  snapshot({
    type: "highlight",
    description: `Merge sort is divide and conquer: split the array in half until pieces are single values, then merge sorted pieces back together. Every level of splitting costs one full pass of merging, and there are log n levels: that is the O(n log n).`,
    lines: [1],
    vars: { length: n },
  });

  sort(0, n - 1);

  steps.push({
    id: id++,
    type: "complete",
    description: `Sorted with ${comparisons} comparisons and ${writes} buffer writes. Merge sort gives the same O(n log n) on every input (sorted, reversed or random) and it is stable, which is why it backs most library sorts for objects.`,
    highlightedCodeLines: [14],
    variables: { comparisons, writes },
    state: { values: [...values], cells: makeCells(n, "done"), counters: { comparisons, writes } },
  });

  return steps;
}

export const mergeSort: AlgorithmDefinition<ArrayVizState, number[]> = {
  slug: "merge-sort",
  title: "Merge Sort",
  tagline: "Split down to single values, then merge sorted halves with two read pointers.",
  code,
  language: "JavaScript",
  complexity: {
    timeBest: "O(n log n)",
    timeAverage: "O(n log n)",
    timeWorst: "O(n log n)",
    space: "O(n)",
    plainEnglish:
      "Halving the array takes log n levels, and each level merges every value exactly once, so the work is n × log n: guaranteed, whatever the input looks like. The cost is an O(n) buffer to merge into, since merging in place is far harder.",
  },
  generate,
};
