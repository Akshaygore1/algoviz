import {
  makeCells,
  type AlgorithmDefinition,
  type AlgorithmStep,
  type ArrayVizState,
  type CellState,
} from "../types";

const code = [
  "function bubbleSort(arr) {",
  "  for (let i = 0; i < arr.length - 1; i++) {",
  "    let swapped = false;",
  "    for (let j = 0; j < arr.length - 1 - i; j++) {",
  "      if (arr[j] > arr[j + 1]) {",
  "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
  "        swapped = true;",
  "      }",
  "    }",
  "    if (!swapped) break;",
  "  }",
  "  return arr;",
  "}",
];

function generate(input: number[]): AlgorithmStep<ArrayVizState>[] {
  const values = [...input];
  const steps: AlgorithmStep<ArrayVizState>[] = [];
  let id = 0;
  let comparisons = 0;
  let swaps = 0;
  const n = values.length;
  let sortedFrom = n; // indices >= sortedFrom are locked in place

  const snapshot = (
    marks: Partial<Record<number, CellState>>,
    extra: {
      type: AlgorithmStep<ArrayVizState>["type"];
      description: string;
      lines: number[];
      vars: Record<string, string | number | boolean | null>;
    },
  ) => {
    const cells = makeCells(n);
    for (let k = sortedFrom; k < n; k++) cells[k] = "done";
    for (const key of Object.keys(marks)) {
      const idx = Number(key);
      const mark = marks[idx];
      if (mark && cells[idx] !== "done") cells[idx] = mark;
      else if (mark) cells[idx] = mark;
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
      },
    });
  };

  snapshot(
    {},
    {
      type: "highlight",
      description: `We start with ${n} unsorted values. Bubble sort repeatedly compares neighbouring pairs and pushes the larger value one step to the right, so the largest value "bubbles" to the end on every pass.`,
      lines: [1],
      vars: { length: n },
    },
  );

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    snapshot(
      {},
      {
        type: "highlight",
        description: `Pass ${i + 1} begins. Everything from index ${n - i} onwards is already in its final position, so this pass only needs to walk up to index ${n - i - 2}.`,
        lines: [2, 3],
        vars: { pass: i + 1, i, swapped: false },
      },
    );

    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      const a = values[j] as number;
      const b = values[j + 1] as number;
      snapshot(
        { [j]: "compare", [j + 1]: "compare" },
        {
          type: "compare",
          description:
            a > b
              ? `We compare ${a} and ${b}. Since ${a} is greater than ${b}, they are in the wrong order and must be swapped.`
              : `We compare ${a} and ${b}. Since ${a} is not greater than ${b}, they are already in the right order and nothing changes.`,
          lines: [4, 5],
          vars: { i, j, "arr[j]": a, "arr[j+1]": b, comparisons },
        },
      );

      if (a > b) {
        values[j] = b;
        values[j + 1] = a;
        swaps++;
        swapped = true;
        snapshot(
          { [j]: "success", [j + 1]: "success" },
          {
            type: "swap",
            description: `We swap them, so the smaller value ${b} moves toward the beginning of the array and the larger value ${a} moves toward the end.`,
            lines: [6, 7],
            vars: { i, j, "arr[j]": b, "arr[j+1]": a, swaps, swapped: true },
          },
        );
      }
    }

    sortedFrom = n - 1 - i;
    snapshot(
      {},
      {
        type: "update",
        description: `Pass ${i + 1} is done. The largest remaining value has bubbled into index ${sortedFrom}, which is now locked as final.`,
        lines: [9],
        vars: { pass: i + 1, sortedFrom, swaps },
      },
    );

    if (!swapped) {
      sortedFrom = 0;
      snapshot(
        {},
        {
          type: "complete",
          description: `No swaps happened during this pass, which means every neighbouring pair is already in order. The array is sorted and we can stop early instead of running the remaining passes.`,
          lines: [10],
          vars: { swapped: false, comparisons, swaps },
        },
      );
      return steps;
    }
  }

  sortedFrom = 0;
  snapshot(
    {},
    {
      type: "complete",
      description: `Every value is now in its final position. It took ${comparisons} comparisons and ${swaps} swaps: notice how the comparison count grows roughly with n² as the array gets bigger.`,
      lines: [12],
      vars: { comparisons, swaps },
    },
  );

  return steps;
}

export const bubbleSort: AlgorithmDefinition<ArrayVizState, number[]> = {
  slug: "bubble-sort",
  title: "Bubble Sort",
  tagline: "Compare neighbours, swap when out of order, repeat until nothing moves.",
  code,
  language: "JavaScript",
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    plainEnglish:
      "Each pass walks the whole array, and it can take up to n passes, so the work grows with n × n. The best case is O(n) because a single pass with no swaps proves the array is already sorted. Nothing is copied, so the extra memory is constant.",
  },
  generate,
};
