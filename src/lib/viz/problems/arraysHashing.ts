/**
 * Arrays & Hashing: 9 interview problems as pure step generators.
 * Every generator returns ordered snapshots; no timing, no React.
 */

import { createRecorder } from "../recorder";
import {
  fillCells,
  mapPanel,
  toNum,
  toNums,
  toWords,
  type ProblemDefinition,
  type ProblemStep,
  type VizPanel,
} from "../problemState";
import type { CellState } from "../types";

const O = (
  timeBest: string,
  timeAverage: string,
  timeWorst: string,
  space: string,
  plainEnglish: string,
) => ({ timeBest, timeAverage, timeWorst, space, plainEnglish });

function setPanel(
  label: string,
  values: (string | number)[],
  highlight?: string | number,
): VizPanel {
  return {
    label,
    empty: "empty",
    entries: values.map((v) => ({
      key: String(v),
      value: "seen",
      state: v === highlight ? ("inspect" as CellState) : undefined,
    })),
  };
}

/* ------------------------------------------------- 1. Contains Duplicate */

const containsDuplicate: ProblemDefinition = {
  slug: "contains-duplicate",
  title: "Contains Duplicate",
  difficulty: "Easy",
  pattern: "Hash set membership",
  tagline:
    "Walk the array once and remember every value you have already seen. The moment a value is already in the set, you have your duplicate.",
  insight:
    "This is the smallest possible version of the trade that powers this whole category: spend O(n) memory to remember the past, and the inner loop disappears.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(n)", "One pass, and the set holds at most n values."),
  code: [
    "function containsDuplicate(nums) {",
    "  const seen = new Set();",
    "  for (const n of nums) {",
    "    if (seen.has(n)) return true;",
    "    seen.add(n);",
    "  }",
    "  return false;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "1 2 3 1",
      presets: [
        { label: "Has duplicate", value: "1 2 3 1" },
        { label: "All unique", value: "1 2 3 4" },
        { label: "Immediate repeat", value: "5 5 9 2" },
      ],
    },
  ],
  defaults: { nums: "1 2 3 1" },
  generate: ({ nums: raw }) => {
    const nums = toNums(raw, 12);
    const rec = createRecorder<ProblemVizState_>();
    const cells = fillCells(nums.length);
    const seen: number[] = [];

    rec.push(
      "highlight",
      "Start with an empty set. It will hold every value we have already walked past.",
      [2],
      { seen: 0 },
      {
        rows: [{ values: nums, cells: [...cells] }],
        panels: [setPanel("seen", seen)],
        counters: { lookups: 0 },
      },
    );

    let lookups = 0;
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i]!;
      cells[i] = "inspect";
      lookups++;
      rec.push(
        "visit",
        `Is ${n} already in the set?`,
        [3, 4],
        { n, i, lookups },
        {
          rows: [{ values: nums, cells: [...cells], pointers: { i } }],
          panels: [setPanel("seen", seen, n)],
          counters: { lookups },
        },
      );

      if (seen.includes(n)) {
        const first = nums.indexOf(n);
        cells[i] = "error";
        cells[first] = "error";
        rec.push(
          "complete",
          `${n} is already in the set: index ${first} and index ${i} are duplicates. Return true.`,
          [4],
          { result: "true" },
          {
            rows: [{ values: nums, cells: [...cells], pointers: { i } }],
            panels: [setPanel("seen", seen, n)],
            counters: { lookups },
            output: "containsDuplicate = true",
          },
        );
        return rec.steps;
      }

      seen.push(n);
      cells[i] = "visited";
      rec.push(
        "insert",
        `${n} is new: add it to the set and move on.`,
        [5],
        { n, seenSize: seen.length },
        {
          rows: [{ values: nums, cells: [...cells], pointers: { i } }],
          panels: [setPanel("seen", seen, n)],
          counters: { lookups },
        },
      );
    }

    rec.push(
      "complete",
      "Reached the end without a repeat, so every value is unique. Return false.",
      [7],
      { result: "false" },
      {
        rows: [{ values: nums, cells: nums.map(() => "done" as CellState) }],
        panels: [setPanel("seen", seen)],
        counters: { lookups },
        output: "containsDuplicate = false",
      },
    );
    return rec.steps;
  },
};

/* ----------------------------------------------------- 2. Valid Anagram */

export const validAnagram: ProblemDefinition = {
  slug: "valid-anagram",
  title: "Valid Anagram",
  difficulty: "Easy",
  pattern: "Frequency map",
  tagline:
    "Count every letter of the first string, then spend those counts on the second. If the ledger ends empty, the strings are anagrams.",
  insight:
    "Counting then cancelling is the standard way to compare multisets. It beats sorting (O(n log n)) and generalises to group-anagrams and permutation-in-string.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(1)", "Two passes; the map holds at most 26 letters."),
  code: [
    "function isAnagram(s, t) {",
    "  if (s.length !== t.length) return false;",
    "  const count = {};",
    "  for (const ch of s) count[ch] = (count[ch] ?? 0) + 1;",
    "  for (const ch of t) {",
    "    if (!count[ch]) return false;",
    "    count[ch]--;",
    "  }",
    "  return true;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "anagram",
      presets: [
        { label: "anagram", value: "anagram" },
        { label: "rat", value: "rat" },
      ],
    },
    {
      kind: "text",
      key: "t",
      label: "t",
      placeholder: "nagaram",
      presets: [
        { label: "nagaram", value: "nagaram" },
        { label: "car", value: "car" },
      ],
    },
  ],
  defaults: { s: "anagram", t: "nagaram" },
  generate: ({ s: rawS, t: rawT }) => {
    const s = (rawS ?? "").slice(0, 12).split("");
    const t = (rawT ?? "").slice(0, 12).split("");
    const rec = createRecorder<ProblemVizState_>();
    const sc = fillCells(s.length);
    const tc = fillCells(t.length);
    const count = new Map<string, number>();

    const snap = (hl?: string) => ({
      rows: [
        { label: "s", values: s, cells: [...sc], showIndex: false },
        { label: "t", values: t, cells: [...tc], showIndex: false },
      ],
      panels: [mapPanel("letter counts", count, hl)],
    });

    if (s.length !== t.length) {
      rec.push(
        "complete",
        `Lengths differ (${s.length} vs ${t.length}), so they cannot be anagrams. Return false.`,
        [2],
        { result: "false" },
        {
          ...snap(),
          output: "isAnagram = false",
        },
      );
      return rec.steps;
    }

    rec.push(
      "highlight",
      "Same length, so counting is worth doing. Build the letter ledger from s.",
      [2, 3],
      {},
      snap(),
    );

    for (let i = 0; i < s.length; i++) {
      const ch = s[i]!;
      sc[i] = "inspect";
      count.set(ch, (count.get(ch) ?? 0) + 1);
      rec.push(
        "insert",
        `Count '${ch}' from s → ${count.get(ch)}.`,
        [4],
        { ch, count: count.get(ch)! },
        snap(ch),
      );
      sc[i] = "visited";
    }

    rec.push(
      "highlight",
      "Ledger complete. Now spend it letter by letter using t.",
      [5],
      {},
      snap(),
    );

    for (let i = 0; i < t.length; i++) {
      const ch = t[i]!;
      tc[i] = "inspect";
      const have = count.get(ch) ?? 0;
      rec.push(
        "compare",
        `Does the ledger still have a '${ch}'? Count is ${have}.`,
        [6],
        { ch, available: have },
        snap(ch),
      );
      if (have === 0) {
        tc[i] = "error";
        rec.push(
          "complete",
          `No '${ch}' left to spend, so t has a letter s does not. Return false.`,
          [6],
          { result: "false" },
          {
            ...snap(ch),
            output: "isAnagram = false",
          },
        );
        return rec.steps;
      }
      count.set(ch, have - 1);
      if (have - 1 === 0) count.delete(ch);
      tc[i] = "visited";
      rec.push(
        "update",
        `Spend one '${ch}'. Remaining: ${have - 1}.`,
        [7],
        { ch, remaining: have - 1 },
        snap(ch),
      );
    }

    rec.push(
      "complete",
      "The ledger is empty and every letter matched. Return true.",
      [9],
      { result: "true" },
      {
        rows: [
          { label: "s", values: s, cells: s.map(() => "done" as CellState), showIndex: false },
          { label: "t", values: t, cells: t.map(() => "done" as CellState), showIndex: false },
        ],
        panels: [mapPanel("letter counts", count)],
        output: "isAnagram = true",
      },
    );
    return rec.steps;
  },
};

/* ----------------------------------------------------------- 3. Two Sum */

export const twoSum: ProblemDefinition = {
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  pattern: "Complement lookup",
  tagline:
    "For each number, the partner you need is fixed: target − n. Store what you have already seen keyed by value, and the partner search costs nothing.",
  insight:
    "The reframing is the whole trick: instead of searching forward for a pair, ask whether the partner is already behind you. This turns O(n²) into O(n).",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(n)", "One pass; the map can grow to n entries."),
  code: [
    "function twoSum(nums, target) {",
    "  const seen = new Map(); // value -> index",
    "  for (let i = 0; i < nums.length; i++) {",
    "    const need = target - nums[i];",
    "    if (seen.has(need)) return [seen.get(need), i];",
    "    seen.set(nums[i], i);",
    "  }",
    "  return [];",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "2 7 11 15",
      presets: [
        { label: "Classic", value: "2 7 11 15" },
        { label: "No answer", value: "1 2 3" },
        { label: "Negatives", value: "-3 4 3 90" },
      ],
    },
    { kind: "number", key: "target", label: "target", min: -100, max: 200 },
  ],
  defaults: { nums: "2 7 11 15", target: "9" },
  generate: ({ nums: raw, target: rawTarget }) => {
    const nums = toNums(raw, 12);
    const target = toNum(rawTarget, 9);
    const rec = createRecorder<ProblemVizState_>();
    const cells = fillCells(nums.length);
    const seen = new Map<string, number>();

    const snap = (hl?: string, notes?: string[]) => ({
      rows: [{ values: nums, cells: [...cells] }],
      panels: [mapPanel("seen (value → index)", seen, hl)],
      notes: notes ?? [`target = ${target}`],
    });

    rec.push(
      "highlight",
      `We need two numbers adding to ${target}. Keep a map of value → index as we go.`,
      [2],
      { target },
      snap(),
    );

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i]!;
      const need = target - n;
      cells[i] = "inspect";
      rec.push(
        "visit",
        `At index ${i} the value is ${n}, so the partner we need is ${target} − ${n} = ${need}.`,
        [4],
        { i, n, need },
        snap(String(need), [`target = ${target}`, `need = ${need}`]),
      );

      if (seen.has(String(need))) {
        const j = seen.get(String(need))!;
        cells[i] = "success";
        cells[j] = "success";
        rec.push(
          "complete",
          `${need} is already in the map at index ${j}. Indices ${j} and ${i} are the answer.`,
          [5],
          { result: `[${j}, ${i}]` },
          {
            ...snap(String(need), [`${nums[j]} + ${n} = ${target}`]),
            output: `twoSum = [${j}, ${i}]`,
          },
        );
        return rec.steps;
      }

      seen.set(String(n), i);
      cells[i] = "visited";
      rec.push(
        "insert",
        `${need} has not appeared yet. Record ${n} → ${i} in case a later number needs it.`,
        [6],
        { i, n },
        snap(String(n), [`target = ${target}`]),
      );
    }

    rec.push(
      "complete",
      "No pair adds up to the target. Return an empty array.",
      [8],
      { result: "[]" },
      {
        ...snap(),
        output: "twoSum = []",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------ 4. Group Anagrams */

const groupAnagrams: ProblemDefinition = {
  slug: "group-anagrams",
  title: "Group Anagrams",
  difficulty: "Medium",
  pattern: "Canonical key",
  tagline:
    "Anagrams differ only in order, so give each word a canonical form (its sorted letters) and use that as a map key. Words that share a key belong together.",
  insight:
    "Whenever you must group 'things that are the same after ignoring something', invent a key that erases exactly that something. Here it is order.",
  language: "JavaScript",
  complexity: O(
    "O(n·k log k)",
    "O(n·k log k)",
    "O(n·k log k)",
    "O(n·k)",
    "Each of the n words is sorted once (k = word length).",
  ),
  code: [
    "function groupAnagrams(words) {",
    "  const groups = new Map();",
    "  for (const w of words) {",
    "    const key = [...w].sort().join('');",
    "    if (!groups.has(key)) groups.set(key, []);",
    "    groups.get(key).push(w);",
    "  }",
    "  return [...groups.values()];",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "words",
      label: "words (space separated)",
      placeholder: "eat tea tan ate nat bat",
      presets: [
        { label: "Classic", value: "eat tea tan ate nat bat" },
        { label: "No groups", value: "abc def ghi" },
      ],
    },
  ],
  defaults: { words: "eat tea tan ate nat bat" },
  generate: ({ words: raw }) => {
    const words = toWords(raw, 8);
    const rec = createRecorder<ProblemVizState_>();
    const cells = fillCells(words.length);
    const groups = new Map<string, string[]>();

    const panels = (hl?: string): VizPanel[] => [
      {
        label: "sorted key → group",
        empty: "no groups yet",
        entries: [...groups.entries()].map(([k, v]) => ({
          key: k,
          value: v.join(", "),
          state: k === hl ? ("inspect" as CellState) : undefined,
        })),
      },
    ];

    rec.push(
      "highlight",
      "Start with an empty map. Its keys will be sorted letter signatures.",
      [2],
      {},
      {
        rows: [{ values: words, cells: [...cells], showIndex: false }],
        panels: panels(),
      },
    );

    for (let i = 0; i < words.length; i++) {
      const w = words[i]!;
      const key = [...w].sort().join("");
      cells[i] = "inspect";
      rec.push(
        "visit",
        `Sort the letters of "${w}" to get the key "${key}".`,
        [4],
        { word: w, key },
        {
          rows: [{ values: words, cells: [...cells], showIndex: false, pointers: { i } }],
          panels: panels(key),
        },
      );

      const existed = groups.has(key);
      if (!existed) groups.set(key, []);
      groups.get(key)!.push(w);
      cells[i] = existed ? "success" : "visited";
      rec.push(
        "insert",
        existed
          ? `"${key}" already exists, so "${w}" joins that group.`
          : `"${key}" is new: start a fresh group holding "${w}".`,
        existed ? [6] : [5, 6],
        { key, groupSize: groups.get(key)!.length },
        {
          rows: [{ values: words, cells: [...cells], showIndex: false, pointers: { i } }],
          panels: panels(key),
        },
      );
    }

    rec.push(
      "complete",
      `Done: ${groups.size} group(s). Return the map's values.`,
      [8],
      { groups: groups.size },
      {
        rows: [{ values: words, cells: words.map(() => "done" as CellState), showIndex: false }],
        panels: panels(),
        output: `[${[...groups.values()].map((g) => `[${g.join(", ")}]`).join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------ 5. Top K Frequent Elements */

const topKFrequent: ProblemDefinition = {
  slug: "top-k-frequent",
  title: "Top K Frequent Elements",
  difficulty: "Medium",
  pattern: "Bucket sort by count",
  tagline:
    "Count each value, then drop values into buckets indexed by their count. A count can never exceed n, so reading buckets from the back gives the top k without sorting.",
  insight:
    "When the thing you sort by is a small bounded integer, bucketing replaces sorting and the solution becomes O(n) instead of O(n log n).",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "Counting is O(n) and there are exactly n + 1 buckets to scan.",
  ),
  code: [
    "function topKFrequent(nums, k) {",
    "  const count = new Map();",
    "  for (const n of nums) count.set(n, (count.get(n) ?? 0) + 1);",
    "  const buckets = Array.from({ length: nums.length + 1 }, () => []);",
    "  for (const [n, c] of count) buckets[c].push(n);",
    "  const out = [];",
    "  for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {",
    "    for (const n of buckets[c]) if (out.length < k) out.push(n);",
    "  }",
    "  return out;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "1 1 1 2 2 3",
      presets: [
        { label: "Classic", value: "1 1 1 2 2 3" },
        { label: "Single value", value: "7 7 7 7" },
        { label: "Ties", value: "4 4 5 5 6" },
      ],
    },
    { kind: "number", key: "k", label: "k", min: 1, max: 6 },
  ],
  defaults: { nums: "1 1 1 2 2 3", k: "2" },
  generate: ({ nums: raw, k: rawK }) => {
    const nums = toNums(raw, 12);
    const rec = createRecorder<ProblemVizState_>();
    const count = new Map<string, number>();
    const cells = fillCells(nums.length);

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i]!;
      count.set(String(n), (count.get(String(n)) ?? 0) + 1);
      cells[i] = "visited";
      rec.push(
        "insert",
        `Count ${n} → ${count.get(String(n))}.`,
        [3],
        { n, count: count.get(String(n))! },
        {
          rows: [{ values: nums, cells: [...cells], pointers: { i } }],
          panels: [mapPanel("value → count", count, String(n))],
        },
      );
    }

    const k = Math.max(1, Math.min(toNum(rawK, 2), count.size));
    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
    const bucketPanel = (hl?: number): VizPanel => ({
      label: "count → values",
      empty: "no buckets filled",
      entries: buckets
        .map((b, c) => ({ c, b }))
        .filter((x) => x.b.length > 0)
        .map((x) => ({
          key: `count ${x.c}`,
          value: x.b.join(", "),
          state: x.c === hl ? ("inspect" as CellState) : undefined,
        })),
    });

    for (const [key, c] of count) {
      buckets[c]!.push(Number(key));
      rec.push(
        "insert",
        `${key} appears ${c} time(s), so it goes in bucket ${c}.`,
        [4, 5],
        { value: key, bucket: c },
        {
          rows: [{ values: nums, cells: nums.map(() => "visited" as CellState) }],
          panels: [mapPanel("value → count", count, key), bucketPanel(c)],
        },
      );
    }

    const out: number[] = [];
    for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {
      const bucket = buckets[c]!;
      if (bucket.length === 0) continue;
      rec.push(
        "visit",
        `Bucket ${c} is the highest remaining count: take its values.`,
        [7, 8],
        { bucket: c, collected: out.length },
        {
          rows: [{ values: nums, cells: nums.map(() => "visited" as CellState) }],
          panels: [bucketPanel(c)],
          notes: [`k = ${k}`, `result = [${out.join(", ")}]`],
        },
      );
      for (const n of bucket) {
        if (out.length < k) {
          out.push(n);
          rec.push(
            "update",
            `Add ${n} to the result (${out.length} of ${k}).`,
            [8],
            { added: n },
            {
              rows: [
                {
                  values: nums,
                  cells: nums.map((v) =>
                    out.includes(v) ? ("success" as CellState) : ("visited" as CellState),
                  ),
                },
              ],
              panels: [bucketPanel(c)],
              notes: [`k = ${k}`, `result = [${out.join(", ")}]`],
            },
          );
        }
      }
    }

    rec.push(
      "complete",
      `Collected ${k} value(s) without ever sorting the counts.`,
      [10],
      { result: `[${out.join(", ")}]` },
      {
        rows: [
          {
            values: nums,
            cells: nums.map((v) =>
              out.includes(v) ? ("done" as CellState) : ("default" as CellState),
            ),
          },
        ],
        panels: [bucketPanel()],
        output: `topKFrequent = [${out.join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------ 6. Product of Array Except Self */

const productExceptSelf: ProblemDefinition = {
  slug: "product-except-self",
  title: "Product of Array Except Self",
  difficulty: "Medium",
  pattern: "Prefix and suffix products",
  tagline:
    "The answer at index i is (everything to its left) × (everything to its right). Sweep left to right carrying the prefix, then right to left carrying the suffix.",
  insight:
    "Division is banned, so you build the answer from two running products instead. Recognise this shape: 'combine information from both sides' almost always means two sweeps.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(1)", "Two passes and no extra array beyond the output."),
  code: [
    "function productExceptSelf(nums) {",
    "  const res = new Array(nums.length).fill(1);",
    "  let prefix = 1;",
    "  for (let i = 0; i < nums.length; i++) {",
    "    res[i] = prefix;",
    "    prefix *= nums[i];",
    "  }",
    "  let suffix = 1;",
    "  for (let i = nums.length - 1; i >= 0; i--) {",
    "    res[i] *= suffix;",
    "    suffix *= nums[i];",
    "  }",
    "  return res;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "1 2 3 4",
      presets: [
        { label: "Classic", value: "1 2 3 4" },
        { label: "With zero", value: "1 0 3 4" },
        { label: "Negatives", value: "-1 1 0 -3 3" },
      ],
    },
  ],
  defaults: { nums: "1 2 3 4" },
  generate: ({ nums: raw }) => {
    const nums = toNums(raw, 8);
    const rec = createRecorder<ProblemVizState_>();
    const res = nums.map(() => 1);
    const resCells = fillCells(nums.length);

    const snap = (i: number, notes: string[]) => ({
      rows: [
        {
          label: "nums",
          values: nums,
          cells: nums.map((_, j) =>
            j === i ? ("inspect" as CellState) : ("default" as CellState),
          ),
        },
        { label: "res", values: [...res], cells: [...resCells], pointers: { i } },
      ],
      notes,
    });

    let prefix = 1;
    rec.push(
      "highlight",
      "Pass 1 goes left to right and writes 'product of everything to my left' into res.",
      [2, 3],
      { prefix },
      snap(-1, [`prefix = ${prefix}`]),
    );
    for (let i = 0; i < nums.length; i++) {
      res[i] = prefix;
      resCells[i] = "inspect";
      rec.push(
        "update",
        `res[${i}] = ${prefix}, the product of everything left of index ${i}.`,
        [5],
        { i, prefix },
        snap(i, [`prefix = ${prefix}`]),
      );
      prefix *= nums[i]!;
      resCells[i] = "visited";
      rec.push(
        "update",
        `Fold nums[${i}] = ${nums[i]} into the running prefix → ${prefix}.`,
        [6],
        { i, prefix },
        snap(i, [`prefix = ${prefix}`]),
      );
    }

    let suffix = 1;
    rec.push(
      "highlight",
      "Pass 2 goes right to left and multiplies in 'product of everything to my right'.",
      [7, 8],
      { suffix },
      snap(-1, [`suffix = ${suffix}`]),
    );
    for (let i = nums.length - 1; i >= 0; i--) {
      res[i] = res[i]! * suffix;
      resCells[i] = "success";
      rec.push(
        "update",
        `res[${i}] × ${suffix} = ${res[i]}: left side times right side.`,
        [9],
        { i, suffix, value: res[i]! },
        snap(i, [`suffix = ${suffix}`]),
      );
      suffix *= nums[i]!;
      rec.push(
        "update",
        `Fold nums[${i}] = ${nums[i]} into the running suffix → ${suffix}.`,
        [10],
        { i, suffix },
        snap(i, [`suffix = ${suffix}`]),
      );
    }

    rec.push(
      "complete",
      "Every slot now holds left × right, computed without division.",
      [12],
      { result: `[${res.join(", ")}]` },
      {
        rows: [
          { label: "nums", values: nums, cells: fillCells(nums.length) },
          { label: "res", values: [...res], cells: nums.map(() => "done" as CellState) },
        ],
        output: `productExceptSelf = [${res.join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------- 7. Valid Sudoku */

const DEFAULT_BOARD = [
  "53..7....",
  "6..195...",
  ".98....6.",
  "8...6...3",
  "4..8.3..1",
  "7...2...6",
  ".6....28.",
  "...419..5",
  "....8..79",
].join("/");

const validSudoku: ProblemDefinition = {
  slug: "valid-sudoku",
  title: "Valid Sudoku",
  difficulty: "Medium",
  pattern: "Three sets per cell",
  tagline:
    "You do not need to solve the board, only to catch a repeat. Each filled digit is checked against three sets: its row, its column and its 3×3 box.",
  insight:
    "The insight is the box key: Math.floor(r/3) + ',' + Math.floor(c/3) turns a 2D region into a single hashable label. Region keys show up in most matrix problems.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(1)",
    "O(1)",
    "O(1)",
    "The board is always 81 cells, so this is constant work.",
  ),
  code: [
    "function isValidSudoku(board) {",
    "  const rows = {}, cols = {}, boxes = {};",
    "  for (let r = 0; r < 9; r++) {",
    "    for (let c = 0; c < 9; c++) {",
    "      const v = board[r][c];",
    "      if (v === '.') continue;",
    "      const b = `${Math.floor(r / 3)},${Math.floor(c / 3)}`;",
    "      if (rows[r]?.has(v) || cols[c]?.has(v) || boxes[b]?.has(v))",
    "        return false;",
    "      (rows[r] ??= new Set()).add(v);",
    "      (cols[c] ??= new Set()).add(v);",
    "      (boxes[b] ??= new Set()).add(v);",
    "    }",
    "  }",
    "  return true;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "board",
      label: "board (9 rows separated by /)",
      presets: [
        { label: "Valid board", value: DEFAULT_BOARD },
        {
          label: "Duplicate in box",
          value:
            "53..7....\n".trim() +
            "/6..195.../.98....6./8...6...3/4..8.3..1/7...2...6/.6....28./...419..5/....85.79",
        },
      ],
    },
  ],
  defaults: { board: DEFAULT_BOARD },
  generate: ({ board: raw }) => {
    const lines = (raw ?? DEFAULT_BOARD).split("/").slice(0, 9);
    const board: string[][] = Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => {
        const ch = lines[r]?.[c] ?? ".";
        return /[1-9]/.test(ch) ? ch : ".";
      }),
    );

    const rec = createRecorder<ProblemVizState_>();
    const states: CellState[][] = Array.from({ length: 9 }, () => fillCells(9));
    const rows = new Map<number, Set<string>>();
    const cols = new Map<number, Set<string>>();
    const boxes = new Map<string, Set<string>>();

    const grid = (r: number, c: number, mark?: CellState) => {
      const cells = states.map((rowStates, ri) =>
        rowStates.map((st, ci) => {
          let s = st;
          const sameBox =
            Math.floor(ri / 3) === Math.floor(r / 3) && Math.floor(ci / 3) === Math.floor(c / 3);
          if ((ri === r || ci === c || sameBox) && st === "default") s = "compare";
          if (ri === r && ci === c) s = mark ?? "inspect";
          return { value: board[ri]![ci]!, state: s };
        }),
      );
      return { label: "board", cells };
    };

    let checks = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = board[r]![c]!;
        if (v === ".") continue;
        const b = `${Math.floor(r / 3)},${Math.floor(c / 3)}`;
        checks++;
        rec.push(
          "compare",
          `Check ${v} at row ${r + 1}, column ${c + 1}, box ${b}.`,
          [5, 7, 8],
          { value: v, row: r, col: c, box: b, checks },
          {
            grid: grid(r, c),
            counters: { checks },
            notes: [
              `row ${r + 1}: {${[...(rows.get(r) ?? [])].join(",")}}`,
              `col ${c + 1}: {${[...(cols.get(c) ?? [])].join(",")}}`,
              `box ${b}: {${[...(boxes.get(b) ?? [])].join(",")}}`,
            ],
          },
        );

        if (rows.get(r)?.has(v) || cols.get(c)?.has(v) || boxes.get(b)?.has(v)) {
          const where = rows.get(r)?.has(v) ? "row" : cols.get(c)?.has(v) ? "column" : "box";
          rec.push(
            "complete",
            `${v} already appears in this ${where}. The board is invalid: return false.`,
            [9],
            { result: "false", conflict: where },
            {
              grid: grid(r, c, "error"),
              counters: { checks },
              output: "isValidSudoku = false",
            },
          );
          return rec.steps;
        }

        if (!rows.has(r)) rows.set(r, new Set());
        if (!cols.has(c)) cols.set(c, new Set());
        if (!boxes.has(b)) boxes.set(b, new Set());
        rows.get(r)!.add(v);
        cols.get(c)!.add(v);
        boxes.get(b)!.add(v);
        states[r]![c] = "visited";
        rec.push(
          "insert",
          `${v} is new here: record it in the row, column and box sets.`,
          [10, 11, 12],
          { value: v, checks },
          {
            grid: grid(r, c, "success"),
            counters: { checks },
          },
        );
      }
    }

    rec.push(
      "complete",
      "Every filled cell passed all three checks. The board is valid.",
      [15],
      { result: "true" },
      {
        grid: {
          label: "board",
          cells: states.map((rowStates, ri) =>
            rowStates.map((st, ci) => ({
              value: board[ri]![ci]!,
              state: st === "visited" ? ("done" as CellState) : st,
            })),
          ),
        },
        counters: { checks },
        output: "isValidSudoku = true",
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------------- 8. Encode and Decode Strings */

const encodeDecode: ProblemDefinition = {
  slug: "encode-decode-strings",
  title: "Encode and Decode Strings",
  difficulty: "Medium",
  pattern: "Length prefixing",
  tagline:
    "Any delimiter can appear inside the data, so delimiters alone cannot work. Prefix each string with its length and a '#': the decoder reads the length, then takes exactly that many characters.",
  insight:
    "This is a protocol-design question in disguise. Length prefixing is how real wire formats stay unambiguous, and interviewers want to hear why a separator alone fails.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(n)", "Each character is written once and read once."),
  code: [
    "function encode(strs) {",
    "  return strs.map(s => s.length + '#' + s).join('');",
    "}",
    "function decode(str) {",
    "  const out = []; let i = 0;",
    "  while (i < str.length) {",
    "    let j = i;",
    "    while (str[j] !== '#') j++;",
    "    const len = Number(str.slice(i, j));",
    "    out.push(str.slice(j + 1, j + 1 + len));",
    "    i = j + 1 + len;",
    "  }",
    "  return out;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "words",
      label: "strings (space separated)",
      presets: [
        { label: "Classic", value: "neet code love you" },
        { label: "Tricky", value: "a#b 4#x hi" },
      ],
    },
  ],
  defaults: { words: "neet code love you" },
  generate: ({ words: raw }) => {
    const words = toWords(raw, 5);
    const rec = createRecorder<ProblemVizState_>();
    let encoded = "";

    rec.push(
      "highlight",
      "Encoding: write each string's length, then '#', then the string itself.",
      [1, 2],
      {},
      {
        rows: [{ label: "input", values: words, cells: fillCells(words.length), showIndex: false }],
        output: 'encoded = ""',
      },
    );

    for (let i = 0; i < words.length; i++) {
      const w = words[i]!;
      encoded += `${w.length}#${w}`;
      rec.push(
        "insert",
        `"${w}" has length ${w.length}, so append "${w.length}#${w}".`,
        [2],
        { word: w, length: w.length },
        {
          rows: [
            {
              label: "input",
              values: words,
              cells: words.map((_, j) =>
                j === i
                  ? ("inspect" as CellState)
                  : j < i
                    ? ("visited" as CellState)
                    : ("default" as CellState),
              ),
              showIndex: false,
            },
            {
              label: "encoded",
              values: encoded.split(""),
              cells: fillCells(encoded.length, "visited"),
              showIndex: false,
            },
          ],
          output: `encoded = "${encoded}"`,
        },
      );
    }

    const chars = encoded.split("");
    const out: string[] = [];
    let i = 0;
    rec.push(
      "highlight",
      "Decoding: the pointer i always sits on the first digit of a length.",
      [4, 5],
      { i },
      {
        rows: [
          {
            label: "encoded",
            values: chars,
            cells: fillCells(chars.length),
            showIndex: false,
            pointers: { i },
          },
        ],
        notes: ["decoded = []"],
      },
    );

    while (i < chars.length) {
      let j = i;
      while (chars[j] !== "#") j++;
      const len = Number(encoded.slice(i, j));
      rec.push(
        "visit",
        `Read digits from ${i} to the '#' at ${j}: the next string is ${len} character(s) long.`,
        [7, 8, 9],
        { i, j, len },
        {
          rows: [
            {
              label: "encoded",
              values: chars,
              cells: chars.map((_, k) =>
                k >= i && k <= j ? ("inspect" as CellState) : ("default" as CellState),
              ),
              showIndex: false,
              pointers: { i, j },
            },
          ],
          notes: [`decoded = [${out.join(", ")}]`],
        },
      );

      const word = encoded.slice(j + 1, j + 1 + len);
      out.push(word);
      rec.push(
        "update",
        `Take exactly ${len} character(s) after the '#' → "${word}". Content can safely contain '#' or digits.`,
        [10, 11],
        { word, i: j + 1 + len },
        {
          rows: [
            {
              label: "encoded",
              values: chars,
              cells: chars.map((_, k) =>
                k > j && k < j + 1 + len
                  ? ("success" as CellState)
                  : k <= j
                    ? ("visited" as CellState)
                    : ("default" as CellState),
              ),
              showIndex: false,
            },
          ],
          notes: [`decoded = [${out.join(", ")}]`],
        },
      );
      i = j + 1 + len;
    }

    rec.push(
      "complete",
      "The decoded list matches the original list exactly.",
      [13],
      { result: `[${out.join(", ")}]` },
      {
        rows: [
          {
            label: "encoded",
            values: chars,
            cells: fillCells(chars.length, "done"),
            showIndex: false,
          },
          { label: "decoded", values: out, cells: fillCells(out.length, "done"), showIndex: false },
        ],
        output: `decode(encode(strs)) = [${out.join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------- 9. Longest Consecutive Sequence */

const longestConsecutive: ProblemDefinition = {
  slug: "longest-consecutive-sequence",
  title: "Longest Consecutive Sequence",
  difficulty: "Medium",
  pattern: "Set + start detection",
  tagline:
    "Put everything in a set, then only start counting at values that have no left neighbour. Each run is walked exactly once, so the whole scan stays linear.",
  insight:
    "The 'only start at a sequence start' guard is what keeps this O(n) instead of O(n²). Interviewers look for that reasoning, not just for the set.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "Each value is visited at most twice: once as a candidate start, once inside a run.",
  ),
  code: [
    "function longestConsecutive(nums) {",
    "  const set = new Set(nums);",
    "  let best = 0;",
    "  for (const n of set) {",
    "    if (set.has(n - 1)) continue; // not a start",
    "    let length = 1;",
    "    while (set.has(n + length)) length++;",
    "    best = Math.max(best, length);",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "100 4 200 1 3 2",
      presets: [
        { label: "Classic", value: "100 4 200 1 3 2" },
        { label: "Long run", value: "5 6 7 8 9 1" },
        { label: "Duplicates", value: "1 2 0 1" },
      ],
    },
  ],
  defaults: { nums: "100 4 200 1 3 2" },
  generate: ({ nums: raw }) => {
    const nums = toNums(raw, 12);
    const rec = createRecorder<ProblemVizState_>();
    const set = new Set(nums);
    const unique = [...set];
    let best = 0;
    let bestRun: number[] = [];

    const snap = (run: number[], hl?: number, current?: number) => ({
      rows: [
        {
          label: "nums",
          values: nums,
          cells: nums.map((v) =>
            run.includes(v)
              ? ("success" as CellState)
              : bestRun.includes(v)
                ? ("done" as CellState)
                : v === hl
                  ? ("inspect" as CellState)
                  : ("default" as CellState),
          ),
        },
      ],
      panels: [setPanel("set", unique, hl)],
      notes: [`best = ${best}`, ...(current !== undefined ? [`current run = ${current}`] : [])],
    });

    rec.push(
      "highlight",
      "Load every value into a set so 'is x present?' costs O(1).",
      [2, 3],
      { best },
      snap([]),
    );

    for (const n of unique) {
      if (set.has(n - 1)) {
        rec.push(
          "visit",
          `${n} has a left neighbour (${n - 1}), so it is in the middle of a run: skip it.`,
          [5],
          { n, isStart: false },
          snap([], n),
        );
        continue;
      }
      let length = 1;
      const run = [n];
      rec.push(
        "visit",
        `${n - 1} is absent, so ${n} starts a run. Count upwards from here.`,
        [5, 6],
        { n, isStart: true, length },
        snap(run, n, length),
      );
      while (set.has(n + length)) {
        run.push(n + length);
        length++;
        rec.push(
          "update",
          `${n + length - 1} is in the set: the run is now ${length} long.`,
          [7],
          { n, length },
          snap(run, n, length),
        );
      }
      if (length > best) {
        best = length;
        bestRun = [...run];
        rec.push(
          "update",
          `That is the longest run so far: ${length}.`,
          [8],
          { best },
          snap(run, n, length),
        );
      } else {
        rec.push(
          "compare",
          `Run of ${length} does not beat the best of ${best}.`,
          [8],
          { best, length },
          snap(run, n, length),
        );
      }
    }

    rec.push(
      "complete",
      `The longest consecutive run has length ${best}: ${bestRun.join(" → ") || "none"}.`,
      [10],
      { result: best },
      {
        ...snap([]),
        output: `longestConsecutive = ${best}`,
      },
    );
    return rec.steps;
  },
};

/** Local alias so the generators read cleanly. */
type ProblemVizState_ = import("../problemState").ProblemVizState;

export const ARRAYS_HASHING_PROBLEMS: ProblemDefinition[] = [
  containsDuplicate,
  validAnagram,
  twoSum,
  groupAnagrams,
  topKFrequent,
  productExceptSelf,
  validSudoku,
  encodeDecode,
  longestConsecutive,
];

export type { ProblemStep };
