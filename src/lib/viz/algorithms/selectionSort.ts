import {
  makeCells,
  type AlgorithmDefinition,
  type AlgorithmStep,
  type ArrayVizState,
  type CellState,
} from "../types";

const code = [
  "function selectionSort(arr) {",
  "  for (let i = 0; i < arr.length - 1; i++) {",
  "    let min = i;",
  "    for (let j = i + 1; j < arr.length; j++) {",
  "      if (arr[j] < arr[min]) min = j;",
  "    }",
  "    if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];",
  "  }",
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
  let sortedUpTo = 0; // indices < sortedUpTo are final

  const snapshot = (
    marks: Record<number, CellState>,
    extra: {
      type: AlgorithmStep<ArrayVizState>["type"];
      description: string;
      lines: number[];
      vars: Record<string, string | number | boolean | null>;
      pointers?: Record<string, number>;
    },
  ) => {
    const cells = makeCells(n);
    for (let k = 0; k < sortedUpTo; k++) cells[k] = "done";
    for (const key of Object.keys(marks)) {
      const idx = Number(key);
      const mark = marks[idx];
      if (mark) cells[idx] = mark;
    }
    steps.push({
      id: id++,
      type: extra.type,
      description: extra.description,
      highlightedCodeLines: extra.lines,
      variables: extra.vars,
      state: {
        values: [...values],
        cells,
        counters: { comparisons, swaps },
        pointers: extra.pointers,
      },
    });
  };

  snapshot(
    {},
    {
      type: "highlight",
      description: `Selection sort grows a sorted region on the left. On every pass it scans the whole unsorted right side, finds the smallest value there, and swaps it into the first unsorted slot, so it makes at most one swap per pass.`,
      lines: [1],
      vars: { length: n },
    },
  );

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    snapshot(
      { [i]: "inspect" },
      {
        type: "highlight",
        description: `Pass ${i + 1}. We assume index ${i} holds the smallest remaining value (${values[i]}) and will look for anything smaller in the rest of the array.`,
        lines: [2, 3],
        vars: { i, min, "arr[min]": values[min] ?? null },
        pointers: { i, min },
      },
    );

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const a = values[j] as number;
      const b = values[min] as number;
      snapshot(
        { [j]: "compare", [min]: "inspect" },
        {
          type: "compare",
          description:
            a < b
              ? `We compare ${a} at index ${j} against the current minimum ${b}. ${a} is smaller, so index ${j} becomes the new minimum.`
              : `We compare ${a} at index ${j} against the current minimum ${b}. ${a} is not smaller, so the minimum stays at index ${min}.`,
          lines: [4, 5],
          vars: { i, j, "arr[j]": a, min, "arr[min]": b, comparisons },
          pointers: { i, j, min },
        },
      );
      if (a < b) {
        min = j;
        snapshot(
          { [min]: "success" },
          {
            type: "update",
            description: `min now points at index ${min}, holding ${values[min]}. Notice nothing has moved yet: selection sort only remembers where the smallest value is.`,
            lines: [5],
            vars: { i, j, min, "arr[min]": values[min] ?? null },
            pointers: { i, j, min },
          },
        );
      }
    }

    if (min !== i) {
      const a = values[i] as number;
      const b = values[min] as number;
      values[i] = b;
      values[min] = a;
      swaps++;
      snapshot(
        { [i]: "success", [min]: "success" },
        {
          type: "swap",
          description: `The smallest remaining value ${b} is swapped into index ${i}, and ${a} takes its old place. That is the single swap for this pass.`,
          lines: [7],
          vars: { i, min, swaps },
          pointers: { i, min },
        },
      );
    } else {
      snapshot(
        { [i]: "success" },
        {
          type: "update",
          description: `The minimum was already sitting at index ${i}, so no swap is needed this pass.`,
          lines: [7],
          vars: { i, min, swaps },
          pointers: { i },
        },
      );
    }

    sortedUpTo = i + 1;
    snapshot(
      {},
      {
        type: "update",
        description: `Index ${i} is locked in its final position. The sorted region on the left is now ${sortedUpTo} value${sortedUpTo === 1 ? "" : "s"} long.`,
        lines: [2],
        vars: { sortedUpTo, comparisons, swaps },
      },
    );
  }

  sortedUpTo = n;
  snapshot(
    {},
    {
      type: "complete",
      description: `Everything is sorted. It took ${comparisons} comparisons (always about n²/2, even on an already sorted array) but only ${swaps} swaps, which is why selection sort is chosen when writes are expensive.`,
      lines: [9],
      vars: { comparisons, swaps },
    },
  );

  return steps;
}

export const selectionSort: AlgorithmDefinition<ArrayVizState, number[]> = {
  slug: "selection-sort",
  title: "Selection Sort",
  tagline: "Scan the unsorted part for the smallest value, swap it to the front, repeat.",
  code,
  language: "JavaScript",
  complexity: {
    timeBest: "O(n²)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    plainEnglish:
      "Each pass scans the entire unsorted portion to find its minimum. These scans add up to about n²/2 comparisons, so the best, average, and worst-case time are all O(n²) even for an already sorted array. It stores only a few variables, so extra space is O(1), and it performs at most n − 1 swaps to keep writes low.",
  },
  generate,
};
