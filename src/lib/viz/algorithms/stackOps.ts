import { createRecorder } from "../recorder";
import type { StackVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface StackInput {
  values: number[];
  text?: string;
}

type Def = AlgorithmDefinition<StackVizState, StackInput>;

type Item = { value: string | number; state: CellState };

const marked = (items: Item[], state: CellState = "default"): Item[] =>
  items.map((i) => ({ ...i, state }));

/* --------------------------------------------------------- push / pop tour */

export const stackPushPop: Def = {
  slug: "stack-push-pop",
  title: "Push, peek and pop",
  tagline:
    "A stack only has one open end. Everything enters and leaves at the top, which is why every operation is O(1): nothing else ever moves.",
  language: "JavaScript",
  code: [
    "class Stack {",
    "  constructor() { this.items = []; }",
    "  push(x) { this.items.push(x); }",
    "  pop() { return this.items.pop(); }",
    "  peek() { return this.items[this.items.length - 1]; }",
    "  isEmpty() { return this.items.length === 0; }",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(1)",
    timeWorst: "O(1)",
    space: "O(n)",
    plainEnglish:
      "Push and pop touch only the top element, so they never depend on the size. The O(n) is just the storage for the n items themselves.",
  },
  generate: ({ values }) => {
    const r = createRecorder<StackVizState>();
    let items: Item[] = [];

    r.push(
      "highlight",
      "We start with an empty stack. isEmpty() is true and peek() has nothing to return.",
      [6],
      { size: 0, top: null },
      {
        items: [],
        counters: { size: 0 },
      },
    );

    values.forEach((v, i) => {
      items = [...marked(items, "done"), { value: v, state: "success" }];
      r.push(
        "insert",
        `push(${v}) drops ${v} on top. The ${i} item(s) below it are untouched: this is why push is O(1).`,
        [3],
        { pushed: v, size: items.length, top: v },
        { items, counters: { size: items.length } },
      );
    });

    const top = items[items.length - 1];
    r.push(
      "highlight",
      `peek() returns ${top?.value} without removing it. Reading the top is free; we simply look at the last slot.`,
      [5],
      { top: top?.value ?? null, size: items.length },
      {
        items: items.map((it, i) => ({
          ...it,
          state: i === items.length - 1 ? "inspect" : "done",
        })),
        counters: { size: items.length },
      },
    );

    const popCount = Math.min(2, items.length);
    let out: (string | number)[] = [];
    for (let k = 0; k < popCount; k++) {
      const removed = items[items.length - 1]!;
      r.push(
        "highlight",
        `pop() is about to remove ${removed.value}, the most recently pushed item still on the stack. Last in, first out.`,
        [4],
        { popping: removed.value, size: items.length },
        {
          items: items.map((it, i) => ({
            ...it,
            state: i === items.length - 1 ? "error" : "done",
          })),
          counters: { size: items.length },
          output: out.join(" "),
        },
      );
      items = items.slice(0, -1);
      out = [...out, removed.value];
      r.push(
        "delete",
        `${removed.value} is gone and the new top is ${items[items.length - 1]?.value ?? "nothing (empty)"}. Popped order so far: ${out.join(", ")}.`,
        [4],
        { popped: removed.value, size: items.length, top: items[items.length - 1]?.value ?? null },
        { items: marked(items, "done"), counters: { size: items.length }, output: out.join(" ") },
      );
    }

    r.push(
      "complete",
      `Pushed ${values.join(", ")} and popped ${out.join(", ")}, exactly the reverse order. That reversal is what makes stacks the right tool for undo, backtracking and matching brackets.`,
      [1, 7],
      { size: items.length, popped: out.join(",") },
      { items: marked(items, "done"), counters: { size: items.length }, output: out.join(" ") },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------- valid parentheses */

export const stackParentheses: Def = {
  slug: "valid-parentheses",
  title: "Valid parentheses",
  tagline:
    "The interview classic. Push every opening bracket, and every closing bracket must match the one on top: the stack remembers what is still waiting to close.",
  language: "JavaScript",
  code: [
    "function isValid(s) {",
    "  const stack = [];",
    "  const pairs = { ')': '(', ']': '[', '}': '{' };",
    "  for (const ch of s) {",
    "    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);",
    "    else {",
    "      if (stack.pop() !== pairs[ch]) return false;",
    "    }",
    "  }",
    "  return stack.length === 0;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "One pass over the string; each character is pushed or popped once. The worst case for memory is a string of all opening brackets, which all sit on the stack together.",
  },
  generate: ({ text = "{[()]}" }) => {
    const r = createRecorder<StackVizState>();
    const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    let items: Item[] = [];
    const s = text.replace(/[^()[\]{}]/g, "").slice(0, 14) || "()";

    r.push(
      "highlight",
      `Checking "${s}". The stack will hold every bracket that is still open.`,
      [2, 3],
      { input: s, stack: "" },
      { items: [], counters: { size: 0 } },
    );

    for (let i = 0; i < s.length; i++) {
      const ch = s[i]!;
      if (!pairs[ch]) {
        items = [...marked(items, "done"), { value: ch, state: "success" }];
        r.push(
          "insert",
          `"${ch}" opens something, so push it. We do not know yet which closing bracket will match it: the stack keeps it waiting.`,
          [5],
          { char: ch, i, size: items.length },
          { items, counters: { size: items.length }, output: `reading index ${i}` },
        );
      } else {
        const top = items[items.length - 1];
        const ok = top?.value === pairs[ch];
        r.push(
          ok ? "compare" : "highlight",
          ok
            ? `"${ch}" closes, and the top of the stack is "${top?.value}", the matching partner. Pop it and continue.`
            : `"${ch}" closes, but the top of the stack is ${top ? `"${top.value}"` : "empty"}. Brackets must close in the reverse order they opened, so the string is invalid.`,
          [7],
          { char: ch, expected: pairs[ch] ?? null, top: top?.value ?? null, valid: ok },
          {
            items: items.map((it, k) => ({
              ...it,
              state: k === items.length - 1 ? (ok ? "compare" : "error") : "done",
            })),
            counters: { size: items.length },
            output: `reading index ${i}`,
          },
        );
        if (!ok) {
          r.push(
            "complete",
            `Returning false. Nothing after index ${i} matters: one mismatch is enough to reject the whole string.`,
            [7],
            { valid: false },
            {
              items: items.map((it) => ({ ...it, state: "error" })),
              counters: { size: items.length },
            },
          );
          return r.steps;
        }
        items = items.slice(0, -1);
        r.push(
          "delete",
          `Matched pair removed. ${items.length} bracket(s) still open.`,
          [7],
          { size: items.length },
          {
            items: marked(items, "done"),
            counters: { size: items.length },
            output: `reading index ${i}`,
          },
        );
      }
    }

    const valid = items.length === 0;
    r.push(
      "complete",
      valid
        ? "The string ended with an empty stack, so every bracket found its partner in the right order: valid."
        : `The string ended but ${items.length} bracket(s) are still on the stack, so they were never closed: invalid.`,
      [10],
      { valid, leftover: items.length },
      { items: items.map((it) => ({ ...it, state: "error" })), counters: { size: items.length } },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------ next greater element */

export const stackNextGreater: Def = {
  slug: "next-greater-element",
  title: "Next greater element (monotonic stack)",
  tagline:
    "Instead of scanning right for every element (O(n²)), keep a stack of indexes still waiting for a bigger value. Each element is pushed and popped at most once.",
  language: "JavaScript",
  code: [
    "function nextGreater(arr) {",
    "  const res = new Array(arr.length).fill(-1);",
    "  const stack = [];",
    "  for (let i = 0; i < arr.length; i++) {",
    "    while (stack.length && arr[stack.at(-1)] < arr[i]) {",
    "      res[stack.pop()] = arr[i];",
    "    }",
    "    stack.push(i);",
    "  }",
    "  return res;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "The loop looks nested but each index enters and leaves the stack exactly once, so the total work is 2n: linear, not quadratic.",
  },
  generate: ({ values }) => {
    const r = createRecorder<StackVizState>();
    const res: (number | string)[] = values.map(() => -1);
    let items: Item[] = [];

    r.push(
      "highlight",
      `Input ${values.join(", ")}. The stack holds values that have not found a bigger neighbour to their right yet.`,
      [2, 3],
      { i: null },
      {
        items: [],
        counters: { size: 0 },
        output: res.join(" "),
      },
    );

    for (let i = 0; i < values.length; i++) {
      const v = values[i]!;
      r.push(
        "compare",
        `Look at ${v} (index ${i}). Anything smaller still sitting on the stack has just found its next greater element.`,
        [4, 5],
        { i, value: v, size: items.length },
        { items: marked(items, "done"), counters: { size: items.length }, output: res.join(" ") },
      );

      while (items.length && Number(items[items.length - 1]!.value) < v) {
        const popped = items[items.length - 1]!;
        const idx = values.findIndex((x, k) => x === popped.value && res[k] === -1);
        if (idx >= 0) res[idx] = v;
        items = items.slice(0, -1);
        r.push(
          "delete",
          `${popped.value} is smaller than ${v}, so its answer is ${v}. Pop it: it will never need checking again, which is why the total work stays linear.`,
          [5, 6],
          { popped: Number(popped.value), answer: v },
          { items: marked(items, "done"), counters: { size: items.length }, output: res.join(" ") },
        );
      }

      items = [...marked(items, "done"), { value: v, state: "success" }];
      r.push(
        "insert",
        `Push ${v}; it is now waiting for something bigger to appear on its right.`,
        [8],
        { i, size: items.length },
        { items, counters: { size: items.length }, output: res.join(" ") },
      );
    }

    r.push(
      "complete",
      `Anything left on the stack has no greater element to the right, so those answers stay -1. Result: ${res.join(", ")}.`,
      [10],
      { result: res.join(",") },
      {
        items: items.map((it) => ({ ...it, state: "eliminated" })),
        counters: { size: items.length },
        output: res.join(" "),
      },
    );
    return r.steps;
  },
};

export const STACK_OPS: Def[] = [stackPushPop, stackParentheses, stackNextGreater];
