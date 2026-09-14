import { createRecorder } from "../recorder";
import type { CallTreeNode, FrameVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface RecursionInput {
  n: number;
  values: number[];
  text: string;
}

type Def = AlgorithmDefinition<FrameVizState, RecursionInput>;

interface Frame {
  id: number;
  label: string;
  state: CellState;
  result?: string | undefined;
}

/**
 * Shared bookkeeping for every recursion example: one call stack, one growing
 * call tree, and counters students can compare between examples.
 */
function tracer() {
  let frames: Frame[] = [];
  let tree: CallTreeNode[] = [];
  let calls = 0;
  let maxDepth = 0;
  let cacheHits = 0;
  let nextId = 0;

  return {
    get calls() {
      return calls;
    },
    get maxDepth() {
      return maxDepth;
    },
    get cacheHits() {
      return cacheHits;
    },
    hit() {
      cacheHits += 1;
    },
    /** Open a call: pushes a frame and adds a tree node under `parentId`. */
    open(label: string, parentId: string | null, note?: string) {
      const id = `c${nextId++}`;
      calls += 1;
      frames = [
        ...frames.map((f) => ({ ...f, state: "visited" as CellState })),
        { id: nextId, label, state: "inspect" },
      ];
      maxDepth = Math.max(maxDepth, frames.length);
      tree = [...tree, { id, parentId, label, state: "inspect", note }];
      return id;
    },
    /** Close the top call with its return value. */
    close(id: string, result: string, state: CellState = "success") {
      frames = frames.slice(0, -1).map((f, i, arr) => ({
        ...f,
        state: i === arr.length - 1 ? ("inspect" as CellState) : ("visited" as CellState),
      }));
      tree = tree.map((n) => (n.id === id ? { ...n, state, result } : n));
      return result;
    },
    /** Mark the top frame as returning a value while it is still on the stack. */
    returning(result: string) {
      frames = frames.map((f, i, arr) =>
        i === arr.length - 1 ? { ...f, state: "success" as CellState, result } : f,
      );
    },
    snapshot(extra: Partial<FrameVizState> = {}): FrameVizState {
      return {
        frames: frames.map((f) => ({ ...f })),
        treeNodes: tree.map((n) => ({ ...n })),
        ...extra,
        counters: { calls, "stack depth": frames.length, "max depth": maxDepth, ...extra.counters },
      };
    },
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));

/* ------------------------------------------------------------------ factorial */

export const factorialRecursion: Def = {
  slug: "factorial",
  title: "Factorial",
  tagline:
    "The simplest useful recursion: one branch per call, so the tree is a straight line. Watch the stack grow all the way down to the base case before a single multiplication happens.",
  language: "JavaScript",
  code: [
    "function factorial(n) {",
    "  if (n <= 1) return 1;        // base case",
    "  const smaller = factorial(n - 1);",
    "  return n * smaller;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "One call per value from n down to 1, so n calls in total. The space is the call stack: all n frames are alive at the same time, which is why a huge n overflows the stack even though the work is tiny.",
  },
  generate: ({ n }) => {
    const r = createRecorder<FrameVizState>();
    const t = tracer();
    const target = clamp(n, 1, 9);

    const go = (k: number, parentId: string | null): number => {
      const id = t.open(`factorial(${k})`, parentId);
      r.push(
        "visit",
        `factorial(${k}) is called and a new frame goes on the stack. Nothing is computed yet: the function first has to find out what factorial(${k - 1}) is.`,
        [1],
        { n: k, depth: t.maxDepth },
        t.snapshot(),
      );

      if (k <= 1) {
        r.push(
          "highlight",
          `n is ${k}, so the base case fires. This is the only place recursion stops; without it the stack would grow forever.`,
          [2],
          { n: k, returns: 1 },
          t.snapshot(),
        );
        t.returning("1");
        r.push(
          "complete",
          `factorial(${k}) returns 1 and its frame is about to disappear. Now the unwinding begins.`,
          [2],
          { n: k, returns: 1 },
          t.snapshot(),
        );
        t.close(id, "1");
        return 1;
      }

      r.push(
        "highlight",
        `${k} is bigger than 1, so we need factorial(${k - 1}) before we can multiply. The current frame pauses here, holding n = ${k}.`,
        [3],
        { n: k, waitingFor: `factorial(${k - 1})` },
        t.snapshot(),
      );
      const smaller = go(k - 1, id);
      const result = k * smaller;
      t.returning(String(result));
      r.push(
        "update",
        `factorial(${k - 1}) came back as ${smaller}. The paused frame wakes up, multiplies ${k} × ${smaller} = ${result} and returns.`,
        [4],
        { n: k, smaller, returns: result },
        t.snapshot(),
      );
      t.close(id, String(result));
      return result;
    };

    const answer = go(target, null);
    r.push(
      "complete",
      `factorial(${target}) = ${answer}. Every frame has returned and the stack is empty again. The tree is a single line because each call makes exactly one call.`,
      [4],
      { result: answer, calls: t.calls, maxDepth: t.maxDepth },
      t.snapshot({ output: `factorial(${target}) = ${answer}` }),
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------- fibonacci naive */

export const fibonacciNaive: Def = {
  slug: "fibonacci-naive",
  title: "Fibonacci (naive)",
  tagline:
    "Two recursive calls per step, and the same sub-problems solved again and again. The repeated calls are marked: that duplication is the whole reason dynamic programming exists.",
  language: "JavaScript",
  code: [
    "function fib(n) {",
    "  if (n <= 1) return n;        // base case",
    "  const a = fib(n - 1);",
    "  const b = fib(n - 2);",
    "  return a + b;",
    "}",
  ],
  complexity: {
    timeBest: "O(2ⁿ)",
    timeAverage: "O(2ⁿ)",
    timeWorst: "O(2ⁿ)",
    space: "O(n)",
    plainEnglish:
      "Each call spawns two more, so the number of calls roughly doubles with every extra n (exponential). The space is only O(n) because just one path from the root is on the stack at a time.",
  },
  generate: ({ n }) => {
    const r = createRecorder<FrameVizState>();
    const t = tracer();
    const target = clamp(n, 2, 6);
    const seen = new Map<number, number>();

    const go = (k: number, parentId: string | null): number => {
      const before = seen.get(k) ?? 0;
      seen.set(k, before + 1);
      const repeat = before > 0;
      const id = t.open(`fib(${k})`, parentId, repeat ? "repeat" : undefined);
      r.push(
        "visit",
        repeat
          ? `fib(${k}) is called again (repeat number ${before + 1}). The answer has not changed, but nothing remembers it, so the whole subtree is recomputed from scratch.`
          : `fib(${k}) is called for the first time. A new frame goes on the stack.`,
        [1],
        { n: k, repeatedCall: repeat },
        t.snapshot({
          counters: {
            "repeat calls": [...seen.values()].reduce((s, c) => s + Math.max(0, c - 1), 0),
          },
        }),
      );

      if (k <= 1) {
        t.returning(String(k));
        r.push(
          "complete",
          `fib(${k}) is a base case and returns ${k} immediately. Every leaf of this tree is one of these.`,
          [2],
          { n: k, returns: k },
          t.snapshot(),
        );
        t.close(id, String(k), repeat ? "visited" : "success");
        return k;
      }

      r.push(
        "highlight",
        `To answer fib(${k}) we first need fib(${k - 1}). The current frame pauses.`,
        [3],
        { n: k, waitingFor: `fib(${k - 1})` },
        t.snapshot(),
      );
      const a = go(k - 1, id);
      r.push(
        "highlight",
        `fib(${k - 1}) = ${a}. Now the same frame asks for fib(${k - 2}), a second branch from the same call.`,
        [4],
        { n: k, a, waitingFor: `fib(${k - 2})` },
        t.snapshot(),
      );
      const b = go(k - 2, id);
      const result = a + b;
      t.returning(String(result));
      r.push(
        "update",
        `Both branches are back: ${a} + ${b} = ${result}, so fib(${k}) returns ${result}.`,
        [5],
        { n: k, a, b, returns: result },
        t.snapshot(),
      );
      t.close(id, String(result), repeat ? "visited" : "success");
      return result;
    };

    const answer = go(target, null);
    const repeats = [...seen.values()].reduce((s, c) => s + Math.max(0, c - 1), 0);
    r.push(
      "complete",
      `fib(${target}) = ${answer} after ${t.calls} calls, ${repeats} of which were repeats of work already done. Increase n by one and the call count almost doubles: that is the exponential blow-up memoization removes.`,
      [5],
      { result: answer, calls: t.calls, repeatCalls: repeats },
      t.snapshot({ output: `fib(${target}) = ${answer}` }),
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- fibonacci memo */

export const fibonacciMemo: Def = {
  slug: "fibonacci-memo",
  title: "Fibonacci (memoized)",
  tagline:
    "The same function with one cache lookup added. Each value is computed once; every later request is answered from the memo, and the exponential tree collapses into a line.",
  language: "JavaScript",
  code: [
    "function fib(n, memo = {}) {",
    "  if (n <= 1) return n;",
    "  if (n in memo) return memo[n];   // cache hit",
    "  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);",
    "  return memo[n];",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "Each value from 0 to n is computed exactly once and stored, so the work is linear. The space is the memo plus the call stack, both O(n), trading memory for an enormous amount of time.",
  },
  generate: ({ n }) => {
    const r = createRecorder<FrameVizState>();
    const t = tracer();
    const target = clamp(n, 2, 12);
    const memo: Record<string, number> = {};

    const snap = () =>
      t.snapshot({ memo: { ...memo }, memoLabel: "memo", counters: { "cache hits": t.cacheHits } });

    const go = (k: number, parentId: string | null): number => {
      const cached = memo[k] !== undefined;
      const id = t.open(`fib(${k})`, parentId, cached ? "memo" : undefined);
      r.push("visit", `fib(${k}) is called.`, [1], { n: k }, snap());

      if (k <= 1) {
        t.returning(String(k));
        r.push("complete", `Base case: fib(${k}) returns ${k}.`, [2], { n: k, returns: k }, snap());
        t.close(id, String(k));
        return k;
      }

      if (cached) {
        t.hit();
        const value = memo[k]!;
        t.returning(String(value));
        r.push(
          "highlight",
          `fib(${k}) is already in the memo, so it returns ${value} straight away. No subtree is explored at all: this single line is what turns exponential into linear.`,
          [3],
          { n: k, cached: value, cacheHits: t.cacheHits },
          snap(),
        );
        t.close(id, String(value), "visited");
        return value;
      }

      r.push(
        "highlight",
        `fib(${k}) is not in the memo yet, so it has to be computed from fib(${k - 1}) and fib(${k - 2}).`,
        [4],
        { n: k, memoSize: Object.keys(memo).length },
        snap(),
      );
      const a = go(k - 1, id);
      const b = go(k - 2, id);
      const result = a + b;
      memo[k] = result;
      t.returning(String(result));
      r.push(
        "update",
        `${a} + ${b} = ${result} is stored as memo[${k}]. Any later call for fib(${k}) is now free.`,
        [4],
        { n: k, a, b, stored: result },
        snap(),
      );
      t.close(id, String(result));
      return result;
    };

    const answer = go(target, null);
    r.push(
      "complete",
      `fib(${target}) = ${answer} in ${t.calls} calls with ${t.cacheHits} cache hits. Compare that call count with the naive version for the same n: same logic, one extra lookup.`,
      [5],
      { result: answer, calls: t.calls, cacheHits: t.cacheHits },
      snap(),
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------------- array sum */

export const sumRecursion: Def = {
  slug: "sum-array",
  title: "Sum of an array",
  tagline:
    'Recursion on a shrinking index instead of a number: solve the rest of the array first, then add the current value. The classic "trust the recursive call" shape.',
  language: "JavaScript",
  code: [
    "function sum(arr, i = 0) {",
    "  if (i === arr.length) return 0;   // empty tail",
    "  const rest = sum(arr, i + 1);",
    "  return arr[i] + rest;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "Each element is added exactly once, so the time is linear. The recursion stack also holds one frame per element, which is why a loop is preferred in practice for very large arrays.",
  },
  generate: ({ values }) => {
    const r = createRecorder<FrameVizState>();
    const t = tracer();
    const arr = values.slice(0, 8);

    const go = (i: number, parentId: string | null): number => {
      const id = t.open(`sum(i=${i})`, parentId);
      r.push(
        "visit",
        `sum is called with i = ${i}. The remaining part of the array is [${arr.slice(i).join(", ")}].`,
        [1],
        { i, remaining: arr.slice(i).join(" ") },
        t.snapshot(),
      );

      if (i === arr.length) {
        t.returning("0");
        r.push(
          "complete",
          `i has reached the end of the array, so there is nothing left to add: return 0. This is the base case that makes the whole chain finish.`,
          [2],
          { i, returns: 0 },
          t.snapshot(),
        );
        t.close(id, "0");
        return 0;
      }

      r.push(
        "highlight",
        `Before adding arr[${i}] = ${arr[i]}, this frame asks for the sum of everything after it. It simply trusts that call to be correct.`,
        [3],
        { i, "arr[i]": arr[i] ?? null },
        t.snapshot(),
      );
      const rest = go(i + 1, id);
      const result = (arr[i] ?? 0) + rest;
      t.returning(String(result));
      r.push(
        "update",
        `The rest of the array summed to ${rest}. Adding arr[${i}] = ${arr[i]} gives ${result}.`,
        [4],
        { i, "arr[i]": arr[i] ?? null, rest, returns: result },
        t.snapshot(),
      );
      t.close(id, String(result));
      return result;
    };

    const answer = go(0, null);
    r.push(
      "complete",
      `The total is ${answer}. Notice the additions all happened on the way back up, after the deepest call returned.`,
      [4],
      { result: answer, calls: t.calls },
      t.snapshot({ output: `sum = ${answer}` }),
    );
    return r.steps;
  },
};

/* --------------------------------------------------------------- tower of hanoi */

export const hanoiRecursion: Def = {
  slug: "tower-of-hanoi",
  title: "Tower of Hanoi",
  tagline:
    "Two recursive calls with a single move between them. The tree shows the shape of the solution, and the move list shows why n discs always need 2ⁿ − 1 moves.",
  language: "JavaScript",
  code: [
    "function hanoi(n, from, to, via, moves = []) {",
    "  if (n === 0) return moves;        // nothing to move",
    "  hanoi(n - 1, from, via, to, moves);",
    "  moves.push(`${from} → ${to}`);    // move the big disc",
    "  hanoi(n - 1, via, to, from, moves);",
    "  return moves;",
    "}",
  ],
  complexity: {
    timeBest: "O(2ⁿ)",
    timeAverage: "O(2ⁿ)",
    timeWorst: "O(2ⁿ)",
    space: "O(n)",
    plainEnglish:
      "Every call makes two calls and one move, so the number of moves is 2ⁿ − 1: unavoidable, not a weakness of the algorithm. The stack only ever holds n frames.",
  },
  generate: ({ n }) => {
    const r = createRecorder<FrameVizState>();
    const t = tracer();
    const discs = clamp(n, 1, 4);
    const moves: string[] = [];

    const snap = () => t.snapshot({ moves: [...moves], movesLabel: "moves" });

    const go = (
      k: number,
      from: string,
      to: string,
      via: string,
      parentId: string | null,
    ): void => {
      const id = t.open(`hanoi(${k}, ${from}→${to})`, parentId);
      r.push(
        "visit",
        `hanoi(${k}, ${from} → ${to}) is called, using ${via} as the spare peg.`,
        [1],
        { n: k, from, to, via },
        snap(),
      );

      if (k === 0) {
        t.returning("done");
        r.push(
          "complete",
          `There are no discs left to move, so this call returns immediately.`,
          [2],
          { n: k },
          snap(),
        );
        t.close(id, "—");
        return;
      }

      r.push(
        "highlight",
        `To move ${k} discs from ${from} to ${to}, first get the top ${k - 1} discs out of the way: move them from ${from} to ${via}.`,
        [3],
        { n: k, step: `${k - 1} discs ${from} → ${via}` },
        snap(),
      );
      go(k - 1, from, via, to, id);

      moves.push(`disc ${k}: ${from} → ${to}`);
      r.push(
        "update",
        `With the smaller discs parked on ${via}, disc ${k} moves ${from} → ${to}. That is move number ${moves.length}.`,
        [4],
        { moved: k, from, to, totalMoves: moves.length },
        snap(),
      );

      r.push(
        "highlight",
        `Finally bring the ${k - 1} discs from ${via} on top of disc ${k} on ${to}.`,
        [5],
        { n: k, step: `${k - 1} discs ${via} → ${to}` },
        snap(),
      );
      go(k - 1, via, to, from, id);

      t.returning(`${moves.length} moves`);
      r.push(
        "complete",
        `hanoi(${k}, ${from} → ${to}) is finished; ${moves.length} moves have been recorded so far.`,
        [6],
        { n: k, totalMoves: moves.length },
        snap(),
      );
      t.close(id, `${moves.length}`);
    };

    go(discs, "A", "C", "B", null);
    r.push(
      "complete",
      `${discs} discs solved in ${moves.length} moves, which is exactly 2^${discs} − 1. Each extra disc doubles the work plus one.`,
      [6],
      { discs, moves: moves.length, calls: t.calls },
      snap(),
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------- reverse a string */

export const reverseStringRecursion: Def = {
  slug: "reverse-string",
  title: "Reverse a string",
  tagline:
    "A gentle first recursion: reverse everything after the first character, then stick that character on the end. The answer is assembled entirely on the way back up.",
  language: "JavaScript",
  code: [
    "function reverse(s) {",
    "  if (s.length <= 1) return s;   // already reversed",
    "  const rest = reverse(s.slice(1));",
    "  return rest + s[0];",
    "}",
  ],
  complexity: {
    timeBest: "O(n²)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(n)",
    plainEnglish:
      "There are n calls, but each one slices and joins strings of up to n characters, so the total work is n². A two-pointer loop reverses in O(n); this version is for understanding recursion, not for production.",
  },
  generate: ({ text }) => {
    const r = createRecorder<FrameVizState>();
    const t = tracer();
    const word = (text || "recursion").slice(0, 8);

    const go = (s: string, parentId: string | null): string => {
      const id = t.open(`reverse("${s}")`, parentId);
      r.push(
        "visit",
        `reverse("${s}") is called. It only ever looks at its own first character; the rest is somebody else's problem.`,
        [1],
        { s, length: s.length },
        t.snapshot(),
      );

      if (s.length <= 1) {
        t.returning(`"${s}"`);
        r.push(
          "complete",
          `"${s}" is ${s.length === 0 ? "empty" : "a single character"}, so it is already reversed and returns as it is.`,
          [2],
          { s, returns: s },
          t.snapshot(),
        );
        t.close(id, `"${s}"`);
        return s;
      }

      r.push(
        "highlight",
        `Hold on to '${s[0]}' and ask for the reverse of "${s.slice(1)}".`,
        [3],
        { s, first: s[0] ?? "", tail: s.slice(1) },
        t.snapshot(),
      );
      const rest = go(s.slice(1), id);
      const result = rest + s[0];
      t.returning(`"${result}"`);
      r.push(
        "update",
        `The tail came back as "${rest}". Appending '${s[0]}' gives "${result}".`,
        [4],
        { s, rest, returns: result },
        t.snapshot(),
      );
      t.close(id, `"${result}"`);
      return result;
    };

    const answer = go(word, null);
    r.push(
      "complete",
      `"${word}" reversed is "${answer}". Every character was appended during the unwinding, deepest call first.`,
      [4],
      { input: word, result: answer, calls: t.calls },
      t.snapshot({ output: `"${word}" → "${answer}"` }),
    );
    return r.steps;
  },
};

export const RECURSION_OPS: Def[] = [
  factorialRecursion,
  fibonacciNaive,
  fibonacciMemo,
  sumRecursion,
  hanoiRecursion,
  reverseStringRecursion,
];
