import { createRecorder } from "../recorder";
import type { CharVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface StringInput {
  text: string;
}

type Def = AlgorithmDefinition<CharVizState, StringInput>;

const chars = (s: string, state: CellState = "default") =>
  s.split("").map((char) => ({ char, state }));

/* --------------------------------------------------------- frequency count */

export const charFrequency: Def = {
  slug: "char-frequency",
  title: "Frequency map",
  tagline:
    "Counting characters is the foundation of anagram, permutation and 'most frequent' questions. One pass, one map, O(n) instead of comparing every pair.",
  language: "JavaScript",
  code: [
    "function frequency(s) {",
    "  const map = new Map();",
    "  for (const ch of s) {",
    "    map.set(ch, (map.get(ch) ?? 0) + 1);",
    "  }",
    "  return map;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(k)",
    plainEnglish:
      "One pass over the string. Memory grows with the number of distinct characters, not the length: for lowercase English that is at most 26 entries, effectively constant.",
  },
  generate: ({ text }) => {
    const r = createRecorder<CharVizState>();
    const s = text.slice(0, 20) || "letter";
    const map: Record<string, number> = {};

    r.push(
      "highlight",
      `Counting the characters of "${s}". The map starts empty.`,
      [2],
      { length: s.length },
      {
        chars: chars(s),
        table: {},
        tableLabel: "Frequency map",
      },
    );

    s.split("").forEach((ch, i) => {
      const before = map[ch] ?? 0;
      map[ch] = before + 1;
      r.push(
        before === 0 ? "insert" : "update",
        before === 0
          ? `"${ch}" is new, so it enters the map with count 1.`
          : `"${ch}" was already seen ${before} time(s), so its count becomes ${before + 1}. Looking it up costs O(1): that is why we use a map instead of scanning the string again.`,
        [3, 4],
        { char: ch, count: map[ch]!, i },
        {
          chars: chars(s).map((c, j) => ({
            ...c,
            state: j === i ? "inspect" : j < i ? "visited" : "default",
          })),
          pointers: { i },
          table: { ...map },
          tableLabel: "Frequency map",
          counters: { "distinct characters": Object.keys(map).length },
        },
      );
    });

    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    r.push(
      "complete",
      `Done in one pass. The most frequent character is "${top?.[0]}" with ${top?.[1]}. Comparing every pair of characters instead would have cost O(n²).`,
      [6],
      { distinct: Object.keys(map).length, mostFrequent: top?.[0] ?? null },
      {
        chars: chars(s, "done"),
        table: { ...map },
        tableLabel: "Frequency map",
        counters: { "distinct characters": Object.keys(map).length },
      },
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- palindrome */

export const palindromeCheck: Def = {
  slug: "palindrome-check",
  title: "Palindrome check (two pointers)",
  tagline:
    "Start at both ends and walk inwards. Half the comparisons of a reverse-and-compare, and no extra string allocated.",
  language: "JavaScript",
  code: [
    "function isPalindrome(s) {",
    "  let left = 0;",
    "  let right = s.length - 1;",
    "  while (left < right) {",
    "    if (s[left] !== s[right]) return false;",
    "    left++;",
    "    right--;",
    "  }",
    "  return true;",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "The pointers together cover the string once, so it is linear, but only n/2 comparisons. Reversing the string first would also be O(n) time yet cost O(n) extra memory.",
  },
  generate: ({ text }) => {
    const r = createRecorder<CharVizState>();
    const s =
      (text || "racecar")
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase()
        .slice(0, 20) || "racecar";
    let left = 0;
    let right = s.length - 1;
    let comparisons = 0;

    const snap = (l: number, rr: number, state: CellState) => ({
      chars: chars(s).map((c, i) => ({
        ...c,
        state: (i === l || i === rr ? state : i < l || i > rr ? "done" : "default") as CellState,
      })),
      pointers: { left: l, right: rr },
      counters: { comparisons },
    });

    r.push(
      "highlight",
      `Checking "${s}". left starts at 0 and right at ${right}; a palindrome must match at both ends.`,
      [2, 3],
      { left, right },
      snap(left, right, "inspect"),
    );

    while (left < right) {
      comparisons++;
      const match = s[left] === s[right];
      r.push(
        match ? "compare" : "highlight",
        match
          ? `"${s[left]}" at ${left} equals "${s[right]}" at ${right}. Both ends agree, so move inwards.`
          : `"${s[left]}" at ${left} does not equal "${s[right]}" at ${right}. One mismatch is enough: return false immediately without checking the middle.`,
        match ? [4, 5] : [5],
        { left, right, "s[left]": s[left] ?? null, "s[right]": s[right] ?? null, comparisons },
        snap(left, right, match ? "success" : "error"),
      );
      if (!match) {
        r.push(
          "complete",
          `Not a palindrome, decided after only ${comparisons} comparison(s).`,
          [5],
          { result: false, comparisons },
          { chars: chars(s, "error"), counters: { comparisons } },
        );
        return r.steps;
      }
      left++;
      right--;
    }

    r.push(
      "complete",
      `The pointers met in the middle with every pair matching, so "${s}" is a palindrome, confirmed in ${comparisons} comparisons, about half the length.`,
      [9],
      { result: true, comparisons },
      { chars: chars(s, "done"), counters: { comparisons } },
    );
    return r.steps;
  },
};

/* ---------------------------------------------------------- sliding window */

export const longestUniqueWindow: Def = {
  slug: "longest-unique-substring",
  title: "Longest substring without repeats (sliding window)",
  tagline:
    "The window only ever grows on the right and shrinks on the left, so every character is visited at most twice: O(n) instead of checking every substring.",
  language: "JavaScript",
  code: [
    "function longest(s) {",
    "  const seen = new Map();",
    "  let left = 0, best = 0;",
    "  for (let right = 0; right < s.length; right++) {",
    "    const ch = s[right];",
    "    if (seen.has(ch) && seen.get(ch) >= left) {",
    "      left = seen.get(ch) + 1;",
    "    }",
    "    seen.set(ch, right);",
    "    best = Math.max(best, right - left + 1);",
    "  }",
    "  return best;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(k)",
    plainEnglish:
      "Both pointers only move forward, so the total movement is at most 2n. Checking every substring separately would be O(n²) or worse.",
  },
  generate: ({ text }) => {
    const r = createRecorder<CharVizState>();
    const s = (text || "abcabcbb").slice(0, 18) || "abcabcbb";
    const seen: Record<string, number> = {};
    let left = 0;
    let best = 0;
    let bestWindow = "";

    r.push(
      "highlight",
      `Finding the longest run of unique characters in "${s}". The window is s[left..right].`,
      [2, 3],
      { left: 0, best: 0 },
      {
        chars: chars(s),
        pointers: { left: 0, right: 0 },
        table: {},
        tableLabel: "Last index seen",
        counters: { "window size": 0, best: 0 },
      },
    );

    for (let right = 0; right < s.length; right++) {
      const ch = s[right]!;
      const prev = seen[ch];
      const repeat = prev !== undefined && prev >= left;

      r.push(
        repeat ? "highlight" : "visit",
        repeat
          ? `"${ch}" is already inside the window (at index ${prev}). Instead of restarting, jump left to ${prev! + 1}: that is the smallest move that removes the duplicate.`
          : `"${ch}" is new to the window, so the window grows to size ${right - left + 1}.`,
        repeat ? [6, 7] : [4, 5],
        { right, char: ch, left: repeat ? prev! + 1 : left, best },
        {
          chars: chars(s).map((c, i) => ({
            ...c,
            state: (i === right
              ? repeat
                ? "error"
                : "inspect"
              : i >= (repeat ? prev! + 1 : left) && i < right
                ? "success"
                : i < left
                  ? "eliminated"
                  : "default") as CellState,
          })),
          pointers: { left: repeat ? prev! + 1 : left, right },
          table: { ...seen },
          tableLabel: "Last index seen",
          counters: { "window size": right - (repeat ? prev! + 1 : left) + 1, best },
        },
      );

      if (repeat) left = prev! + 1;
      seen[ch] = right;
      const size = right - left + 1;
      if (size > best) {
        best = size;
        bestWindow = s.slice(left, right + 1);
        r.push(
          "update",
          `The window "${bestWindow}" has ${best} unique characters: a new best.`,
          [10],
          { best, window: bestWindow },
          {
            chars: chars(s).map((c, i) => ({
              ...c,
              state: (i >= left && i <= right
                ? "success"
                : i < left
                  ? "eliminated"
                  : "default") as CellState,
            })),
            pointers: { left, right },
            table: { ...seen },
            tableLabel: "Last index seen",
            counters: { "window size": size, best },
          },
        );
      }
    }

    r.push(
      "complete",
      `Answer: ${best} ("${bestWindow}"). Each character entered and left the window at most once, which is why this is linear.`,
      [12],
      { best, window: bestWindow },
      {
        chars: chars(s, "done"),
        table: { ...seen },
        tableLabel: "Last index seen",
        counters: { best },
      },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------- reverse string */

export const reverseString: Def = {
  slug: "reverse-string",
  title: "Reverse in place",
  tagline:
    "Swap the ends and walk inwards. Strings are immutable in some languages, but on a character array this costs no extra memory.",
  language: "JavaScript",
  code: [
    "function reverse(a) {",
    "  let left = 0, right = a.length - 1;",
    "  while (left < right) {",
    "    [a[left], a[right]] = [a[right], a[left]];",
    "    left++;",
    "    right--;",
    "  }",
    "  return a;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "n/2 swaps, no second array. Building a new reversed string instead would need O(n) extra memory.",
  },
  generate: ({ text }) => {
    const r = createRecorder<CharVizState>();
    const arr = (text || "hello").slice(0, 18).split("");
    let left = 0;
    let right = arr.length - 1;
    let swaps = 0;

    r.push(
      "highlight",
      `Reversing "${arr.join("")}" in place with two pointers.`,
      [2],
      { left, right },
      {
        chars: arr.map((char, i) => ({
          char,
          state: (i === left || i === right ? "inspect" : "default") as CellState,
        })),
        pointers: { left, right },
        counters: { swaps },
      },
    );

    while (left < right) {
      const a = arr[left]!;
      const b = arr[right]!;
      arr[left] = b;
      arr[right] = a;
      swaps++;
      r.push(
        "swap",
        `Swap "${a}" and "${b}". Two characters land in their final positions per swap, so we only need ${Math.floor(arr.length / 2)} of them.`,
        [4],
        { left, right, swaps },
        {
          chars: arr.map((char, i) => ({
            ...{ char },
            state: (i === left || i === right
              ? "success"
              : i < left || i > right
                ? "done"
                : "default") as CellState,
          })),
          pointers: { left, right },
          counters: { swaps },
        },
      );
      left++;
      right--;
    }

    r.push(
      "complete",
      `Reversed: "${arr.join("")}" using ${swaps} swaps and no extra array.`,
      [8],
      { result: arr.join(""), swaps },
      { chars: arr.map((char) => ({ char, state: "done" as CellState })), counters: { swaps } },
    );
    return r.steps;
  },
};

export const STRING_OPS: Def[] = [
  charFrequency,
  palindromeCheck,
  longestUniqueWindow,
  reverseString,
];
