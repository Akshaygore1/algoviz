/**
 * Sliding Window: 6 interview problems as pure step generators.
 * Each generator returns ordered immutable snapshots; no timing, no React.
 */

import { createRecorder } from "../recorder";
import {
  fillCells,
  toNum,
  toNums,
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

const chars = (raw: string | undefined, max = 22) => (raw ?? "").slice(0, max).split("");

/* --------------------------------------- 1. Best Time to Buy and Sell Stock */

const bestTimeToBuySell: ProblemDefinition = {
  slug: "best-time-to-buy-and-sell-stock",
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  pattern: "Window with a cheapest-so-far left edge",
  tagline:
    "Walk forward once. Remember the cheapest day seen so far as the buy day, and at every new day ask what selling today would earn.",
  insight:
    "This is a window whose left edge only ever jumps to a cheaper day. Selling before buying is impossible, so a single forward pass with one running minimum is enough.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(1)",
    "One pass, remembering only the cheapest day and the best profit.",
  ),
  code: [
    "function maxProfit(prices) {",
    "  let buy = 0, best = 0;",
    "  for (let sell = 1; sell < prices.length; sell++) {",
    "    if (prices[sell] < prices[buy]) {",
    "      buy = sell;",
    "    } else {",
    "      best = Math.max(best, prices[sell] - prices[buy]);",
    "    }",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "prices",
      label: "prices",
      placeholder: "7 1 5 3 6 4",
      presets: [
        { label: "Classic", value: "7 1 5 3 6 4" },
        { label: "Falling", value: "7 6 4 3 1" },
        { label: "Rising", value: "1 2 3 8" },
      ],
    },
  ],
  defaults: { prices: "7 1 5 3 6 4" },
  generate: ({ prices: raw }) => {
    const p = toNums(raw, 16);
    const rec = createRecorder<S>();
    let buy = 0;
    let best = 0;
    let bestPair = "";
    let comparisons = 0;

    const snap = (sell: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          label: "prices",
          values: p,
          cells: p.map(
            (_, i) => marks[i] ?? (i < buy ? "eliminated" : i > sell ? "default" : "visited"),
          ),
          pointers: sell >= 0 ? { buy, sell } : { buy },
          mode: "bars",
          window:
            sell > buy
              ? { start: buy, end: sell, label: `profit if sold today = ${p[sell]! - p[buy]!}` }
              : null,
        },
      ],
      counters: { comparisons, best },
      notes: [note, `cheapest so far = ${p[buy]}`, `best = ${best}`, bestPair].filter(
        Boolean,
      ) as string[],
    });

    if (p.length === 0) return rec.steps;
    rec.push(
      "highlight",
      `Day 0 is the only day seen so far, so it is the cheapest buy day for now.`,
      [2],
      { buy, best },
      snap(0, { 0: "inspect" }, ""),
    );

    for (let sell = 1; sell < p.length; sell++) {
      comparisons++;
      rec.push(
        "compare",
        `Is day ${sell} (price ${p[sell]}) cheaper than our buy day (price ${p[buy]})?`,
        [4],
        { sell, price: p[sell] ?? 0, buyPrice: p[buy] ?? 0, comparisons },
        snap(sell, { [buy]: "inspect", [sell]: "compare" }, ""),
      );

      if (p[sell]! < p[buy]!) {
        rec.push(
          "update",
          `Yes: a cheaper day is always a better buy day, so the window restarts here.`,
          [5],
          { buy: sell },
          {
            ...snap(sell, { [sell]: "success" }, ""),
          },
        );
        buy = sell;
      } else {
        const profit = p[sell]! - p[buy]!;
        if (profit > best) {
          best = profit;
          bestPair = `best trade = buy day ${buy} → sell day ${sell}`;
        }
        rec.push(
          "update",
          `Selling on day ${sell} after buying on day ${buy} earns ${profit}. Best profit so far is ${best}.`,
          [7],
          { profit, best },
          snap(
            sell,
            { [buy]: "inspect", [sell]: profit === best && profit > 0 ? "success" : "visited" },
            "",
          ),
        );
      }
    }

    rec.push(
      "complete",
      best > 0
        ? `The most any single trade can earn is ${best}.`
        : "Prices never rose after a cheaper day, so no trade is profitable.",
      [9],
      { result: best },
      {
        rows: [
          { label: "prices", values: p, cells: p.map(() => "done" as CellState), mode: "bars" },
        ],
        counters: { comparisons, best },
        output: `maxProfit = ${best}`,
        notes: bestPair ? [bestPair] : ["no profitable trade"],
      },
    );
    return rec.steps;
  },
};

/* ------------------------- 2. Longest Substring Without Repeating Characters */

export const longestUniqueSubstring: ProblemDefinition = {
  slug: "longest-substring-without-repeating-characters",
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  pattern: "Grow right, shrink left until valid",
  tagline:
    "Extend the window one character at a time. The moment a duplicate arrives, pull the left edge in until the duplicate is gone, then keep growing.",
  insight:
    "The window is never rebuilt from scratch: both edges only move right, which is what makes it O(n) rather than O(n²). The set of characters inside the window is the whole state you need.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(min(n, alphabet))",
    "Each character is added once and removed at most once.",
  ),
  code: [
    "function lengthOfLongestSubstring(s) {",
    "  const seen = new Set();",
    "  let l = 0, best = 0;",
    "  for (let r = 0; r < s.length; r++) {",
    "    while (seen.has(s[r])) {",
    "      seen.delete(s[l]);",
    "      l++;",
    "    }",
    "    seen.add(s[r]);",
    "    best = Math.max(best, r - l + 1);",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "abcabcbb",
      presets: [
        { label: "Classic", value: "abcabcbb" },
        { label: "All same", value: "bbbbb" },
        { label: "Tricky", value: "pwwkew" },
      ],
    },
  ],
  defaults: { s: "abcabcbb" },
  generate: ({ s: raw }) => {
    const s = chars(raw);
    const rec = createRecorder<S>();
    const seen = new Set<string>();
    let l = 0;
    let best = 0;
    let bestText = "";
    let steps = 0;

    const snap = (r: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          values: s.map((c) => (c === " " ? "␣" : c)),
          cells: s.map(
            (_, i) => marks[i] ?? (i >= l && i <= r ? "inspect" : i < l ? "eliminated" : "default"),
          ),
          pointers: { l, r },
          window:
            r >= l
              ? {
                  start: l,
                  end: r,
                  label: `window = "${s.slice(l, r + 1).join("")}" (length ${r - l + 1})`,
                }
              : null,
        },
      ],
      panels: [
        {
          label: "characters in window",
          entries: [...seen].map((k) => ({ key: k === " " ? "␣" : k, value: "in" })),
          empty: "empty",
        },
      ],
      counters: { steps, best },
      notes: [note, bestText ? `best = "${bestText}" (${best})` : `best = ${best}`].filter(Boolean),
    });

    rec.push(
      "highlight",
      "The window starts empty. The left edge marks where the current duplicate-free run begins.",
      [3],
      { l, best },
      snap(-1, {}, "window is empty"),
    );

    for (let r = 0; r < s.length; r++) {
      steps++;
      rec.push(
        "visit",
        `The right edge takes in "${s[r]}".`,
        [4],
        { r, char: s[r] ?? "", steps },
        snap(r, { [r]: "compare" }, `incoming "${s[r]}"`),
      );

      while (seen.has(s[r]!)) {
        rec.push(
          "delete",
          `"${s[r]}" is already inside the window, so drop "${s[l]}" from the left and try again.`,
          [5, 6, 7],
          { l: l + 1, dropped: s[l] ?? "" },
          snap(r, { [r]: "error", [l]: "eliminated" }, `duplicate "${s[r]}"`),
        );
        seen.delete(s[l]!);
        l++;
      }

      seen.add(s[r]!);
      const len = r - l + 1;
      if (len > best) {
        best = len;
        bestText = s.slice(l, r + 1).join("");
      }
      rec.push(
        "update",
        `The window is now duplicate-free with length ${len}. Longest so far: ${best}.`,
        [9, 10],
        { length: len, best },
        snap(r, { [r]: len === best ? "success" : "inspect" }, `length = ${len}`),
      );
    }

    rec.push(
      "complete",
      `The longest run without a repeat is "${bestText}", length ${best}.`,
      [12],
      { result: best },
      {
        rows: [
          { values: s.map((c) => (c === " " ? "␣" : c)), cells: s.map(() => "done" as CellState) },
        ],
        counters: { steps, best },
        output: `lengthOfLongestSubstring = ${best}`,
        notes: [`answer = "${bestText}"`],
      },
    );
    return rec.steps;
  },
};

/* --------------------------- 3. Longest Repeating Character Replacement */

const characterReplacement: ProblemDefinition = {
  slug: "longest-repeating-character-replacement",
  title: "Longest Repeating Character Replacement",
  difficulty: "Medium",
  pattern: "Window valid while (size − most frequent) ≤ k",
  tagline:
    "A window is legal when the characters that are not the most common one can all be rewritten within the k allowed changes.",
  insight:
    "The whole trick is the validity test: window length minus the count of the most frequent character is exactly the number of edits needed. When that exceeds k, shrink.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(alphabet)",
    "Both edges only move right; the counts map is bounded by the alphabet.",
  ),
  code: [
    "function characterReplacement(s, k) {",
    "  const count = new Map();",
    "  let l = 0, most = 0, best = 0;",
    "  for (let r = 0; r < s.length; r++) {",
    "    count.set(s[r], (count.get(s[r]) ?? 0) + 1);",
    "    most = Math.max(most, count.get(s[r]));",
    "    while (r - l + 1 - most > k) {",
    "      count.set(s[l], count.get(s[l]) - 1);",
    "      l++;",
    "    }",
    "    best = Math.max(best, r - l + 1);",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "AABABBA",
      presets: [
        { label: "Classic", value: "AABABBA" },
        { label: "Simple", value: "ABAB" },
        { label: "Uniform", value: "AAAA" },
      ],
    },
    { kind: "number", key: "k", label: "k (allowed changes)", min: 0, max: 10 },
  ],
  defaults: { s: "AABABBA", k: "1" },
  generate: ({ s: raw, k: kRaw }) => {
    const s = chars(raw);
    const k = Math.max(0, toNum(kRaw, 1));
    const rec = createRecorder<S>();
    const count = new Map<string, number>();
    let l = 0;
    let most = 0;
    let best = 0;
    let steps = 0;

    const snap = (r: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          values: s,
          cells: s.map(
            (_, i) => marks[i] ?? (i >= l && i <= r ? "inspect" : i < l ? "eliminated" : "default"),
          ),
          pointers: { l, r },
          window:
            r >= l
              ? {
                  start: l,
                  end: r,
                  label: `window length ${r - l + 1}, edits needed ${Math.max(0, r - l + 1 - most)}, k = ${k}`,
                }
              : null,
        },
      ],
      panels: [
        {
          label: "counts in window",
          entries: [...count.entries()]
            .filter(([, v]) => v > 0)
            .map(([key, v]) => ({ key, value: String(v) })),
          empty: "empty",
        },
      ],
      counters: { steps, best },
      notes: [note, `most frequent = ${most}`, `best = ${best}`],
    });

    rec.push(
      "highlight",
      `Every window is allowed at most ${k} rewritten character${k === 1 ? "" : "s"}.`,
      [3],
      { k, best },
      snap(-1, {}, "window empty"),
    );

    for (let r = 0; r < s.length; r++) {
      steps++;
      count.set(s[r]!, (count.get(s[r]!) ?? 0) + 1);
      most = Math.max(most, count.get(s[r]!)!);
      rec.push(
        "visit",
        `Take in "${s[r]}". The most common character in the window now appears ${most} times.`,
        [5, 6],
        { r, char: s[r] ?? "", most },
        snap(r, { [r]: "compare" }, `incoming "${s[r]}"`),
      );

      while (r - l + 1 - most > k) {
        rec.push(
          "delete",
          `This window needs ${r - l + 1 - most} rewrites, more than the ${k} allowed. Drop "${s[l]}" from the left.`,
          [7, 8, 9],
          { l: l + 1, needed: r - l + 1 - most },
          snap(r, { [l]: "error" }, "too many edits needed"),
        );
        count.set(s[l]!, (count.get(s[l]!) ?? 1) - 1);
        l++;
      }

      const len = r - l + 1;
      best = Math.max(best, len);
      rec.push(
        "update",
        `Length ${len} is achievable with ${Math.max(0, len - most)} rewrite${len - most === 1 ? "" : "s"}. Best so far ${best}.`,
        [11],
        { length: len, best },
        snap(r, { [r]: len === best ? "success" : "inspect" }, `length = ${len}`),
      );
    }

    rec.push(
      "complete",
      `With ${k} change${k === 1 ? "" : "s"} the longest single-character run reachable is ${best}.`,
      [13],
      { result: best },
      {
        rows: [{ values: s, cells: s.map(() => "done" as CellState) }],
        counters: { steps, best },
        output: `characterReplacement = ${best}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------ 4. Permutation in String */

const permutationInString: ProblemDefinition = {
  slug: "permutation-in-string",
  title: "Permutation in String",
  difficulty: "Medium",
  pattern: "Fixed-size window with a count comparison",
  tagline:
    "The window never changes size: it is always as long as the pattern. Slide it along and check whether the letter counts inside match the pattern's counts.",
  insight:
    "Anagrams are equal multisets, so comparing counts is the whole test. Because the size is fixed, each slide is one addition and one removal, never a recount.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(alphabet)",
    "One pass; each slide updates two counts instead of recounting the window.",
  ),
  code: [
    "function checkInclusion(p, s) {",
    "  const need = counts(p), have = new Map();",
    "  for (let r = 0; r < s.length; r++) {",
    "    add(have, s[r]);",
    "    if (r >= p.length) remove(have, s[r - p.length]);",
    "    if (same(need, have)) return true;",
    "  }",
    "  return false;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "p",
      label: "pattern",
      placeholder: "ab",
      presets: [
        { label: "ab", value: "ab" },
        { label: "adc", value: "adc" },
      ],
    },
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "eidbaooo",
      presets: [
        { label: "Contains it", value: "eidbaooo" },
        { label: "Does not", value: "eidboaoo" },
        { label: "Longer", value: "dcda" },
      ],
    },
  ],
  defaults: { p: "ab", s: "eidbaooo" },
  generate: ({ p: pRaw, s: sRaw }) => {
    const p = chars(pRaw, 6);
    const s = chars(sRaw, 20);
    const rec = createRecorder<S>();
    const need = new Map<string, number>();
    for (const c of p) need.set(c, (need.get(c) ?? 0) + 1);
    const have = new Map<string, number>();
    let comparisons = 0;

    const same = () =>
      [...need.entries()].every(([k, v]) => (have.get(k) ?? 0) === v) &&
      [...have.entries()].every(([k, v]) => v === 0 || (need.get(k) ?? 0) === v);

    const snap = (l: number, r: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          label: "s",
          values: s,
          cells: s.map((_, i) => marks[i] ?? (i >= l && i <= r ? "inspect" : "default")),
          pointers: { l, r },
          window:
            r >= l
              ? {
                  start: Math.max(0, l),
                  end: r,
                  label: `window = "${s.slice(Math.max(0, l), r + 1).join("")}"`,
                }
              : null,
        },
      ],
      panels: [
        {
          label: "pattern needs",
          entries: [...need.entries()].map(([key, v]) => ({ key, value: String(v) })),
        },
        {
          label: "window has",
          entries: [...have.entries()]
            .filter(([, v]) => v > 0)
            .map(([key, v]) => ({
              key,
              value: String(v),
              state: need.has(key) ? ("success" as CellState) : ("error" as CellState),
            })),
          empty: "empty",
        },
      ],
      counters: { comparisons },
      notes: [note],
    });

    if (p.length === 0 || s.length < p.length) {
      rec.push(
        "complete",
        "The pattern is empty or longer than the string, so there is nothing to find.",
        [7],
        { result: "false" },
        {
          rows: [{ label: "s", values: s, cells: fillCells(s.length, "eliminated") }],
          output: "checkInclusion = false",
        },
      );
      return rec.steps;
    }

    rec.push(
      "highlight",
      `The window will always be exactly ${p.length} character${p.length === 1 ? "" : "s"} long, the length of the pattern.`,
      [2],
      { patternLength: p.length },
      snap(0, -1, {}, "counting the pattern"),
    );

    for (let r = 0; r < s.length; r++) {
      have.set(s[r]!, (have.get(s[r]!) ?? 0) + 1);
      let l = r - p.length + 1;
      rec.push(
        "visit",
        `Slide right: take in "${s[r]}".`,
        [4],
        { r, char: s[r] ?? "" },
        snap(Math.max(0, l), r, { [r]: "compare" }, `incoming "${s[r]}"`),
      );

      if (r >= p.length) {
        const out = s[r - p.length]!;
        have.set(out, (have.get(out) ?? 1) - 1);
        rec.push(
          "delete",
          `The window would be too long, so "${out}" leaves from the left.`,
          [5],
          { left: l },
          snap(l, r, { [r - p.length]: "eliminated" }, `dropped "${out}"`),
        );
      }
      if (l < 0) l = 0;

      comparisons++;
      if (same()) {
        rec.push(
          "complete",
          `The counts match, so "${s.slice(l, r + 1).join("")}" is a permutation of "${p.join("")}". Return true.`,
          [6],
          { result: "true" },
          {
            ...snap(
              l,
              r,
              Object.fromEntries(
                s.map((_, i) => [
                  i,
                  i >= l && i <= r ? ("success" as CellState) : ("visited" as CellState),
                ]),
              ),
              "counts match",
            ),
            output: "checkInclusion = true",
          },
        );
        return rec.steps;
      }
      rec.push(
        "compare",
        `The counts inside the window do not match the pattern yet.`,
        [6],
        { comparisons },
        snap(l, r, { [r]: "inspect" }, "no match yet"),
      );
    }

    rec.push(
      "complete",
      `No window of length ${p.length} matched the pattern's letter counts. Return false.`,
      [7],
      { result: "false" },
      {
        rows: [{ label: "s", values: s, cells: fillCells(s.length, "eliminated") }],
        counters: { comparisons },
        output: "checkInclusion = false",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------- 5. Minimum Window Substring */

const minimumWindowSubstring: ProblemDefinition = {
  slug: "minimum-window-substring",
  title: "Minimum Window Substring",
  difficulty: "Hard",
  pattern: "Grow until valid, then shrink while still valid",
  tagline:
    "Push the right edge until the window contains every required character, then pull the left edge in as far as it will go while staying valid. Record the smallest valid window seen.",
  insight:
    "Track how many required characters are still missing as a single number. Growing decreases it, shrinking may increase it; that one counter replaces a full map comparison at every step.",
  language: "JavaScript",
  complexity: O(
    "O(n + m)",
    "O(n + m)",
    "O(n + m)",
    "O(alphabet)",
    "Every character enters and leaves the window at most once.",
  ),
  code: [
    "function minWindow(s, t) {",
    "  const need = counts(t);",
    "  let missing = t.length, l = 0, bestL = 0, bestLen = Infinity;",
    "  for (let r = 0; r < s.length; r++) {",
    "    if (need.get(s[r]) > 0) missing--;",
    "    need.set(s[r], (need.get(s[r]) ?? 0) - 1);",
    "    while (missing === 0) {",
    "      if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }",
    "      need.set(s[l], need.get(s[l]) + 1);",
    "      if (need.get(s[l]) > 0) missing++;",
    "      l++;",
    "    }",
    "  }",
    "  return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen);",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "t",
      label: "t (required characters)",
      placeholder: "ABC",
      presets: [
        { label: "ABC", value: "ABC" },
        { label: "aa", value: "aa" },
      ],
    },
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "ADOBECODEBANC",
      presets: [
        { label: "Classic", value: "ADOBECODEBANC" },
        { label: "No answer", value: "ADOBEC" },
        { label: "Repeats", value: "aab" },
      ],
    },
  ],
  defaults: { t: "ABC", s: "ADOBECODEBANC" },
  generate: ({ s: sRaw, t: tRaw }) => {
    const s = chars(sRaw, 20);
    const t = chars(tRaw, 6);
    const rec = createRecorder<S>();
    const need = new Map<string, number>();
    for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
    let missing = t.length;
    let l = 0;
    let bestL = 0;
    let bestLen = Number.POSITIVE_INFINITY;
    let steps = 0;

    const snap = (r: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          label: "s",
          values: s,
          cells: s.map(
            (_, i) => marks[i] ?? (i >= l && i <= r ? "inspect" : i < l ? "eliminated" : "default"),
          ),
          pointers: { l, r },
          window:
            r >= l ? { start: l, end: r, label: `window = "${s.slice(l, r + 1).join("")}"` } : null,
        },
      ],
      panels: [
        {
          label: "still needed (negative = spare)",
          entries: [...need.entries()].map(([key, v]) => ({
            key,
            value: String(v),
            state: v > 0 ? ("error" as CellState) : ("success" as CellState),
          })),
        },
      ],
      counters: { steps, missing, best: bestLen === Number.POSITIVE_INFINITY ? 0 : bestLen },
      notes: [
        note,
        bestLen === Number.POSITIVE_INFINITY
          ? "no valid window yet"
          : `best = "${s.slice(bestL, bestL + bestLen).join("")}"`,
      ],
    });

    rec.push(
      "highlight",
      `We need every character of "${t.join("")}" inside the window. ${missing} still missing.`,
      [3],
      { missing },
      snap(-1, {}, "window empty"),
    );

    for (let r = 0; r < s.length; r++) {
      steps++;
      if ((need.get(s[r]!) ?? 0) > 0) missing--;
      need.set(s[r]!, (need.get(s[r]!) ?? 0) - 1);
      rec.push(
        "visit",
        `Take in "${s[r]}". ${missing === 0 ? "The window now covers everything required." : `${missing} required character${missing === 1 ? "" : "s"} still missing.`}`,
        [5, 6],
        { r, char: s[r] ?? "", missing },
        snap(r, { [r]: "compare" }, `incoming "${s[r]}"`),
      );

      while (missing === 0) {
        const len = r - l + 1;
        if (len < bestLen) {
          bestLen = len;
          bestL = l;
          rec.push(
            "update",
            `This valid window has length ${len}: the smallest so far.`,
            [8],
            { best: len },
            snap(
              r,
              Object.fromEntries(
                s.map((_, i) => [
                  i,
                  i >= l && i <= r
                    ? ("success" as CellState)
                    : i < l
                      ? ("eliminated" as CellState)
                      : ("default" as CellState),
                ]),
              ),
              "new smallest window",
            ),
          );
        }
        need.set(s[l]!, (need.get(s[l]!) ?? 0) + 1);
        if ((need.get(s[l]!) ?? 0) > 0) missing++;
        rec.push(
          "delete",
          `Try shrinking: drop "${s[l]}" from the left. ${missing > 0 ? `That breaks the window: "${s[l]}" is needed again.` : "The window is still valid, so keep shrinking."}`,
          [9, 10, 11],
          { l: l + 1, missing },
          snap(r, { [l]: missing > 0 ? "error" : "eliminated" }, "shrinking"),
        );
        l++;
      }
    }

    const answer =
      bestLen === Number.POSITIVE_INFINITY ? "" : s.slice(bestL, bestL + bestLen).join("");
    rec.push(
      "complete",
      answer
        ? `The smallest window containing every required character is "${answer}".`
        : "No window contains every required character.",
      [14],
      { result: answer || "''" },
      {
        rows: [
          {
            label: "s",
            values: s,
            cells: s.map((_, i) =>
              answer && i >= bestL && i < bestL + bestLen
                ? ("done" as CellState)
                : ("eliminated" as CellState),
            ),
          },
        ],
        counters: { steps, best: bestLen === Number.POSITIVE_INFINITY ? 0 : bestLen },
        output: `minWindow = "${answer}"`,
      },
    );
    return rec.steps;
  },
};

/* -------------------------------------------- 6. Sliding Window Maximum */

const slidingWindowMaximum: ProblemDefinition = {
  slug: "sliding-window-maximum",
  title: "Sliding Window Maximum",
  difficulty: "Hard",
  pattern: "Monotonic deque of candidate indexes",
  tagline:
    "Keep a queue of indexes whose values decrease from front to back. Anything smaller than an incoming value can never be a maximum again, so it is thrown away.",
  insight:
    "A value with a bigger, newer value to its right is dead: it will leave the window no later and is never larger. That single observation gives an O(n) answer instead of O(n·k).",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(k)",
    "Each index is pushed once and popped once; the deque holds at most k of them.",
  ),
  code: [
    "function maxSlidingWindow(nums, k) {",
    "  const dq = [], out = [];",
    "  for (let r = 0; r < nums.length; r++) {",
    "    while (dq.length && nums[dq.at(-1)] < nums[r]) dq.pop();",
    "    dq.push(r);",
    "    if (dq[0] <= r - k) dq.shift();",
    "    if (r >= k - 1) out.push(nums[dq[0]]);",
    "  }",
    "  return out;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "1 3 -1 -3 5 3 6 7",
      presets: [
        { label: "Classic", value: "1 3 -1 -3 5 3 6 7" },
        { label: "Descending", value: "9 8 7 6 5" },
        { label: "Ascending", value: "1 2 3 4 5" },
      ],
    },
    { kind: "number", key: "k", label: "k (window size)", min: 1, max: 8 },
  ],
  defaults: { nums: "1 3 -1 -3 5 3 6 7", k: "3" },
  generate: ({ nums: raw, k: kRaw }) => {
    const nums = toNums(raw, 14);
    const k = Math.min(Math.max(1, toNum(kRaw, 3)), Math.max(1, nums.length));
    const rec = createRecorder<S>();
    const dq: number[] = [];
    const out: number[] = [];
    let steps = 0;

    const snap = (r: number, marks: Record<number, CellState>, note: string): S => {
      const l = Math.max(0, r - k + 1);
      return {
        rows: [
          {
            label: "nums",
            values: nums,
            cells: nums.map(
              (_, i) => marks[i] ?? (i >= l && i <= r ? "inspect" : i < l ? "visited" : "default"),
            ),
            pointers: { r },
            window:
              r >= 0
                ? { start: l, end: r, label: `window = ${nums.slice(l, r + 1).join(", ")}` }
                : null,
          },
        ],
        stacks: [
          {
            label: "deque (front = current maximum)",
            orientation: "horizontal",
            items: dq.map((i, pos) => ({
              value: `${nums[i]}@${i}`,
              state: pos === 0 ? ("success" as CellState) : ("inspect" as CellState),
            })),
          },
        ],
        counters: { steps, answers: out.length },
        notes: [note],
        output: out.length ? `out = [${out.join(", ")}]` : undefined,
      };
    };

    rec.push(
      "highlight",
      `The deque will hold indexes of values that could still be the maximum of a window of size ${k}.`,
      [2],
      { k },
      snap(-1, {}, "deque empty"),
    );

    for (let r = 0; r < nums.length; r++) {
      steps++;
      rec.push(
        "visit",
        `The window's right edge reaches index ${r} (value ${nums[r]}).`,
        [3],
        { r, value: nums[r] ?? 0 },
        snap(r, { [r]: "compare" }, `incoming ${nums[r]}`),
      );

      while (dq.length && nums[dq[dq.length - 1]!]! < nums[r]!) {
        const dead = dq[dq.length - 1]!;
        rec.push(
          "delete",
          `${nums[dead]} at index ${dead} is smaller than the newer ${nums[r]}, so it can never be a maximum again. Pop it.`,
          [4],
          { popped: nums[dead] ?? 0 },
          snap(r, { [dead]: "eliminated", [r]: "compare" }, "popping a smaller value"),
        );
        dq.pop();
      }

      dq.push(r);
      rec.push(
        "insert",
        `Index ${r} joins the back of the deque.`,
        [5],
        { deque: dq.map((i) => nums[i]).join(",") },
        snap(r, { [r]: "inspect" }, "pushed"),
      );

      if (dq[0]! <= r - k) {
        const gone = dq[0]!;
        rec.push(
          "delete",
          `Index ${gone} has slid out of the window, so it leaves the front.`,
          [6],
          { expired: nums[gone] ?? 0 },
          snap(r, { [gone]: "eliminated" }, "front expired"),
        );
        dq.shift();
      }

      if (r >= k - 1) {
        out.push(nums[dq[0]!]!);
        rec.push(
          "update",
          `The window is full, so the front of the deque, ${nums[dq[0]!]}, is this window's maximum.`,
          [7],
          { max: nums[dq[0]!] ?? 0 },
          snap(r, { [dq[0]!]: "success" }, `max = ${nums[dq[0]!]}`),
        );
      }
    }

    rec.push(
      "complete",
      `Every window has been measured: [${out.join(", ")}].`,
      [9],
      { result: out.join(",") },
      {
        rows: [{ label: "nums", values: nums, cells: nums.map(() => "done" as CellState) }],
        counters: { steps, answers: out.length },
        output: `maxSlidingWindow = [${out.join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

export const SLIDING_WINDOW_PROBLEMS: ProblemDefinition[] = [
  bestTimeToBuySell,
  longestUniqueSubstring,
  characterReplacement,
  permutationInString,
  minimumWindowSubstring,
  slidingWindowMaximum,
];
