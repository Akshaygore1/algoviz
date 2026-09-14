/**
 * Stack: 6 interview problems as pure step generators.
 */

import { createRecorder } from "../recorder";
import {
  fillCells,
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

/* ------------------------------------------------- 1. Valid Parentheses */

export const validParentheses: ProblemDefinition = {
  slug: "valid-parentheses",
  title: "Valid Parentheses",
  difficulty: "Easy",
  pattern: "Stack of unmatched openers",
  tagline:
    "Every opening bracket is pushed. Every closing bracket must match whatever was opened most recently, which is exactly the top of the stack.",
  insight:
    "Nesting means last-opened-first-closed, and that is the definition of a stack. Two failure modes matter: the wrong partner on top, and leftovers at the end.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "One pass; the stack holds at most every opening bracket.",
  ),
  code: [
    "function isValid(s) {",
    "  const pairs = { ')': '(', ']': '[', '}': '{' };",
    "  const stack = [];",
    "  for (const c of s) {",
    "    if (!pairs[c]) { stack.push(c); continue; }",
    "    if (stack.pop() !== pairs[c]) return false;",
    "  }",
    "  return stack.length === 0;",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "s",
      label: "s",
      placeholder: "([]{})",
      presets: [
        { label: "Valid", value: "([]{})" },
        { label: "Wrong partner", value: "(]" },
        { label: "Leftover", value: "([)" },
      ],
    },
  ],
  defaults: { s: "([]{})" },
  generate: ({ s: raw }) => {
    const s = (raw ?? "")
      .replace(/[^()[\]{}]/g, "")
      .slice(0, 20)
      .split("");
    const rec = createRecorder<S>();
    const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    const stack: string[] = [];
    const cells = fillCells(s.length);
    let ops = 0;

    const snap = (i: number, note: string, top?: CellState): S => ({
      rows: [{ values: s, cells: [...cells], pointers: i >= 0 ? { i } : {} }],
      stacks: [
        {
          label: "stack",
          items: stack.map((v, idx) => ({
            value: v,
            state: idx === stack.length - 1 ? (top ?? "inspect") : "default",
          })),
        },
      ],
      counters: { operations: ops },
      notes: [note],
    });

    rec.push(
      "highlight",
      "The stack starts empty. It will hold every bracket that is still waiting to be closed.",
      [3],
      { stack: "" },
      snap(-1, "stack empty"),
    );

    for (let i = 0; i < s.length; i++) {
      const c = s[i]!;
      if (!pairs[c]) {
        stack.push(c);
        ops++;
        cells[i] = "inspect";
        rec.push(
          "insert",
          `"${c}" opens something, so push it and remember it needs closing.`,
          [5],
          { pushed: c, depth: stack.length },
          snap(i, `depth = ${stack.length}`, "success"),
        );
        continue;
      }
      const top = stack[stack.length - 1];
      ops++;
      rec.push(
        "compare",
        `"${c}" closes. The most recent unclosed bracket is ${top ? `"${top}"` : "nothing at all"}.`,
        [6],
        { closing: c, top: top ?? "none" },
        snap(i, `expecting "${pairs[c]}"`, "compare"),
      );
      if (top !== pairs[c]) {
        cells[i] = "error";
        rec.push(
          "complete",
          top
            ? `"${c}" needs "${pairs[c]}" on top, but "${top}" is there. Invalid.`
            : `"${c}" closes something that was never opened. Invalid.`,
          [6],
          { result: "false" },
          {
            ...snap(i, "mismatch", "error"),
            output: "isValid = false",
          },
        );
        return rec.steps;
      }
      stack.pop();
      cells[i] = "done";
      const openIdx = s.lastIndexOf(pairs[c]!, i);
      if (openIdx >= 0 && cells[openIdx] === "inspect") cells[openIdx] = "done";
      rec.push(
        "delete",
        `"${top}" and "${c}" are a matching pair, so the opener is popped.`,
        [6],
        { popped: top, depth: stack.length },
        snap(i, `depth = ${stack.length}`, "success"),
      );
    }

    const ok = stack.length === 0;
    rec.push(
      "complete",
      ok
        ? "Every bracket found its partner and the stack is empty. Valid."
        : `${stack.length} bracket${stack.length === 1 ? "" : "s"} were never closed. Invalid.`,
      [8],
      { result: String(ok) },
      {
        rows: [{ values: s, cells: s.map(() => (ok ? "done" : "error") as CellState) }],
        stacks: [
          { label: "stack", items: stack.map((v) => ({ value: v, state: "error" as CellState })) },
        ],
        counters: { operations: ops },
        output: `isValid = ${ok}`,
      },
    );
    return rec.steps;
  },
};

/* ---------------------------------------------------------- 2. Min Stack */

export const minStack: ProblemDefinition = {
  slug: "min-stack",
  title: "Min Stack",
  difficulty: "Medium",
  pattern: "Parallel stack of running minima",
  tagline:
    "Alongside the real stack, keep a second stack whose top is always the smallest value currently stored. Both move together, so getMin costs nothing.",
  insight:
    "Scanning for the minimum on demand is O(n). Storing the minimum as it was at each push makes popping safe, because history is restored exactly as it was.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(1)",
    "O(1)",
    "O(n)",
    "Every operation touches only the tops of the two stacks.",
  ),
  code: [
    "class MinStack {",
    "  constructor() { this.st = []; this.min = []; }",
    "  push(v) {",
    "    this.st.push(v);",
    "    this.min.push(this.min.length ? Math.min(v, this.top(this.min)) : v);",
    "  }",
    "  pop() { this.st.pop(); this.min.pop(); }",
    "  top() { return this.st.at(-1); }",
    "  getMin() { return this.min.at(-1); }",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "ops",
      label: "operations (push n / pop / getMin)",
      placeholder: "push 5 push 2 push 7 getMin pop getMin",
      presets: [
        { label: "Classic", value: "push 5 push 2 push 7 getMin pop getMin" },
        { label: "Pop the minimum", value: "push 3 push 1 pop getMin" },
        { label: "Descending", value: "push 4 push 3 push 2 getMin" },
      ],
    },
  ],
  defaults: { ops: "push 5 push 2 push 7 getMin pop getMin" },
  generate: ({ ops: raw }) => {
    const tokens = toWords(raw, 20);
    const rec = createRecorder<S>();
    const st: number[] = [];
    const min: number[] = [];
    const log: string[] = [];
    let operations = 0;

    const snap = (note: string, state: CellState = "inspect"): S => ({
      stacks: [
        {
          label: "stack",
          items: st.map((v, i) => ({ value: v, state: i === st.length - 1 ? state : "default" })),
        },
        {
          label: "minimum at each level",
          items: min.map((v, i) => ({
            value: v,
            state: i === min.length - 1 ? "success" : "visited",
          })),
        },
      ],
      counters: { operations, size: st.length },
      notes: [note, st.length ? `getMin() = ${min[min.length - 1]}` : "stack empty"],
      output: log.length ? log.join("   ") : undefined,
    });

    rec.push(
      "highlight",
      "Two stacks side by side: the values, and the smallest value at each depth.",
      [2],
      { size: 0 },
      snap("both empty"),
    );

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]!.toLowerCase();
      if (t === "push") {
        const v = toNum(tokens[i + 1], 0);
        i++;
        operations++;
        st.push(v);
        min.push(min.length ? Math.min(v, min[min.length - 1]!) : v);
        rec.push(
          "insert",
          `push(${v}). The smallest value in the stack is now ${min[min.length - 1]}, so that is stored alongside it.`,
          [4, 5],
          { pushed: v, min: min[min.length - 1] ?? 0 },
          snap(`pushed ${v}`, "success"),
        );
      } else if (t === "pop") {
        operations++;
        if (!st.length) {
          rec.push(
            "highlight",
            "pop() on an empty stack: nothing to remove.",
            [7],
            { size: 0 },
            snap("nothing to pop", "error"),
          );
          continue;
        }
        const v = st.pop()!;
        min.pop();
        rec.push(
          "delete",
          `pop() removes ${v}. Its minimum entry goes too, which restores the minimum as it was before that push.`,
          [7],
          { popped: v, min: min[min.length - 1] ?? 0 },
          snap(`popped ${v}`, "compare"),
        );
      } else if (t === "getmin") {
        operations++;
        const m = min[min.length - 1];
        log.push(`getMin() → ${m ?? "none"}`);
        rec.push(
          "visit",
          m === undefined
            ? "getMin() on an empty stack."
            : `getMin() just reads the top of the minimum stack: ${m}. No scanning needed.`,
          [9],
          { min: m ?? 0 },
          snap("read the top of the minimum stack"),
        );
      } else if (t === "top") {
        operations++;
        const v = st[st.length - 1];
        log.push(`top() → ${v ?? "none"}`);
        rec.push(
          "visit",
          v === undefined ? "top() on an empty stack." : `top() reads ${v}.`,
          [8],
          { top: v ?? 0 },
          snap("read the top value"),
        );
      }
    }

    rec.push(
      "complete",
      "Every operation ran in constant time, including getMin.",
      [10],
      { size: st.length },
      {
        ...snap("done", "done"),
        output: log.join("   ") || "no reads requested",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------ 3. Evaluate Reverse Polish Notation */

const evalRPN: ProblemDefinition = {
  slug: "evaluate-reverse-polish-notation",
  title: "Evaluate Reverse Polish Notation",
  difficulty: "Medium",
  pattern: "Stack of pending operands",
  tagline:
    "Numbers are pushed. An operator pops the two most recent numbers, applies itself, and pushes the result back.",
  insight:
    "Postfix needs no brackets because the order is already fixed by the layout. Order matters when popping: the first value popped is the right operand.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "One pass; the stack holds at most every number in the expression.",
  ),
  code: [
    "function evalRPN(tokens) {",
    "  const st = [];",
    "  for (const t of tokens) {",
    "    if (!isOp(t)) { st.push(Number(t)); continue; }",
    "    const b = st.pop(), a = st.pop();",
    "    st.push(apply(t, a, b));",
    "  }",
    "  return st[0];",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "tokens",
      label: "tokens",
      placeholder: "2 1 + 3 *",
      presets: [
        { label: "Classic", value: "2 1 + 3 *" },
        { label: "With division", value: "4 13 5 / +" },
        { label: "Longer", value: "10 6 9 3 + -11 * / * 17 + 5 +" },
      ],
    },
  ],
  defaults: { tokens: "2 1 + 3 *" },
  generate: ({ tokens: raw }) => {
    const tokens = toWords(raw, 18);
    const rec = createRecorder<S>();
    const st: number[] = [];
    const isOp = (t: string) => ["+", "-", "*", "/"].includes(t);
    const cells = fillCells(tokens.length);
    let operations = 0;

    const snap = (i: number, note: string, top: CellState = "inspect"): S => ({
      rows: [{ label: "tokens", values: tokens, cells: [...cells], pointers: i >= 0 ? { i } : {} }],
      stacks: [
        {
          label: "operands",
          items: st.map((v, idx) => ({ value: v, state: idx === st.length - 1 ? top : "default" })),
        },
      ],
      counters: { operations },
      notes: [note],
    });

    rec.push(
      "highlight",
      "Postfix notation puts the operator after its two operands, so a single stack is all we need.",
      [2],
      {},
      snap(-1, "stack empty"),
    );

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]!;
      if (!isOp(t)) {
        const v = Number(t);
        if (!Number.isFinite(v)) continue;
        st.push(v);
        cells[i] = "visited";
        operations++;
        rec.push(
          "insert",
          `${t} is a number, so it waits on the stack until an operator asks for it.`,
          [4],
          { pushed: v },
          snap(i, `pushed ${v}`, "success"),
        );
        continue;
      }
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined) {
        cells[i] = "error";
        rec.push(
          "complete",
          `"${t}" needs two operands but the stack does not have them. The expression is malformed.`,
          [5],
          { result: "invalid" },
          { ...snap(i, "not enough operands", "error"), output: "invalid expression" },
        );
        return rec.steps;
      }
      operations++;
      rec.push(
        "compare",
        `"${t}" pops the two most recent numbers: ${a} and ${b}. The first popped, ${b}, is the right-hand operand.`,
        [5],
        { a, b, op: t },
        snap(i, `${a} ${t} ${b}`, "compare"),
      );
      const r = t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b);
      st.push(r);
      cells[i] = "done";
      rec.push(
        "update",
        `${a} ${t} ${b} = ${r}${t === "/" ? " (integer division truncates towards zero)" : ""}. Push the result back.`,
        [6],
        { result: r },
        snap(i, `pushed ${r}`, "success"),
      );
    }

    const answer = st[st.length - 1] ?? 0;
    rec.push(
      "complete",
      `The single value left on the stack is the answer: ${answer}.`,
      [8],
      { result: answer },
      {
        rows: [{ label: "tokens", values: tokens, cells: tokens.map(() => "done" as CellState) }],
        stacks: [
          { label: "operands", items: st.map((v) => ({ value: v, state: "done" as CellState })) },
        ],
        counters: { operations },
        output: `evalRPN = ${answer}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------- 4. Daily Temperatures */

export const dailyTemperatures: ProblemDefinition = {
  slug: "daily-temperatures",
  title: "Daily Temperatures",
  difficulty: "Medium",
  pattern: "Monotonic decreasing stack (next greater element)",
  tagline:
    "Keep a stack of days still waiting for a warmer one. A new warmer day resolves every waiting day it beats, all at once.",
  insight:
    "This is the next-greater-element template. Each day is pushed once and popped once, so the nested-looking loop is still linear overall.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "Every day enters and leaves the stack exactly once.",
  ),
  code: [
    "function dailyTemperatures(t) {",
    "  const res = new Array(t.length).fill(0);",
    "  const st = [];",
    "  for (let i = 0; i < t.length; i++) {",
    "    while (st.length && t[st.at(-1)] < t[i]) {",
    "      const j = st.pop();",
    "      res[j] = i - j;",
    "    }",
    "    st.push(i);",
    "  }",
    "  return res;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "temps",
      label: "temperatures",
      placeholder: "73 74 75 71 69 72 76 73",
      presets: [
        { label: "Classic", value: "73 74 75 71 69 72 76 73" },
        { label: "Rising", value: "30 40 50 60" },
        { label: "Falling", value: "60 50 40 30" },
      ],
    },
  ],
  defaults: { temps: "73 74 75 71 69 72 76 73" },
  generate: ({ temps: raw }) => {
    const t = toNums(raw, 14);
    const rec = createRecorder<S>();
    const res = t.map(() => 0);
    const st: number[] = [];
    let operations = 0;

    const snap = (i: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          label: "temperatures",
          values: t,
          cells: t.map(
            (_, idx) =>
              marks[idx] ??
              (st.includes(idx)
                ? "inspect"
                : res[idx]! > 0
                  ? "done"
                  : idx > i
                    ? "default"
                    : "visited"),
          ),
          pointers: i >= 0 ? { i } : {},
          mode: "bars",
        },
        {
          label: "days to wait",
          values: res,
          cells: res.map((v) => (v > 0 ? ("success" as CellState) : ("default" as CellState))),
          showIndex: false,
        },
      ],
      stacks: [
        {
          label: "waiting days (index@temp)",
          orientation: "horizontal",
          items: st.map((idx) => ({ value: `${idx}@${t[idx]}`, state: "inspect" as CellState })),
        },
      ],
      counters: { operations, waiting: st.length },
      notes: [note],
    });

    rec.push(
      "highlight",
      "The stack holds days that have not yet seen a warmer day.",
      [3],
      {},
      snap(-1, {}, "stack empty"),
    );

    for (let i = 0; i < t.length; i++) {
      operations++;
      rec.push(
        "visit",
        `Day ${i} is ${t[i]}°.`,
        [4],
        { i, temp: t[i] ?? 0 },
        snap(i, { [i]: "compare" }, `today = ${t[i]}°`),
      );

      while (st.length && t[st[st.length - 1]!]! < t[i]!) {
        const j = st.pop()!;
        res[j] = i - j;
        rec.push(
          "update",
          `Day ${j} was waiting at ${t[j]}° and today is warmer, so its answer is ${i - j} day${i - j === 1 ? "" : "s"}.`,
          [5, 6, 7],
          { resolved: j, wait: i - j },
          snap(i, { [j]: "success", [i]: "compare" }, `day ${j} resolved`),
        );
      }

      st.push(i);
      rec.push(
        "insert",
        `Day ${i} now waits for something warmer.`,
        [9],
        { waiting: st.length },
        snap(i, { [i]: "inspect" }, "pushed"),
      );
    }

    rec.push(
      "complete",
      st.length
        ? `${st.length} day${st.length === 1 ? "" : "s"} never saw anything warmer, so they stay at 0.`
        : "Every day found a warmer day.",
      [11],
      { result: res.join(",") },
      {
        rows: [
          {
            label: "temperatures",
            values: t,
            cells: t.map((_, i) =>
              res[i]! > 0 ? ("done" as CellState) : ("eliminated" as CellState),
            ),
            mode: "bars",
          },
          {
            label: "days to wait",
            values: res,
            cells: res.map(() => "done" as CellState),
            showIndex: false,
          },
        ],
        counters: { operations },
        output: `answer = [${res.join(", ")}]`,
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------------------------- 5. Car Fleet */

const carFleet: ProblemDefinition = {
  slug: "car-fleet",
  title: "Car Fleet",
  difficulty: "Medium",
  pattern: "Sort by position, then a stack of arrival times",
  tagline:
    "Sort cars from closest to the target backwards. A car that would arrive no later than the fleet ahead of it gets stuck behind it and joins that fleet.",
  insight:
    "Work backwards from the target so each car only compares with the fleet directly ahead. The stack's size is the number of fleets, and its top is the slowest arrival still ahead.",
  language: "JavaScript",
  complexity: O(
    "O(n log n)",
    "O(n log n)",
    "O(n log n)",
    "O(n)",
    "Sorting dominates; the sweep itself is one linear pass.",
  ),
  code: [
    "function carFleet(target, position, speed) {",
    "  const cars = zip(position, speed).sort((a, b) => b[0] - a[0]);",
    "  const st = [];",
    "  for (const [p, s] of cars) {",
    "    const time = (target - p) / s;",
    "    if (!st.length || time > st.at(-1)) st.push(time);",
    "  }",
    "  return st.length;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "position",
      label: "position",
      placeholder: "10 8 0 5 3",
      presets: [
        { label: "Classic", value: "10 8 0 5 3" },
        { label: "Two cars", value: "0 4" },
        { label: "One fleet", value: "0 2 4" },
      ],
    },
    {
      kind: "numbers",
      key: "speed",
      label: "speed",
      placeholder: "2 4 1 1 3",
      presets: [
        { label: "Classic", value: "2 4 1 1 3" },
        { label: "Two cars", value: "2 1" },
        { label: "One fleet", value: "3 2 1" },
      ],
    },
    { kind: "number", key: "target", label: "target", min: 1, max: 100 },
  ],
  defaults: { position: "10 8 0 5 3", speed: "2 4 1 1 3", target: "12" },
  generate: ({ position: pRaw, speed: sRaw, target: tRaw }) => {
    const pos = toNums(pRaw, 10);
    const sp = toNums(sRaw, 10);
    const target = Math.max(1, toNum(tRaw, 12));
    const rec = createRecorder<S>();
    const cars = pos
      .map((p, i) => ({ p, s: Math.max(1, sp[i] ?? 1) }))
      .filter((c) => c.p < target)
      .sort((a, b) => b.p - a.p);
    const times: number[] = [];
    const fleetOf: (number | null)[] = cars.map(() => null);
    let comparisons = 0;

    const round = (n: number) => Math.round(n * 100) / 100;

    const snap = (i: number, marks: Record<number, CellState>, note: string): S => ({
      rows: [
        {
          label: "position (closest to target first)",
          values: cars.map((c) => c.p),
          cells: cars.map(
            (_, idx) => marks[idx] ?? (idx < i ? "visited" : idx > i ? "default" : "inspect"),
          ),
          pointers: i >= 0 ? { car: i } : {},
        },
        {
          label: "speed",
          values: cars.map((c) => c.s),
          cells: cars.map(() => "default" as CellState),
          showIndex: false,
        },
        {
          label: "fleet number",
          values: fleetOf.map((f) => (f === null ? "—" : f + 1)),
          cells: fleetOf.map((f) =>
            f === null ? ("default" as CellState) : ("success" as CellState),
          ),
          showIndex: false,
        },
      ],
      stacks: [
        {
          label: "arrival times of the fleets ahead",
          orientation: "horizontal",
          items: times.map((t, idx) => ({
            value: round(t),
            state: idx === times.length - 1 ? ("inspect" as CellState) : ("visited" as CellState),
          })),
        },
      ],
      counters: { comparisons, fleets: times.length },
      notes: [`target = ${target}`, note],
    });

    rec.push(
      "highlight",
      `Sort the cars so the one closest to ${target} is handled first. A car can only ever be blocked by cars ahead of it.`,
      [2],
      { cars: cars.length },
      snap(-1, {}, "sorted by position"),
    );

    for (let i = 0; i < cars.length; i++) {
      const c = cars[i]!;
      const time = (target - c.p) / c.s;
      comparisons++;
      rec.push(
        "compare",
        `Car at ${c.p} moving at ${c.s} would reach the target in ${round(time)} on its own.`,
        [5],
        { position: c.p, speed: c.s, time: round(time) },
        snap(i, { [i]: "compare" }, `time = ${round(time)}`),
      );

      if (!times.length || time > times[times.length - 1]!) {
        times.push(time);
        fleetOf[i] = times.length - 1;
        rec.push(
          "insert",
          `That is later than the fleet ahead, so this car never catches up and starts fleet ${times.length}.`,
          [6],
          { fleets: times.length },
          snap(i, { [i]: "success" }, `new fleet ${times.length}`),
        );
      } else {
        fleetOf[i] = times.length - 1;
        rec.push(
          "update",
          `It would arrive at ${round(time)}, no later than the fleet ahead (${round(times[times.length - 1]!)}), so it catches up and is stuck in that fleet.`,
          [6],
          { fleets: times.length },
          snap(i, { [i]: "visited" }, `joins fleet ${times.length}`),
        );
      }
    }

    rec.push(
      "complete",
      `${times.length} fleet${times.length === 1 ? "" : "s"} arrive at the target.`,
      [8],
      { result: times.length },
      {
        ...snap(
          cars.length,
          Object.fromEntries(cars.map((_, i) => [i, "done" as CellState])),
          "done",
        ),
        output: `carFleet = ${times.length}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------- 6. Largest Rectangle in Histogram */

const largestRectangle: ProblemDefinition = {
  slug: "largest-rectangle-in-histogram",
  title: "Largest Rectangle in Histogram",
  difficulty: "Hard",
  pattern: "Monotonic increasing stack of bar starts",
  tagline:
    "Keep bars of increasing height on a stack. When a shorter bar arrives, every taller bar's rectangle has just ended, so measure it as it is popped.",
  insight:
    "A bar's rectangle stretches until something shorter appears on either side. The stack gives you the left boundary for free: it is whatever sits below the popped bar.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(n)", "Every bar is pushed once and popped once."),
  code: [
    "function largestRectangleArea(h) {",
    "  const st = []; let best = 0;",
    "  for (let i = 0; i <= h.length; i++) {",
    "    const cur = i === h.length ? 0 : h[i];",
    "    while (st.length && h[st.at(-1)] >= cur) {",
    "      const top = st.pop();",
    "      const left = st.length ? st.at(-1) + 1 : 0;",
    "      best = Math.max(best, h[top] * (i - left));",
    "    }",
    "    st.push(i);",
    "  }",
    "  return best;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "heights",
      label: "heights",
      placeholder: "2 1 5 6 2 3",
      presets: [
        { label: "Classic", value: "2 1 5 6 2 3" },
        { label: "Flat", value: "4 4 4 4" },
        { label: "Valley", value: "6 2 5 4 5 1 6" },
      ],
    },
  ],
  defaults: { heights: "2 1 5 6 2 3" },
  generate: ({ heights: raw }) => {
    const h = toNums(raw, 14).map((n) => Math.max(0, n));
    const rec = createRecorder<S>();
    const st: number[] = [];
    let best = 0;
    let bestSpan: [number, number] | null = null;
    let operations = 0;

    const snap = (
      i: number,
      marks: Record<number, CellState>,
      note: string,
      win?: { start: number; end: number; label: string },
    ): S => ({
      rows: [
        {
          label: "heights",
          values: h,
          cells: h.map(
            (_, idx) =>
              marks[idx] ?? (st.includes(idx) ? "inspect" : idx < i ? "visited" : "default"),
          ),
          pointers: i >= 0 && i < h.length ? { i } : {},
          mode: "bars",
          window: win ?? null,
        },
      ],
      stacks: [
        {
          label: "increasing bars (index@height)",
          orientation: "horizontal",
          items: st.map((idx) => ({ value: `${idx}@${h[idx]}`, state: "inspect" as CellState })),
        },
      ],
      counters: { operations, best },
      notes: [note, bestSpan ? `best rectangle spans ${bestSpan[0]}..${bestSpan[1]}` : "best = 0"],
    });

    rec.push(
      "highlight",
      "The stack keeps bars in increasing height order. Each one is waiting to find out how far right it can stretch.",
      [2],
      { best },
      snap(-1, {}, "stack empty"),
    );

    for (let i = 0; i <= h.length; i++) {
      const cur = i === h.length ? 0 : h[i]!;
      operations++;
      if (i < h.length) {
        rec.push(
          "visit",
          `Bar ${i} has height ${cur}.`,
          [3, 4],
          { i, height: cur },
          snap(i, { [i]: "compare" }, `incoming height ${cur}`),
        );
      } else {
        rec.push(
          "visit",
          "The histogram ends. Treat that as a bar of height 0 so everything still on the stack gets measured.",
          [4],
          { i },
          snap(i, {}, "flushing the stack"),
        );
      }

      while (st.length && h[st[st.length - 1]!]! >= cur) {
        const top = st.pop()!;
        const left = st.length ? st[st.length - 1]! + 1 : 0;
        const width = i - left;
        const area = h[top]! * width;
        if (area > best) {
          best = area;
          bestSpan = [left, i - 1];
        }
        rec.push(
          "update",
          `Bar ${top} (height ${h[top]}) can stretch from ${left} to ${i - 1}, so its rectangle is ${h[top]} × ${width} = ${area}.`,
          [5, 6, 7, 8],
          { height: h[top] ?? 0, width, area, best },
          snap(i, { [top]: area === best ? "success" : "compare" }, `area = ${area}`, {
            start: left,
            end: Math.max(left, i - 1),
            label: `${h[top]} × ${width} = ${area}`,
          }),
        );
      }

      st.push(i);
      if (i < h.length) {
        rec.push(
          "insert",
          `Bar ${i} joins the stack, waiting for something shorter.`,
          [10],
          { stack: st.length },
          snap(i, { [i]: "inspect" }, "pushed"),
        );
      }
    }

    rec.push(
      "complete",
      `The largest rectangle has area ${best}.`,
      [12],
      { result: best },
      {
        rows: [
          {
            label: "heights",
            values: h,
            cells: h.map((_, i) =>
              bestSpan && i >= bestSpan[0] && i <= bestSpan[1]
                ? ("done" as CellState)
                : ("visited" as CellState),
            ),
            mode: "bars",
            window: bestSpan
              ? { start: bestSpan[0], end: bestSpan[1], label: `largest rectangle = ${best}` }
              : null,
          },
        ],
        counters: { operations, best },
        output: `largestRectangleArea = ${best}`,
      },
    );
    return rec.steps;
  },
};

export const STACK_PROBLEMS: ProblemDefinition[] = [
  validParentheses,
  minStack,
  evalRPN,
  dailyTemperatures,
  carFleet,
  largestRectangle,
];
