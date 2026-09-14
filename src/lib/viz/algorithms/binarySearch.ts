import {
  makeCells,
  type AlgorithmDefinition,
  type AlgorithmStep,
  type ArrayVizState,
} from "../types";

const code = [
  "function binarySearch(arr, target) {",
  "  let left = 0;",
  "  let right = arr.length - 1;",
  "  while (left <= right) {",
  "    const mid = Math.floor((left + right) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) left = mid + 1;",
  "    else right = mid - 1;",
  "  }",
  "  return -1;",
  "}",
];

export interface BinarySearchInput {
  values: number[];
  target: number;
}

function generate({ values, target }: BinarySearchInput): AlgorithmStep<ArrayVizState>[] {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const steps: AlgorithmStep<ArrayVizState>[] = [];
  let id = 0;
  let comparisons = 0;

  let left = 0;
  let right = n - 1;

  const snapshot = (opts: {
    type: AlgorithmStep<ArrayVizState>["type"];
    description: string;
    lines: number[];
    mid?: number;
    midState?: "inspect" | "success" | "error";
    vars?: Record<string, string | number | boolean | null>;
  }) => {
    const cells = makeCells(n);
    for (let k = 0; k < n; k++) {
      if (k < left || k > right) cells[k] = "eliminated";
    }
    if (opts.mid !== undefined && opts.mid >= 0) cells[opts.mid] = opts.midState ?? "inspect";
    steps.push({
      id: id++,
      type: opts.type,
      description: opts.description,
      highlightedCodeLines: opts.lines,
      variables: {
        target,
        left,
        right,
        mid: opts.mid ?? "—",
        comparisons,
        ...(opts.vars ?? {}),
      },
      state: {
        values: [...sorted],
        cells,
        pointers: {
          left: left <= right ? left : -1,
          mid: opts.mid ?? -1,
          right: left <= right ? right : -1,
        },
        counters: { comparisons, "search space": Math.max(0, right - left + 1) },
      },
    });
  };

  snapshot({
    type: "highlight",
    description: `Binary search needs a sorted array, so we work on the sorted values above and look for ${target}. We start with the whole array as our search space: left = 0 and right = ${n - 1}.`,
    lines: [1, 2, 3],
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = sorted[mid] as number;
    snapshot({
      type: "visit",
      description: `The search space runs from index ${left} to ${right}, so we look at the middle index ${mid}, which holds ${midValue}.`,
      lines: [4, 5],
      mid,
    });

    comparisons++;
    if (midValue === target) {
      snapshot({
        type: "complete",
        description: `${midValue} equals our target ${target}, so we found it at index ${mid}. We only needed ${comparisons} comparison${comparisons === 1 ? "" : "s"} for ${n} values.`,
        lines: [6],
        mid,
        midState: "success",
        vars: { result: mid },
      });
      return steps;
    }

    if (midValue < target) {
      snapshot({
        type: "eliminate",
        description: `${midValue} is smaller than ${target}. Because the array is sorted, everything at or before index ${mid} is also too small: we can discard that entire half in one move and set left = ${mid + 1}.`,
        lines: [7],
        mid,
        midState: "error",
      });
      left = mid + 1;
    } else {
      snapshot({
        type: "eliminate",
        description: `${midValue} is larger than ${target}. Everything at or after index ${mid} is also too large, so we discard that half and set right = ${mid - 1}.`,
        lines: [8],
        mid,
        midState: "error",
      });
      right = mid - 1;
    }

    snapshot({
      type: "update",
      description:
        left <= right
          ? `The search space is now index ${left} to ${right} (${right - left + 1} value${right - left + 1 === 1 ? "" : "s"} left). Halving like this is exactly why binary search is O(log n).`
          : `left has passed right, so there is nothing left to search.`,
      lines: [4],
    });
  }

  snapshot({
    type: "complete",
    description: `The search space is empty, so ${target} is not in the array and we return -1. Even a failed search only cost ${comparisons} comparison${comparisons === 1 ? "" : "s"}.`,
    lines: [10],
    vars: { result: -1 },
  });

  return steps;
}

export const binarySearch: AlgorithmDefinition<ArrayVizState, BinarySearchInput> = {
  slug: "binary-search",
  title: "Binary Search",
  tagline: "Halve the search space on every comparison instead of scanning.",
  code,
  language: "JavaScript",
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(log n)",
    timeWorst: "O(log n)",
    space: "O(1)",
    plainEnglish:
      "O(log n) means the search space becomes about half as large after every step. Going from 1,000 values to 1 takes only about 10 comparisons, and doubling the input adds just one more step. Only a few variables are stored, so memory is constant.",
  },
  generate,
};
