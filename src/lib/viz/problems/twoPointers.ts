/**
 * Two Pointers: 5 interview problems as pure step generators.
 * Every generator returns ordered snapshots; no timing, no React.
 */

import { createRecorder } from "../recorder";
import {
  fillCells,
  toNum,
  toNums,
  type ProblemDefinition,
  type ProblemStep,
  type VizRow,
} from "../problemState";
import type { CellState } from "../types";

type S = import("../problemState").ProblemVizState;

const O = (
  timeBest: string,
  timeAverage: string,
  timeWorst: string,
  space: string,
  plainEnglish: string,
) => ({ timeBest, timeAverage, timeWorst, space, plainEnglish });

/* ---------------------------------------------------- 1. Valid Palindrome */

export const validPalindrome: ProblemDefinition = {
  slug: "valid-palindrome",
  title: "Valid Palindrome",
  difficulty: "Easy",
  pattern: "Converging pointers",
  tagline:
    "One pointer starts at each end and they walk towards each other. Anything that is not a letter or digit gets skipped, and the first mismatched pair ends the story.",
  insight:
    "Cleaning the string first is easy but costs an extra copy. Skipping junk in place is the version interviewers want, because it shows you can keep two independent cursors honest.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(1)",
    "Each pointer moves forward only, so together they touch each character once.",
  ),
  code: [
    "function isPalindrome(s) {",
    "  let l = 0, r = s.length - 1;",
    "  while (l < r) {",
    "    while (l < r && !isAlnum(s[l])) l++;",
    "    while (l < r && !isAlnum(s[r])) r--;",
    "    if (lower(s[l]) !== lower(s[r])) return false;",
    "    l++; r--;",
    "  }",
    "  return true;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "A man, a plan, a canal: Panama",
      presets: [
        { label: "Classic", value: "A man, a plan, a canal: Panama" },
        { label: "Not a palindrome", value: "race a car" },
        { label: "Punctuation only", value: ".,;" },
      ],
    },
  ],
  defaults: { s: "A man, a plan, a canal: Panama" },
  generate: ({ s: raw }) => {
    const s = (raw ?? "").slice(0, 24).split("");
    const rec = createRecorder<S>();
    const cells = fillCells(s.length);
    const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
    const low = (c: string) => c.toLowerCase();
    let comparisons = 0;

    const snap = (l: number, r: number, note: string): S => ({
      rows: [
        { values: s.map((c) => (c === " " ? "␣" : c)), cells: [...cells], pointers: { l, r } },
      ],
      counters: { comparisons },
      notes: [note],
    });

    let l = 0;
    let r = s.length - 1;
    rec.push(
      "highlight",
      "Put one pointer on the first character and one on the last.",
      [2],
      { l, r },
      snap(l, r, `l = ${l}, r = ${r}`),
    );

    while (l < r) {
      if (!isAlnum(s[l]!)) {
        cells[l] = "eliminated";
        rec.push(
          "eliminate",
          `"${s[l]}" is not a letter or digit, so the left pointer skips it.`,
          [4],
          { l },
          snap(l, r, "skipping junk on the left"),
        );
        l++;
        continue;
      }
      if (!isAlnum(s[r]!)) {
        cells[r] = "eliminated";
        rec.push(
          "eliminate",
          `"${s[r]}" is not a letter or digit, so the right pointer skips it.`,
          [5],
          { r },
          snap(l, r, "skipping junk on the right"),
        );
        r--;
        continue;
      }
      cells[l] = "compare";
      cells[r] = "compare";
      comparisons++;
      rec.push(
        "compare",
        `Compare "${s[l]}" with "${s[r]}", ignoring case.`,
        [6],
        { left: s[l] ?? "", right: s[r] ?? "", comparisons },
        snap(l, r, `"${low(s[l]!)}" vs "${low(s[r]!)}"`),
      );

      if (low(s[l]!) !== low(s[r]!)) {
        cells[l] = "error";
        cells[r] = "error";
        rec.push(
          "complete",
          `"${s[l]}" and "${s[r]}" do not match, so this cannot be a palindrome. Return false.`,
          [6],
          { result: "false" },
          {
            ...snap(l, r, "mismatch"),
            output: "isPalindrome = false",
          },
        );
        return rec.steps;
      }

      cells[l] = "done";
      cells[r] = "done";
      rec.push(
        "update",
        "They match, so both pointers step inwards.",
        [7],
        { l: l + 1, r: r - 1 },
        snap(l + 1, r - 1, "matched pair confirmed"),
      );
      l++;
      r--;
    }

    if (l >= 0 && l < s.length) cells[l] = "done";
    rec.push(
      "complete",
      "The pointers met in the middle without a single mismatch. Return true.",
      [9],
      { result: "true" },
      {
        rows: [{ values: s.map((c) => (c === " " ? "␣" : c)), cells: [...cells] }],
        counters: { comparisons },
        output: "isPalindrome = true",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------- 2. Two Sum II (sorted) */

const twoSumSorted: ProblemDefinition = {
  slug: "two-sum-ii",
  title: "Two Sum II: Input Array Is Sorted",
  difficulty: "Medium",
  pattern: "Converging pointers on a sorted array",
  tagline:
    "Because the array is sorted, the sum of the outer pair tells you which pointer to move: too big means shrink from the right, too small means grow from the left.",
  insight:
    "Sorted input is a hint, not decoration. Every move here throws away a whole set of pairs at once, which is why no hash map is needed and space drops to O(1).",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(n)",
    "O(n)",
    "O(1)",
    "The two pointers only ever move towards each other.",
  ),
  code: [
    "function twoSum(nums, target) {",
    "  let l = 0, r = nums.length - 1;",
    "  while (l < r) {",
    "    const sum = nums[l] + nums[r];",
    "    if (sum === target) return [l + 1, r + 1];",
    "    if (sum < target) l++;",
    "    else r--;",
    "  }",
    "  return [];",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums (sorted)",
      placeholder: "2 7 11 15",
      presets: [
        { label: "Classic", value: "2 7 11 15" },
        { label: "Negatives", value: "-4 -1 0 3 8" },
        { label: "No answer", value: "1 2 3 4" },
      ],
    },
    { kind: "number", key: "target", label: "target" },
  ],
  defaults: { nums: "2 7 11 15", target: "9" },
  generate: ({ nums: raw, target: t }) => {
    const nums = toNums(raw, 14).sort((a, b) => a - b);
    const target = toNum(t, 9);
    const rec = createRecorder<S>();
    const cells = fillCells(nums.length);
    let comparisons = 0;

    const snap = (l: number, r: number, sum?: number): S => ({
      rows: [{ values: nums, cells: [...cells], pointers: { l, r } }],
      counters: { comparisons },
      notes: sum === undefined ? [`target = ${target}`] : [`target = ${target}`, `sum = ${sum}`],
    });

    let l = 0;
    let r = nums.length - 1;
    rec.push(
      "highlight",
      `Pointers at both ends. We are hunting for a pair that adds to ${target}.`,
      [2],
      { l, r, target },
      snap(l, r),
    );

    while (l < r) {
      const sum = nums[l]! + nums[r]!;
      cells[l] = "compare";
      cells[r] = "compare";
      comparisons++;
      rec.push(
        "compare",
        `${nums[l]} + ${nums[r]} = ${sum}.`,
        [4],
        { sum, target, comparisons },
        snap(l, r, sum),
      );

      if (sum === target) {
        cells[l] = "success";
        cells[r] = "success";
        rec.push(
          "complete",
          `That is exactly ${target}. The answer is 1-indexed: [${l + 1}, ${r + 1}].`,
          [5],
          { result: `[${l + 1}, ${r + 1}]` },
          {
            ...snap(l, r, sum),
            output: `twoSum = [${l + 1}, ${r + 1}]`,
          },
        );
        return rec.steps;
      }

      if (sum < target) {
        cells[l] = "eliminated";
        rec.push(
          "eliminate",
          `${sum} is too small. Every pair using ${nums[l]} is even smaller or already checked, so drop it and move left forward.`,
          [6],
          { l: l + 1 },
          snap(l + 1, r, sum),
        );
        l++;
      } else {
        cells[r] = "eliminated";
        rec.push(
          "eliminate",
          `${sum} is too big. ${nums[r]} is the largest value left, so it cannot help; move right backwards.`,
          [7],
          { r: r - 1 },
          snap(l, r - 1, sum),
        );
        r--;
      }
    }

    rec.push(
      "complete",
      "The pointers crossed, so no pair adds to the target.",
      [9],
      { result: "[]" },
      {
        rows: [{ values: nums, cells: nums.map(() => "eliminated" as CellState) }],
        counters: { comparisons },
        output: "twoSum = []",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------------- 3. 3Sum */

const threeSum: ProblemDefinition = {
  slug: "3sum",
  title: "3Sum",
  difficulty: "Medium",
  pattern: "Sort, then fix one value and two-pointer the rest",
  tagline:
    "Sort the array, then walk an anchor from left to right. For each anchor the rest of the problem is exactly Two Sum II on the remaining slice, looking for the anchor's negative.",
  insight:
    "This is the template for turning a three-value search into a two-value one: fix the outer value, and the inner search collapses to two pointers. Skipping equal anchors is what keeps the triplets unique.",
  language: "JavaScript",
  complexity: O(
    "O(n²)",
    "O(n²)",
    "O(n²)",
    "O(1)",
    "One pass per anchor, each running a linear two-pointer sweep.",
  ),
  code: [
    "function threeSum(nums) {",
    "  nums.sort((a, b) => a - b);",
    "  const res = [];",
    "  for (let i = 0; i < nums.length; i++) {",
    "    if (i > 0 && nums[i] === nums[i - 1]) continue;",
    "    let l = i + 1, r = nums.length - 1;",
    "    while (l < r) {",
    "      const sum = nums[i] + nums[l] + nums[r];",
    "      if (sum < 0) l++;",
    "      else if (sum > 0) r--;",
    "      else { res.push([nums[i], nums[l], nums[r]]); l++; r--;",
    "        while (l < r && nums[l] === nums[l - 1]) l++; }",
    "    }",
    "  }",
    "  return res;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "-1 0 1 2 -1 -4",
      presets: [
        { label: "Classic", value: "-1 0 1 2 -1 -4" },
        { label: "All zeros", value: "0 0 0 0" },
        { label: "No triplet", value: "1 2 3 4 5" },
      ],
    },
  ],
  defaults: { nums: "-1 0 1 2 -1 -4" },
  generate: ({ nums: raw }) => {
    const nums = toNums(raw, 12).sort((a, b) => a - b);
    const rec = createRecorder<S>();
    const found: string[] = [];
    let comparisons = 0;

    const snap = (
      marks: Record<number, CellState>,
      ptrs: Record<string, number>,
      note: string,
    ): S => ({
      rows: [
        {
          values: nums,
          cells: nums.map((_, i) => marks[i] ?? "default"),
          pointers: ptrs,
        },
      ],
      counters: { comparisons, triplets: found.length },
      notes: [note],
      output: found.length ? `res = [${found.join(", ")}]` : undefined,
    });

    rec.push(
      "highlight",
      "Sort first. Sorted order is what makes the inner two-pointer sweep possible and duplicates easy to skip.",
      [2],
      { nums: nums.join(" ") },
      snap({}, {}, "sorted"),
    );

    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        rec.push(
          "eliminate",
          `nums[${i}] is the same anchor value as before (${nums[i]}), so it can only repeat triplets we already have. Skip it.`,
          [5],
          { i },
          snap({ [i]: "eliminated" }, { i }, "duplicate anchor"),
        );
        continue;
      }
      let l = i + 1;
      let r = nums.length - 1;
      rec.push(
        "visit",
        `Fix ${nums[i]} as the anchor. Now find two values in the rest that add to ${-nums[i]!}.`,
        [4, 6],
        { i, anchor: nums[i] ?? 0, need: -nums[i]! },
        snap(
          { [i]: "inspect" },
          { i, l, r },
          `need ${nums[l] === undefined ? "" : ""}sum = ${-nums[i]!}`,
        ),
      );

      while (l < r) {
        const sum = nums[i]! + nums[l]! + nums[r]!;
        comparisons++;
        rec.push(
          "compare",
          `${nums[i]} + ${nums[l]} + ${nums[r]} = ${sum}.`,
          [8],
          { sum, comparisons },
          snap({ [i]: "inspect", [l]: "compare", [r]: "compare" }, { i, l, r }, `sum = ${sum}`),
        );

        if (sum < 0) {
          rec.push(
            "eliminate",
            `${sum} is below zero, so we need a bigger value; move the left pointer up.`,
            [9],
            { l: l + 1 },
            snap({ [i]: "inspect", [l]: "eliminated" }, { i, l: l + 1, r }, "too small"),
          );
          l++;
        } else if (sum > 0) {
          rec.push(
            "eliminate",
            `${sum} is above zero, so we need a smaller value; move the right pointer down.`,
            [10],
            { r: r - 1 },
            snap({ [i]: "inspect", [r]: "eliminated" }, { i, l, r: r - 1 }, "too big"),
          );
          r--;
        } else {
          found.push(`[${nums[i]},${nums[l]},${nums[r]}]`);
          rec.push(
            "insert",
            `Zero. Record the triplet [${nums[i]}, ${nums[l]}, ${nums[r]}] and move both pointers inwards.`,
            [11],
            { triplets: found.length },
            snap({ [i]: "success", [l]: "success", [r]: "success" }, { i, l, r }, "triplet found"),
          );
          l++;
          r--;
          while (l < r && nums[l] === nums[l - 1]) {
            rec.push(
              "eliminate",
              `nums[${l}] repeats the value we just used, so skip it to keep the triplets unique.`,
              [12],
              { l: l + 1 },
              snap({ [i]: "inspect", [l]: "eliminated" }, { i, l, r }, "duplicate skipped"),
            );
            l++;
          }
        }
      }
    }

    rec.push(
      "complete",
      found.length
        ? `Every anchor has been tried. ${found.length} unique triplet${found.length === 1 ? "" : "s"} sum to zero.`
        : "Every anchor has been tried and nothing sums to zero.",
      [14],
      { result: found.length },
      {
        rows: [{ values: nums, cells: nums.map(() => "done" as CellState) }],
        counters: { comparisons, triplets: found.length },
        output: `res = [${found.join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------------- 4. Container With Most Water */

const containerWithMostWater: ProblemDefinition = {
  slug: "container-with-most-water",
  title: "Container With Most Water",
  difficulty: "Medium",
  pattern: "Greedy converging pointers",
  tagline:
    "Start with the widest possible container and always move the shorter wall inwards. Width can only shrink, so the only hope of a bigger area is a taller wall.",
  insight:
    "The proof is the interview answer: moving the taller wall can never help, because the shorter wall still caps the height while the width gets smaller. That single sentence justifies discarding a whole column.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(1)",
    "Each step retires one wall, so the pointers meet after n moves.",
  ),
  code: [
    "function maxArea(height) {",
    "  let l = 0, r = height.length - 1, best = 0;",
    "  while (l < r) {",
    "    const h = Math.min(height[l], height[r]);",
    "    best = Math.max(best, h * (r - l));",
    "    if (height[l] < height[r]) l++;",
    "    else r--;",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "height",
      label: "height",
      placeholder: "1 8 6 2 5 4 8 3 7",
      presets: [
        { label: "Classic", value: "1 8 6 2 5 4 8 3 7" },
        { label: "Increasing", value: "1 2 3 4 5" },
        { label: "Tall edges", value: "9 1 1 1 9" },
      ],
    },
  ],
  defaults: { height: "1 8 6 2 5 4 8 3 7" },
  generate: ({ height: raw }) => {
    const h = toNums(raw, 14).map((n) => Math.max(0, n));
    const rec = createRecorder<S>();
    let best = 0;
    let bestPair = "";
    let comparisons = 0;

    const snap = (
      l: number,
      r: number,
      marks: Record<number, CellState>,
      area?: number,
    ): VizRow => {
      const level = Math.min(h[l] ?? 0, h[r] ?? 0);
      return {
        values: h,
        cells: h.map((_, i) => marks[i] ?? (i > l && i < r ? "inspect" : "default")),
        pointers: { l, r },
        mode: "bars",
        fill: h.map((v, i) => (i >= l && i <= r && v > 0 ? Math.min(1, level / v) : null)),
        ...(area === undefined
          ? {}
          : { window: { start: l, end: r, label: `area = ${level} × ${r - l} = ${area}` } }),
      };
    };

    let l = 0;
    let r = h.length - 1;
    rec.push(
      "highlight",
      "Start as wide as possible: the first and last walls.",
      [2],
      { l, r, best },
      {
        rows: [snap(l, r, { [l]: "compare", [r]: "compare" })],
        counters: { comparisons },
        notes: ["best = 0"],
      },
    );

    while (l < r) {
      const level = Math.min(h[l]!, h[r]!);
      const area = level * (r - l);
      comparisons++;
      if (area > best) {
        best = area;
        bestPair = `${l}..${r}`;
      }
      rec.push(
        "compare",
        `The shorter wall is ${level}, and the width is ${r - l}, so this container holds ${area}.`,
        [4, 5],
        { level, width: r - l, area, best, comparisons },
        {
          rows: [
            snap(
              l,
              r,
              {
                [l]: area === best ? "success" : "compare",
                [r]: area === best ? "success" : "compare",
              },
              area,
            ),
          ],
          counters: { comparisons },
          notes: [`best = ${best}`, bestPair ? `best pair = ${bestPair}` : ""].filter(Boolean),
        },
      );

      if (h[l]! < h[r]!) {
        rec.push(
          "eliminate",
          `Wall ${l} (height ${h[l]}) is the shorter one. Keeping it can only lose width, so retire it.`,
          [6],
          { l: l + 1 },
          {
            rows: [snap(l, r, { [l]: "eliminated", [r]: "compare" })],
            counters: { comparisons },
            notes: [`best = ${best}`],
          },
        );
        l++;
      } else {
        rec.push(
          "eliminate",
          `Wall ${r} (height ${h[r]}) is the shorter one, or a tie, which is just as safe to drop. Retire it.`,
          [7],
          { r: r - 1 },
          {
            rows: [snap(l, r, { [l]: "compare", [r]: "eliminated" })],
            counters: { comparisons },
            notes: [`best = ${best}`],
          },
        );
        r--;
      }
    }

    rec.push(
      "complete",
      `The walls met. The largest container holds ${best}.`,
      [9],
      { result: best },
      {
        rows: [{ values: h, cells: h.map(() => "done" as CellState), mode: "bars" }],
        counters: { comparisons },
        output: `maxArea = ${best}`,
        notes: [`best pair = indexes ${bestPair}`],
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------------------- 5. Trapping Rain Water */

const trappingRainWater: ProblemDefinition = {
  slug: "trapping-rain-water",
  title: "Trapping Rain Water",
  difficulty: "Hard",
  pattern: "Converging pointers carrying running maxima",
  tagline:
    "Water above a bar is capped by the tallest wall on each side. Walk inwards from both ends, always from the lower side, and the running maximum on that side is guaranteed to be the true limit.",
  insight:
    "The leap is realising you never need the far side's exact maximum, only that it is at least as tall as your side's. That is why processing the lower pointer first is always safe.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(1)",
    "One pass with two pointers, no prefix arrays needed.",
  ),
  code: [
    "function trap(height) {",
    "  let l = 0, r = height.length - 1;",
    "  let leftMax = height[l], rightMax = height[r], water = 0;",
    "  while (l < r) {",
    "    if (leftMax <= rightMax) {",
    "      l++; leftMax = Math.max(leftMax, height[l]);",
    "      water += leftMax - height[l];",
    "    } else {",
    "      r--; rightMax = Math.max(rightMax, height[r]);",
    "      water += rightMax - height[r];",
    "    }",
    "  }",
    "  return water;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "height",
      label: "height",
      placeholder: "0 1 0 2 1 0 1 3 2 1 2 1",
      presets: [
        { label: "Classic", value: "0 1 0 2 1 0 1 3 2 1 2 1" },
        { label: "Deep basin", value: "4 2 0 3 2 5" },
        { label: "No water", value: "1 2 3 4 5" },
      ],
    },
  ],
  defaults: { height: "0 1 0 2 1 0 1 3 2 1 2 1" },
  generate: ({ height: raw }) => {
    const h = toNums(raw, 16).map((n) => Math.max(0, n));
    const rec = createRecorder<S>();
    const trapped = h.map(() => 0);
    let water = 0;
    let steps = 0;

    const snap = (
      l: number,
      r: number,
      marks: Record<number, CellState>,
      leftMax: number,
      rightMax: number,
    ): S => ({
      rows: [
        {
          label: "height",
          values: h,
          cells: h.map((_, i) => marks[i] ?? (i > l && i < r ? "default" : "visited")),
          pointers: { l, r },
          mode: "bars",
          fill: h.map((v, i) => (trapped[i]! > 0 && v > 0 ? 1 : null)),
        },
        {
          label: "water trapped here",
          values: trapped,
          cells: trapped.map((w) => (w > 0 ? ("inspect" as CellState) : ("default" as CellState))),
          showIndex: false,
        },
      ],
      counters: { steps, water },
      notes: [`leftMax = ${leftMax}`, `rightMax = ${rightMax}`, `water = ${water}`],
    });

    if (h.length < 3) {
      rec.push(
        "complete",
        "Fewer than three bars can never hold water.",
        [12],
        { result: 0 },
        {
          rows: [{ values: h, cells: h.map(() => "done" as CellState), mode: "bars" }],
          output: "trap = 0",
        },
      );
      return rec.steps;
    }

    let l = 0;
    let r = h.length - 1;
    let leftMax = h[l]!;
    let rightMax = h[r]!;
    rec.push(
      "highlight",
      "Start at both ends. Each side remembers the tallest wall it has walked past.",
      [2, 3],
      { l, r, leftMax, rightMax },
      snap(l, r, { [l]: "compare", [r]: "compare" }, leftMax, rightMax),
    );

    while (l < r) {
      steps++;
      if (leftMax <= rightMax) {
        rec.push(
          "compare",
          `leftMax (${leftMax}) is not taller than rightMax (${rightMax}), so the left side is the limiting one. Move left inwards.`,
          [5, 6],
          { leftMax, rightMax },
          snap(l, r, { [l]: "compare", [r]: "visited" }, leftMax, rightMax),
        );
        l++;
        const prev = leftMax;
        leftMax = Math.max(leftMax, h[l]!);
        const add = leftMax - h[l]!;
        trapped[l] = add;
        water += add;
        rec.push(
          add > 0 ? "update" : "visit",
          add > 0
            ? `Bar ${l} is height ${h[l]} but water can rise to ${leftMax}, so it holds ${add}.`
            : `Bar ${l} is height ${h[l]}, a new left maximum (was ${prev}). Nothing can sit on top of it.`,
          [6, 7],
          { l, leftMax, added: add, water },
          snap(l, r, { [l]: add > 0 ? "success" : "inspect", [r]: "visited" }, leftMax, rightMax),
        );
      } else {
        rec.push(
          "compare",
          `rightMax (${rightMax}) is the smaller wall, so the right side limits the water. Move right inwards.`,
          [8, 9],
          { leftMax, rightMax },
          snap(l, r, { [l]: "visited", [r]: "compare" }, leftMax, rightMax),
        );
        r--;
        const prev = rightMax;
        rightMax = Math.max(rightMax, h[r]!);
        const add = rightMax - h[r]!;
        trapped[r] = add;
        water += add;
        rec.push(
          add > 0 ? "update" : "visit",
          add > 0
            ? `Bar ${r} is height ${h[r]} but water can rise to ${rightMax}, so it holds ${add}.`
            : `Bar ${r} is height ${h[r]}, a new right maximum (was ${prev}). Nothing can sit on top of it.`,
          [9, 10],
          { r, rightMax, added: add, water },
          snap(l, r, { [l]: "visited", [r]: add > 0 ? "success" : "inspect" }, leftMax, rightMax),
        );
      }
    }

    rec.push(
      "complete",
      `The pointers met. Adding every column of water gives ${water}.`,
      [12],
      { result: water },
      {
        rows: [
          {
            label: "height",
            values: h,
            cells: h.map(() => "done" as CellState),
            mode: "bars",
            fill: h.map((v, i) => (trapped[i]! > 0 && v > 0 ? 1 : null)),
          },
          {
            label: "water trapped here",
            values: trapped,
            cells: trapped.map((w) =>
              w > 0 ? ("success" as CellState) : ("default" as CellState),
            ),
            showIndex: false,
          },
        ],
        counters: { steps, water },
        output: `trap = ${water}`,
      },
    );
    return rec.steps;
  },
};

export const TWO_POINTERS_PROBLEMS: ProblemDefinition[] = [
  validPalindrome,
  twoSumSorted,
  threeSum,
  containerWithMostWater,
  trappingRainWater,
];

export type { ProblemStep };
