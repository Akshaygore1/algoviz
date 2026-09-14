/**
 * Binary Search: 7 interview problems as pure step generators.
 */

import { createRecorder } from "../recorder";
import {
  toNum,
  toNums,
  toWords,
  type ProblemDefinition,
  type ProblemVizState,
} from "../problemState";
import type { CellState } from "../types";

type S = ProblemVizState;

const O = (
  timeBest: string,
  timeAverage: string,
  timeWorst: string,
  space: string,
  plainEnglish: string,
) => ({ timeBest, timeAverage, timeWorst, space, plainEnglish });

/** Marks everything outside [lo, hi] as eliminated. */
const range = (
  n: number,
  lo: number,
  hi: number,
  marks: Record<number, CellState> = {},
): CellState[] =>
  Array.from({ length: n }, (_, i) => marks[i] ?? (i < lo || i > hi ? "eliminated" : "default"));

/* ------------------------------------------------------- 1. Binary Search */

export const binarySearch: ProblemDefinition = {
  slug: "binary-search",
  title: "Binary Search",
  difficulty: "Easy",
  pattern: "Halve a sorted range",
  tagline:
    "Look at the middle of what is left. Because the array is sorted, one comparison tells you which half can be thrown away entirely.",
  insight:
    "Write the loop with a shape you trust and reuse it everywhere: inclusive bounds, `mid = lo + ((hi - lo) >> 1)`, and every branch must shrink the range or you loop forever.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(log n)",
    "O(log n)",
    "O(1)",
    "Each comparison discards half of the remaining values.",
  ),
  code: [
    "function search(nums, target) {",
    "  let lo = 0, hi = nums.length - 1;",
    "  while (lo <= hi) {",
    "    const mid = lo + ((hi - lo) >> 1);",
    "    if (nums[mid] === target) return mid;",
    "    if (nums[mid] < target) lo = mid + 1;",
    "    else hi = mid - 1;",
    "  }",
    "  return -1;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums (sorted)",
      placeholder: "-1 0 3 5 9 12",
      presets: [
        { label: "Classic", value: "-1 0 3 5 9 12" },
        { label: "Longer", value: "1 3 5 7 9 11 13 15 17" },
      ],
    },
    { kind: "number", key: "target", label: "target" },
  ],
  defaults: { nums: "-1 0 3 5 9 12", target: "9" },
  generate: ({ nums: raw, target: tRaw }) => {
    const nums = toNums(raw, 20).sort((a, b) => a - b);
    const target = toNum(tRaw, 9);
    const rec = createRecorder<S>();
    let comparisons = 0;

    const snap = (lo: number, hi: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          values: nums,
          cells: range(nums.length, lo, hi, marks),
          pointers: lo <= hi ? { lo, hi } : {},
        },
      ],
      counters: { comparisons, remaining: Math.max(0, hi - lo + 1) },
      notes: [`target = ${target}`, note],
    });

    let lo = 0;
    let hi = nums.length - 1;
    rec.push(
      "highlight",
      `The whole array is in play. We are looking for ${target}.`,
      [2],
      { lo, hi, target },
      snap(lo, hi, {}, `range = ${lo}..${hi}`),
    );

    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      comparisons++;
      rec.push(
        "compare",
        `The middle of ${lo}..${hi} is index ${mid}, value ${nums[mid]}.`,
        [4, 5],
        { mid, value: nums[mid] ?? 0, comparisons },
        snap(lo, hi, { [mid]: "compare" }, `mid = ${mid}`),
      );
      if (nums[mid] === target) {
        rec.push(
          "complete",
          `Found ${target} at index ${mid}.`,
          [5],
          { result: mid },
          { ...snap(lo, hi, { [mid]: "success" }, "found"), output: `search = ${mid}` },
        );
        return rec.steps;
      }
      if (nums[mid]! < target) {
        rec.push(
          "eliminate",
          `${nums[mid]} is too small, so ${target} cannot be at or left of index ${mid}. Discard that half.`,
          [6],
          { lo: mid + 1 },
          snap(mid + 1, hi, { [mid]: "eliminated" }, `range = ${mid + 1}..${hi}`),
        );
        lo = mid + 1;
      } else {
        rec.push(
          "eliminate",
          `${nums[mid]} is too big, so everything from index ${mid} rightwards is out. Discard that half.`,
          [7],
          { hi: mid - 1 },
          snap(lo, mid - 1, { [mid]: "eliminated" }, `range = ${lo}..${mid - 1}`),
        );
        hi = mid - 1;
      }
    }

    rec.push(
      "complete",
      `The range is empty, so ${target} is not in the array. Return -1.`,
      [9],
      { result: -1 },
      {
        rows: [{ values: nums, cells: nums.map(() => "eliminated" as CellState) }],
        counters: { comparisons },
        output: "search = -1",
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------------------- 2. Search a 2D Matrix */

const search2DMatrix: ProblemDefinition = {
  slug: "search-a-2d-matrix",
  title: "Search a 2D Matrix",
  difficulty: "Medium",
  pattern: "Treat the matrix as one sorted array",
  tagline:
    "Rows are sorted and each row starts above the previous row's end, so the whole grid is one long sorted list. Index i lives at row ⌊i/cols⌋, column i mod cols.",
  insight:
    "Flattening avoids two nested searches. If the matrix were only row-sorted, you would instead walk from the top-right corner.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(log(m·n))",
    "O(log(m·n))",
    "O(1)",
    "One binary search over all m×n cells.",
  ),
  code: [
    "function searchMatrix(matrix, target) {",
    "  const rows = matrix.length, cols = matrix[0].length;",
    "  let lo = 0, hi = rows * cols - 1;",
    "  while (lo <= hi) {",
    "    const mid = lo + ((hi - lo) >> 1);",
    "    const v = matrix[Math.floor(mid / cols)][mid % cols];",
    "    if (v === target) return true;",
    "    if (v < target) lo = mid + 1; else hi = mid - 1;",
    "  }",
    "  return false;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "values (row by row, sorted)",
      placeholder: "1 3 5 7 10 11 16 20 23 30 34 60",
      presets: [
        { label: "3×4", value: "1 3 5 7 10 11 16 20 23 30 34 60" },
        { label: "2×3", value: "1 2 3 4 5 6" },
      ],
    },
    { kind: "number", key: "cols", label: "columns", min: 1, max: 6 },
    { kind: "number", key: "target", label: "target" },
  ],
  defaults: { values: "1 3 5 7 10 11 16 20 23 30 34 60", cols: "4", target: "16" },
  generate: ({ values: raw, cols: cRaw, target: tRaw }) => {
    const flat = toNums(raw, 24).sort((a, b) => a - b);
    const cols = Math.min(Math.max(1, toNum(cRaw, 4)), Math.max(1, flat.length));
    const target = toNum(tRaw, 16);
    const rec = createRecorder<S>();
    const rows = Math.ceil(flat.length / cols);
    let comparisons = 0;

    const grid = (lo: number, hi: number, marks: Record<number, CellState>) => ({
      label: `${rows} × ${cols} matrix`,
      cells: Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const i = r * cols + c;
          const value = flat[i];
          return {
            value: value === undefined ? "" : value,
            state: (marks[i] ??
              (value === undefined || i < lo || i > hi ? "eliminated" : "default")) as CellState,
          };
        }),
      ),
    });

    const snap = (lo: number, hi: number, marks: Record<number, CellState>, note: string): S => ({
      grid: grid(lo, hi, marks),
      counters: { comparisons, remaining: Math.max(0, hi - lo + 1) },
      notes: [`target = ${target}`, note],
    });

    let lo = 0;
    let hi = flat.length - 1;
    rec.push(
      "highlight",
      `Read the grid row by row and it is one sorted list of ${flat.length} values.`,
      [3],
      { lo, hi, target },
      snap(lo, hi, {}, `flat range = ${lo}..${hi}`),
    );

    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      const v = flat[mid]!;
      comparisons++;
      rec.push(
        "compare",
        `Flat index ${mid} is row ${Math.floor(mid / cols) + 1}, column ${(mid % cols) + 1}, value ${v}.`,
        [5, 6, 7],
        { mid, value: v, comparisons },
        snap(lo, hi, { [mid]: "compare" }, `mid = ${mid}`),
      );
      if (v === target) {
        rec.push(
          "complete",
          `${target} is in the matrix. Return true.`,
          [7],
          { result: "true" },
          { ...snap(lo, hi, { [mid]: "success" }, "found"), output: "searchMatrix = true" },
        );
        return rec.steps;
      }
      if (v < target) {
        rec.push(
          "eliminate",
          `${v} is too small, so everything up to and including this cell is out.`,
          [8],
          { lo: mid + 1 },
          snap(mid + 1, hi, { [mid]: "eliminated" }, `range = ${mid + 1}..${hi}`),
        );
        lo = mid + 1;
      } else {
        rec.push(
          "eliminate",
          `${v} is too big, so this cell and everything after it is out.`,
          [8],
          { hi: mid - 1 },
          snap(lo, mid - 1, { [mid]: "eliminated" }, `range = ${lo}..${mid - 1}`),
        );
        hi = mid - 1;
      }
    }

    rec.push(
      "complete",
      `Nothing is left to check, so ${target} is not in the matrix.`,
      [10],
      { result: "false" },
      {
        ...snap(1, 0, {}, "empty range"),
        output: "searchMatrix = false",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------ 3. Koko Eating Bananas */

const kokoEatingBananas: ProblemDefinition = {
  slug: "koko-eating-bananas",
  title: "Koko Eating Bananas",
  difficulty: "Medium",
  pattern: "Binary search on the answer",
  tagline:
    "There is nothing sorted to search. Instead, search the range of possible eating speeds: if a speed finishes in time, every faster speed does too.",
  insight:
    "Whenever a candidate answer has a yes/no test that is monotonic (false, false, …, true, true), you can binary search the answer space instead of the input.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n log m)",
    "O(n log m)",
    "O(1)",
    "log m speeds tried, each checked with one pass over the piles.",
  ),
  code: [
    "function minEatingSpeed(piles, h) {",
    "  let lo = 1, hi = Math.max(...piles);",
    "  while (lo < hi) {",
    "    const k = lo + ((hi - lo) >> 1);",
    "    const hours = piles.reduce((a, p) => a + Math.ceil(p / k), 0);",
    "    if (hours <= h) hi = k;",
    "    else lo = k + 1;",
    "  }",
    "  return lo;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "piles",
      label: "piles",
      placeholder: "3 6 7 11",
      presets: [
        { label: "Classic", value: "3 6 7 11" },
        { label: "Tight deadline", value: "30 11 23 4 20" },
        { label: "One pile", value: "312" },
      ],
    },
    { kind: "number", key: "h", label: "hours available", min: 1, max: 40 },
  ],
  defaults: { piles: "3 6 7 11", h: "8" },
  generate: ({ piles: raw, h: hRaw }) => {
    const piles = toNums(raw, 10).map((n) => Math.max(1, n));
    const h = Math.max(piles.length, toNum(hRaw, 8));
    const rec = createRecorder<S>();
    let lo = 1;
    let hi = Math.max(1, ...piles);
    let comparisons = 0;

    const speeds = () => Array.from({ length: hi0 }, (_, i) => i + 1);
    const hi0 = Math.max(1, ...piles);

    const snap = (
      l: number,
      r: number,
      k: number | null,
      hours: number | null,
      note: string,
    ): S => ({
      rows: [
        {
          label: "piles",
          values: piles,
          cells: piles.map(() => "default" as CellState),
          mode: "bars",
          showIndex: false,
        },
        {
          label: "candidate speeds (bananas per hour)",
          values: speeds(),
          cells: speeds().map((sp) =>
            sp === k
              ? ("compare" as CellState)
              : sp < l || sp > r
                ? ("eliminated" as CellState)
                : ("default" as CellState),
          ),
          showIndex: false,
        },
      ],
      counters: { comparisons, remaining: Math.max(0, r - l + 1) },
      notes: [
        `hours allowed = ${h}`,
        note,
        hours === null ? "" : `hours needed at ${k} = ${hours}`,
      ].filter(Boolean) as string[],
    });

    rec.push(
      "highlight",
      `The answer is somewhere between 1 banana per hour and ${hi} (finishing every pile in its own hour).`,
      [2],
      { lo, hi },
      snap(lo, hi, null, null, `speed range = ${lo}..${hi}`),
    );

    while (lo < hi) {
      const k = lo + ((hi - lo) >> 1);
      const hours = piles.reduce((a, p) => a + Math.ceil(p / k), 0);
      comparisons++;
      rec.push(
        "compare",
        `At ${k} bananas per hour the piles take ${hours} hour${hours === 1 ? "" : "s"}.`,
        [4, 5],
        { speed: k, hours, allowed: h, comparisons },
        snap(lo, hi, k, hours, `trying ${k}`),
      );
      if (hours <= h) {
        rec.push(
          "eliminate",
          `${hours} fits inside ${h}, so ${k} works, and anything faster also works, so no need to look right of ${k}.`,
          [6],
          { hi: k },
          snap(lo, k, k, hours, `range = ${lo}..${k}`),
        );
        hi = k;
      } else {
        rec.push(
          "eliminate",
          `${hours} is more than ${h}, so ${k} is too slow. The answer must be faster than ${k}.`,
          [7],
          { lo: k + 1 },
          snap(k + 1, hi, k, hours, `range = ${k + 1}..${hi}`),
        );
        lo = k + 1;
      }
    }

    rec.push(
      "complete",
      `The slowest speed that still finishes in ${h} hours is ${lo}.`,
      [9],
      { result: lo },
      {
        ...snap(
          lo,
          lo,
          lo,
          piles.reduce((a, p) => a + Math.ceil(p / lo), 0),
          "answer",
        ),
        output: `minEatingSpeed = ${lo}`,
      },
    );
    return rec.steps;
  },
};

/* -------------------------- 4. Find Minimum in Rotated Sorted Array */

const findMinRotated: ProblemDefinition = {
  slug: "find-minimum-in-rotated-sorted-array",
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  pattern: "Compare the middle with the right end",
  tagline:
    "A rotated sorted array is two ascending runs. If the middle is bigger than the last value, the break point is to the right; otherwise it is at the middle or to its left.",
  insight:
    "Comparing against a fixed end value rather than against a neighbour is what keeps this correct. The minimum is exactly where the array stops ascending.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(log n)",
    "O(log n)",
    "O(1)",
    "Each comparison halves the candidate range.",
  ),
  code: [
    "function findMin(nums) {",
    "  let lo = 0, hi = nums.length - 1;",
    "  while (lo < hi) {",
    "    const mid = lo + ((hi - lo) >> 1);",
    "    if (nums[mid] > nums[hi]) lo = mid + 1;",
    "    else hi = mid;",
    "  }",
    "  return nums[lo];",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums (rotated sorted)",
      placeholder: "4 5 6 7 0 1 2",
      presets: [
        { label: "Classic", value: "4 5 6 7 0 1 2" },
        { label: "Barely rotated", value: "2 3 4 5 1" },
        { label: "Not rotated", value: "1 2 3 4 5" },
      ],
    },
  ],
  defaults: { nums: "4 5 6 7 0 1 2" },
  generate: ({ nums: raw }) => {
    const nums = toNums(raw, 16);
    const rec = createRecorder<S>();
    let comparisons = 0;

    const snap = (lo: number, hi: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [{ values: nums, cells: range(nums.length, lo, hi, marks), pointers: { lo, hi } }],
      counters: { comparisons, remaining: Math.max(0, hi - lo + 1) },
      notes: [note],
    });

    let lo = 0;
    let hi = nums.length - 1;
    if (nums.length === 0) return rec.steps;
    rec.push(
      "highlight",
      "The smallest value is where the ascending run breaks. Everything is a candidate to start with.",
      [2],
      { lo, hi },
      snap(lo, hi, {}, `range = ${lo}..${hi}`),
    );

    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1);
      comparisons++;
      rec.push(
        "compare",
        `Compare the middle (${nums[mid]}) with the right end (${nums[hi]}).`,
        [4, 5],
        { mid, midValue: nums[mid] ?? 0, hiValue: nums[hi] ?? 0, comparisons },
        snap(lo, hi, { [mid]: "compare", [hi]: "inspect" }, `mid = ${mid}`),
      );
      if (nums[mid]! > nums[hi]!) {
        rec.push(
          "eliminate",
          `${nums[mid]} is bigger than the end value, so the break point must be to the right of the middle.`,
          [5],
          { lo: mid + 1 },
          snap(mid + 1, hi, { [mid]: "eliminated" }, `range = ${mid + 1}..${hi}`),
        );
        lo = mid + 1;
      } else {
        rec.push(
          "eliminate",
          `${nums[mid]} is not bigger than the end value, so from the middle rightwards is already sorted: the minimum is at the middle or to its left.`,
          [6],
          { hi: mid },
          snap(lo, mid, {}, `range = ${lo}..${mid}`),
        );
        hi = mid;
      }
    }

    rec.push(
      "complete",
      `The range collapsed to one value: the minimum is ${nums[lo]} at index ${lo}.`,
      [8],
      { result: nums[lo] ?? 0 },
      {
        rows: [
          {
            values: nums,
            cells: nums.map((_, i) =>
              i === lo ? ("success" as CellState) : ("eliminated" as CellState),
            ),
          },
        ],
        counters: { comparisons },
        output: `findMin = ${nums[lo]}`,
      },
    );
    return rec.steps;
  },
};

/* ----------------------------- 5. Search in Rotated Sorted Array */

const searchRotated: ProblemDefinition = {
  slug: "search-in-rotated-sorted-array",
  title: "Search in Rotated Sorted Array",
  difficulty: "Medium",
  pattern: "Decide which half is sorted, then test the target against it",
  tagline:
    "At every step exactly one half is properly sorted. Check whether the target lies inside that sorted half: if it does, search there; if not, search the other one.",
  insight:
    "Do not try to un-rotate the array. Identify the sorted half (the one whose ends are in order) because only there can you reason about whether the target fits.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(log n)",
    "O(log n)",
    "O(1)",
    "One comparison chain halves the range each time.",
  ),
  code: [
    "function search(nums, target) {",
    "  let lo = 0, hi = nums.length - 1;",
    "  while (lo <= hi) {",
    "    const mid = lo + ((hi - lo) >> 1);",
    "    if (nums[mid] === target) return mid;",
    "    if (nums[lo] <= nums[mid]) {",
    "      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;",
    "      else lo = mid + 1;",
    "    } else {",
    "      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;",
    "      else hi = mid - 1;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums (rotated sorted)",
      placeholder: "4 5 6 7 0 1 2",
      presets: [
        { label: "Classic", value: "4 5 6 7 0 1 2" },
        { label: "Rotated once", value: "5 1 2 3 4" },
        { label: "Not rotated", value: "1 2 3 4 5 6" },
      ],
    },
    { kind: "number", key: "target", label: "target" },
  ],
  defaults: { nums: "4 5 6 7 0 1 2", target: "0" },
  generate: ({ nums: raw, target: tRaw }) => {
    const nums = toNums(raw, 16);
    const target = toNum(tRaw, 0);
    const rec = createRecorder<S>();
    let comparisons = 0;

    const snap = (
      lo: number,
      hi: number,
      marks: Record<number, CellState>,
      note: string,
      win?: { start: number; end: number; label: string },
    ): S => ({
      rows: [
        {
          values: nums,
          cells: range(nums.length, lo, hi, marks),
          pointers: { lo, hi },
          window: win ?? null,
        },
      ],
      counters: { comparisons, remaining: Math.max(0, hi - lo + 1) },
      notes: [`target = ${target}`, note],
    });

    let lo = 0;
    let hi = nums.length - 1;
    rec.push(
      "highlight",
      `Somewhere in here the values wrap around. We are looking for ${target}.`,
      [2],
      { lo, hi, target },
      snap(lo, hi, {}, `range = ${lo}..${hi}`),
    );

    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      comparisons++;
      rec.push(
        "compare",
        `Middle of ${lo}..${hi} is index ${mid}, value ${nums[mid]}.`,
        [4, 5],
        { mid, value: nums[mid] ?? 0, comparisons },
        snap(lo, hi, { [mid]: "compare" }, `mid = ${mid}`),
      );
      if (nums[mid] === target) {
        rec.push(
          "complete",
          `Found ${target} at index ${mid}.`,
          [5],
          { result: mid },
          { ...snap(lo, hi, { [mid]: "success" }, "found"), output: `search = ${mid}` },
        );
        return rec.steps;
      }
      if (nums[lo]! <= nums[mid]!) {
        rec.push(
          "visit",
          `The left half ${lo}..${mid} runs in order (${nums[lo]} up to ${nums[mid]}), so it is the sorted half.`,
          [6],
          { sorted: "left" },
          snap(lo, hi, { [mid]: "compare" }, "left half is sorted", {
            start: lo,
            end: mid,
            label: `sorted: ${nums[lo]} … ${nums[mid]}`,
          }),
        );
        if (target >= nums[lo]! && target < nums[mid]!) {
          rec.push(
            "eliminate",
            `${target} sits inside that sorted half, so drop everything from the middle rightwards.`,
            [7],
            { hi: mid - 1 },
            snap(lo, mid - 1, { [mid]: "eliminated" }, `range = ${lo}..${mid - 1}`),
          );
          hi = mid - 1;
        } else {
          rec.push(
            "eliminate",
            `${target} is not inside that sorted half, so it must be on the other side.`,
            [8],
            { lo: mid + 1 },
            snap(mid + 1, hi, { [mid]: "eliminated" }, `range = ${mid + 1}..${hi}`),
          );
          lo = mid + 1;
        }
      } else {
        rec.push(
          "visit",
          `The left half wraps around, so the right half ${mid}..${hi} is the sorted one (${nums[mid]} up to ${nums[hi]}).`,
          [9, 10],
          { sorted: "right" },
          snap(lo, hi, { [mid]: "compare" }, "right half is sorted", {
            start: mid,
            end: hi,
            label: `sorted: ${nums[mid]} … ${nums[hi]}`,
          }),
        );
        if (target > nums[mid]! && target <= nums[hi]!) {
          rec.push(
            "eliminate",
            `${target} fits inside that sorted half, so search to the right of the middle.`,
            [10],
            { lo: mid + 1 },
            snap(mid + 1, hi, { [mid]: "eliminated" }, `range = ${mid + 1}..${hi}`),
          );
          lo = mid + 1;
        } else {
          rec.push(
            "eliminate",
            `${target} does not fit inside the sorted right half, so look left of the middle.`,
            [11],
            { hi: mid - 1 },
            snap(lo, mid - 1, { [mid]: "eliminated" }, `range = ${lo}..${mid - 1}`),
          );
          hi = mid - 1;
        }
      }
    }

    rec.push(
      "complete",
      `Nothing is left, so ${target} is not present. Return -1.`,
      [14],
      { result: -1 },
      {
        rows: [{ values: nums, cells: nums.map(() => "eliminated" as CellState) }],
        counters: { comparisons },
        output: "search = -1",
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------- 6. Time Based Key-Value Store */

const timeMap: ProblemDefinition = {
  slug: "time-based-key-value-store",
  title: "Time Based Key-Value Store",
  difficulty: "Medium",
  pattern: "Binary search for the largest timestamp ≤ t",
  tagline:
    "Each key keeps its versions in timestamp order. A get is a binary search for the newest version that is not in the future.",
  insight:
    "This is the upper-bound variant: you are not looking for an exact match but the best candidate at or below the target, so you remember the last valid mid instead of returning early.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(log n)",
    "O(log n)",
    "O(n)",
    "Sets append in constant time; gets binary search one key's history.",
  ),
  code: [
    "get(key, t) {",
    "  const arr = this.map.get(key) ?? [];",
    "  let lo = 0, hi = arr.length - 1, best = '';",
    "  while (lo <= hi) {",
    "    const mid = lo + ((hi - lo) >> 1);",
    "    if (arr[mid].time <= t) { best = arr[mid].value; lo = mid + 1; }",
    "    else hi = mid - 1;",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "history",
      label: "versions (value:timestamp)",
      placeholder: "bar:1 baz:4 qux:7",
      presets: [
        { label: "Classic", value: "bar:1 baz:4 qux:7" },
        { label: "Dense", value: "a:1 b:2 c:3 d:4 e:5" },
      ],
    },
    { kind: "number", key: "t", label: "get at timestamp", min: 0, max: 20 },
  ],
  defaults: { history: "bar:1 baz:4 qux:7", t: "5" },
  generate: ({ history: raw, t: tRaw }) => {
    const entries = toWords(raw, 12)
      .map((tok) => {
        const [value, time] = tok.split(":");
        return { value: value ?? "?", time: toNum(time, 0) };
      })
      .sort((a, b) => a.time - b.time);
    const t = Math.max(0, toNum(tRaw, 5));
    const rec = createRecorder<S>();
    let comparisons = 0;
    let best = "";

    const snap = (lo: number, hi: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          label: "timestamps stored for this key",
          values: entries.map((e) => e.time),
          cells: range(entries.length, lo, hi, marks),
          pointers: lo <= hi ? { lo, hi } : {},
          showIndex: false,
        },
        {
          label: "values",
          values: entries.map((e) => e.value),
          cells: entries.map((_, i) => marks[i] ?? "default"),
          showIndex: false,
        },
      ],
      counters: { comparisons },
      notes: [`get at t = ${t}`, note, best ? `best so far = "${best}"` : "no valid version yet"],
    });

    rec.push(
      "highlight",
      `Versions are kept in timestamp order, so we can binary search for the newest one at or before ${t}.`,
      [3],
      { versions: entries.length, t },
      snap(0, entries.length - 1, {}, "all versions in play"),
    );

    let lo = 0;
    let hi = entries.length - 1;
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      const e = entries[mid]!;
      comparisons++;
      rec.push(
        "compare",
        `Version at timestamp ${e.time} holds "${e.value}". Is ${e.time} at or before ${t}?`,
        [5, 6],
        { mid, time: e.time, comparisons },
        snap(lo, hi, { [mid]: "compare" }, `mid = ${mid}`),
      );
      if (e.time <= t) {
        best = e.value;
        rec.push(
          "update",
          `Yes, so "${e.value}" is a valid answer, but a newer valid version may exist, so keep it and search to the right.`,
          [6],
          { best, lo: mid + 1 },
          snap(mid + 1, hi, { [mid]: "success" }, `range = ${mid + 1}..${hi}`),
        );
        lo = mid + 1;
      } else {
        rec.push(
          "eliminate",
          `No, timestamp ${e.time} is in the future relative to ${t}, so it and everything after it is out.`,
          [7],
          { hi: mid - 1 },
          snap(lo, mid - 1, { [mid]: "eliminated" }, `range = ${lo}..${mid - 1}`),
        );
        hi = mid - 1;
      }
    }

    rec.push(
      "complete",
      best
        ? `The newest version at or before ${t} is "${best}".`
        : `No version exists at or before ${t}, so return the empty string.`,
      [9],
      { result: best || "''" },
      {
        ...snap(1, 0, {}, "search finished"),
        output: `get(key, ${t}) = "${best}"`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------- 7. Median of Two Sorted Arrays */

const medianTwoSorted: ProblemDefinition = {
  slug: "median-of-two-sorted-arrays",
  title: "Median of Two Sorted Arrays",
  difficulty: "Hard",
  pattern: "Binary search a partition, not a value",
  tagline:
    "Cut both arrays so the left halves together hold exactly half the values. The cut is correct when every value on the left is no bigger than every value on the right.",
  insight:
    "Search over how many values to take from the smaller array. That single number fixes the other cut, so one binary search over the shorter array is enough.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(log min(m,n))",
    "O(log min(m,n))",
    "O(1)",
    "Binary search over the cut position in the shorter array.",
  ),
  code: [
    "function findMedianSortedArrays(a, b) {",
    "  if (a.length > b.length) [a, b] = [b, a];",
    "  const half = (a.length + b.length + 1) >> 1;",
    "  let lo = 0, hi = a.length;",
    "  while (lo <= hi) {",
    "    const i = (lo + hi) >> 1, j = half - i;",
    "    if (i > 0 && a[i - 1] > b[j]) hi = i - 1;",
    "    else if (j > 0 && b[j - 1] > a[i]) lo = i + 1;",
    "    else return median(a, b, i, j);",
    "  }",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "a",
      label: "nums1 (sorted)",
      placeholder: "1 3",
      presets: [
        { label: "Classic", value: "1 3" },
        { label: "Even total", value: "1 2" },
        { label: "Longer", value: "1 4 7 9" },
      ],
    },
    {
      kind: "numbers",
      key: "b",
      label: "nums2 (sorted)",
      placeholder: "2",
      presets: [
        { label: "Classic", value: "2" },
        { label: "Even total", value: "3 4" },
        { label: "Longer", value: "2 3 5 6 8 10" },
      ],
    },
  ],
  defaults: { a: "1 3", b: "2" },
  generate: ({ a: aRaw, b: bRaw }) => {
    let A = toNums(aRaw, 10).sort((x, y) => x - y);
    let B = toNums(bRaw, 10).sort((x, y) => x - y);
    const rec = createRecorder<S>();
    if (A.length > B.length) [A, B] = [B, A];
    const total = A.length + B.length;
    const half = (total + 1) >> 1;
    let comparisons = 0;

    const NEG = Number.NEGATIVE_INFINITY;
    const POS = Number.POSITIVE_INFINITY;
    const show = (n: number) => (n === NEG ? "-∞" : n === POS ? "+∞" : String(n));

    const snap = (
      i: number,
      j: number,
      note: string,
      marks?: { a?: Record<number, CellState>; b?: Record<number, CellState> },
    ): S => ({
      rows: [
        {
          label: "nums1 (shorter)",
          values: A,
          cells: A.map((_, k) => marks?.a?.[k] ?? (k < i ? "visited" : "default")),
          window:
            i > 0
              ? { start: 0, end: i - 1, label: `${i} value${i === 1 ? "" : "s"} on the left` }
              : null,
          showIndex: false,
        },
        {
          label: "nums2",
          values: B,
          cells: B.map((_, k) => marks?.b?.[k] ?? (k < j ? "visited" : "default")),
          window:
            j > 0
              ? { start: 0, end: j - 1, label: `${j} value${j === 1 ? "" : "s"} on the left` }
              : null,
          showIndex: false,
        },
      ],
      counters: { comparisons },
      notes: [`left half must hold ${half} of ${total} values`, note],
    });

    if (total === 0) return rec.steps;

    let lo = 0;
    let hi = A.length;
    rec.push(
      "highlight",
      `Together there are ${total} values, so the left half must hold ${half} of them. We only need to decide how many come from the shorter array.`,
      [3, 4],
      { total, half },
      snap(0, half, "deciding the cut"),
    );

    while (lo <= hi) {
      const i = (lo + hi) >> 1;
      const j = half - i;
      if (j < 0 || j > B.length) {
        if (j < 0) hi = i - 1;
        else lo = i + 1;
        continue;
      }
      const aLeft = i > 0 ? A[i - 1]! : NEG;
      const aRight = i < A.length ? A[i]! : POS;
      const bLeft = j > 0 ? B[j - 1]! : NEG;
      const bRight = j < B.length ? B[j]! : POS;
      comparisons++;
      rec.push(
        "compare",
        `Try taking ${i} from nums1 and ${j} from nums2. Left edges are ${show(aLeft)} and ${show(bLeft)}; right edges are ${show(aRight)} and ${show(bRight)}.`,
        [6],
        { i, j, comparisons },
        snap(i, j, `cut at ${i} | ${j}`, {
          a: i > 0 ? { [i - 1]: "compare" } : {},
          b: j > 0 ? { [j - 1]: "compare" } : {},
        }),
      );

      if (aLeft > bRight) {
        rec.push(
          "eliminate",
          `${show(aLeft)} on the left is bigger than ${show(bRight)} on the right, so we took too many from nums1.`,
          [7],
          { hi: i - 1 },
          snap(i, j, "take fewer from nums1", { a: { [i - 1]: "error" } }),
        );
        hi = i - 1;
      } else if (bLeft > aRight) {
        rec.push(
          "eliminate",
          `${show(bLeft)} on the left is bigger than ${show(aRight)} on the right, so we took too few from nums1.`,
          [8],
          { lo: i + 1 },
          snap(i, j, "take more from nums1", { b: { [j - 1]: "error" } }),
        );
        lo = i + 1;
      } else {
        const leftMax = Math.max(aLeft, bLeft);
        const rightMin = Math.min(aRight, bRight);
        const median = total % 2 === 1 ? leftMax : (leftMax + rightMin) / 2;
        rec.push(
          "complete",
          total % 2 === 1
            ? `The cut is valid. With an odd count the median is the largest left value: ${show(leftMax)}.`
            : `The cut is valid. With an even count the median is halfway between ${show(leftMax)} and ${show(rightMin)}: ${median}.`,
          [9],
          { median },
          {
            ...snap(i, j, `median = ${median}`, {
              a: Object.fromEntries(
                A.map((_, k) => [k, (k === i - 1 || k === i ? "success" : "visited") as CellState]),
              ),
              b: Object.fromEntries(
                B.map((_, k) => [k, (k === j - 1 || k === j ? "success" : "visited") as CellState]),
              ),
            }),
            output: `median = ${median}`,
          },
        );
        return rec.steps;
      }
    }

    rec.push(
      "complete",
      "No valid cut was found, which can only happen with malformed input.",
      [10],
      { result: "none" },
      snap(0, 0, "no valid cut"),
    );
    return rec.steps;
  },
};

export const BINARY_SEARCH_PROBLEMS: ProblemDefinition[] = [
  binarySearch,
  search2DMatrix,
  kokoEatingBananas,
  findMinRotated,
  searchRotated,
  timeMap,
  medianTwoSorted,
];
