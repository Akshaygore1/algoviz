import {
  makeCells,
  type AlgorithmDefinition,
  type AlgorithmStep,
  type ArrayVizState,
  type CellState,
} from "../types";

const code = [
  "function insertionSort(arr) {",
  "  for (let i = 1; i < arr.length; i++) {",
  "    const key = arr[i];",
  "    let j = i - 1;",
  "    while (j >= 0 && arr[j] > key) {",
  "      arr[j + 1] = arr[j];",
  "      j--;",
  "    }",
  "    arr[j + 1] = key;",
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
  let shifts = 0;
  let sortedUpTo = 1; // indices < sortedUpTo form the sorted prefix

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
    for (let k = 0; k < Math.min(sortedUpTo, n); k++) cells[k] = "visited";
    for (const key of Object.keys(marks)) {
      const idx = Number(key);
      const mark = marks[idx];
      if (mark && idx >= 0 && idx < n) cells[idx] = mark;
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
        counters: { comparisons, shifts },
        pointers: extra.pointers,
      },
    });
  };

  snapshot(
    {},
    {
      type: "highlight",
      description: `Insertion sort keeps a sorted prefix on the left, exactly like sorting a hand of cards. Index 0 alone counts as sorted, so we start by inserting index 1 into it.`,
      lines: [1, 2],
      vars: { length: n, sortedPrefix: 1 },
    },
  );

  for (let i = 1; i < n; i++) {
    const key = values[i] as number;
    let j = i - 1;
    snapshot(
      { [i]: "inspect" },
      {
        type: "highlight",
        description: `We lift ${key} out of index ${i} and hold it as the key. Indexes 0 to ${i - 1} are already sorted among themselves, so we only need to find where the key belongs inside that region.`,
        lines: [3, 4],
        vars: { i, key, j },
        pointers: { i, j },
      },
    );

    while (j >= 0 && (values[j] as number) > key) {
      comparisons++;
      snapshot(
        { [j]: "compare", [j + 1]: "inspect" },
        {
          type: "compare",
          description: `${values[j]} at index ${j} is greater than the key ${key}, so it has to move one slot to the right to make room.`,
          lines: [5],
          vars: { i, j, key, "arr[j]": values[j] ?? null, comparisons },
          pointers: { i, j },
        },
      );
      values[j + 1] = values[j] as number;
      shifts++;
      snapshot(
        { [j + 1]: "success", [j]: "inspect" },
        {
          type: "update",
          description: `We copy ${values[j + 1]} into index ${j + 1}. Index ${j} now holds a duplicate we are about to overwrite: the key is still safely held in a variable.`,
          lines: [6, 7],
          vars: { i, j: j - 1, key, shifts },
          pointers: { i, j },
        },
      );
      j--;
    }

    if (j >= 0) {
      comparisons++;
      snapshot(
        { [j]: "compare" },
        {
          type: "compare",
          description: `${values[j]} at index ${j} is not greater than the key ${key}, so the key belongs immediately to its right, at index ${j + 1}.`,
          lines: [5],
          vars: { i, j, key, "arr[j]": values[j] ?? null, comparisons },
          pointers: { i, j },
        },
      );
    }

    values[j + 1] = key;
    sortedUpTo = i + 1;
    snapshot(
      { [j + 1]: "success" },
      {
        type: "insert",
        description: `The key ${key} drops into index ${j + 1}. The sorted prefix is now ${sortedUpTo} values long and still sorted.`,
        lines: [9],
        vars: { i, insertedAt: j + 1, key, sortedPrefix: sortedUpTo },
        pointers: { i },
      },
    );
  }

  const cells = makeCells(n, "done");
  steps.push({
    id: id++,
    type: "complete",
    description: `Sorted. On an already sorted array the while loop never runs, so insertion sort finishes in O(n); that best case is why it is used to finish off small chunks inside fast hybrid sorts. Here it took ${comparisons} comparisons and ${shifts} shifts.`,
    highlightedCodeLines: [11],
    variables: { comparisons, shifts },
    state: { values: [...values], cells, counters: { comparisons, shifts } },
  });

  return steps;
}

export const insertionSort: AlgorithmDefinition<ArrayVizState, number[]> = {
  slug: "insertion-sort",
  title: "Insertion Sort",
  tagline: "Hold one value as the key and shift bigger values right until it fits.",
  code,
  language: "JavaScript",
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    plainEnglish:
      "Each value may have to shift past every value before it, so the worst case grows with n × n. If the array is already (or nearly) sorted the inner loop barely runs, giving O(n): this is why it beats fancier sorts on tiny or nearly-sorted inputs. It sorts in place and is stable.",
  },
  generate,
};
