/**
 * The dynamic programming stage engine.
 *
 * Every DP example is described once as a `DpSpec` (what one cell means, which
 * earlier cells it reads, how they combine) and this file turns that single
 * description into the five stages students walk through: brute-force
 * recursion, the same recursion with the repeated work marked, memoization,
 * bottom-up tabulation and the space-optimised version.
 */

import { createRecorder } from "../../recorder";
import type { CallTreeNode, DpCell, DpVizState } from "../../state";
import type { AlgorithmDefinition, CellState, ComplexityInfo } from "../../types";

export type DpStage = "brute" | "repeat" | "memo" | "table" | "optimized";

export const DP_STAGES: { slug: DpStage; title: string; blurb: string }[] = [
  {
    slug: "brute",
    title: "1. Brute force",
    blurb: "Plain recursion straight from the recurrence. Correct, and hopelessly slow.",
  },
  {
    slug: "repeat",
    title: "2. Repeated work",
    blurb: "Same run, with every sub-problem solved more than once marked as a repeat.",
  },
  {
    slug: "memo",
    title: "3. Memoization",
    blurb: "Cache each answer the first time. Repeats become instant cache hits with no children.",
  },
  {
    slug: "table",
    title: "4. Tabulation",
    blurb: "No recursion at all: fill the table in dependency order, smallest sub-problem first.",
  },
  {
    slug: "optimized",
    title: "5. Space optimised",
    blurb: "Keep only the cells still needed; everything older is dropped.",
  },
];

export interface DpInput {
  n: number;
  amount: number;
  coins: number[];
  houses: number[];
  weights: number[];
  values: number[];
  capacity: number;
  a: string;
  b: string;
  rows: number;
  cols: number;
  grid: number[][];
}

export interface CellRef {
  row: number;
  col: number;
}

export interface DpDep {
  cell: CellRef;
  /** How to describe this dependency, e.g. "skip the item". */
  label: string;
}

export interface DpPart {
  value: number | null;
  label: string;
}

export interface DpPseudo {
  signature: string;
  baseCond: string;
  baseValue: string;
  recurrence: string;
  keyExpr: string;
  tableInit: string;
  tableLoop: string;
  tableBody: string;
  answer: string;
  optimizedInit: string;
  optimizedBody: string;
  optimizedAnswer: string;
}

export interface DpSpec {
  slug: string;
  title: string;
  group: string;
  tagline: string;
  /** Plain-language definition of one table cell: the thing students miss. */
  stateMeaning: string;
  formula: string;
  dims: 1 | 2;
  size: (input: DpInput) => { rows: number; cols: number };
  target: (input: DpInput) => CellRef;
  label: (cell: CellRef, input: DpInput) => string;
  base: (cell: CellRef, input: DpInput) => { value: number | null; why: string } | null;
  deps: (cell: CellRef, input: DpInput) => DpDep[];
  combine: (
    parts: DpPart[],
    cell: CellRef,
    input: DpInput,
  ) => { value: number | null; why: string };
  /** How many previous rows (2-D) or values (1-D) the optimised version keeps. */
  keep: number;
  rowLabels?: (input: DpInput) => string[];
  colLabels?: (input: DpInput) => string[];
  answerText: (value: number | null, input: DpInput) => string;
  pseudo: DpPseudo;
  cost: {
    bruteTime: string;
    dpTime: string;
    dpSpace: string;
    optSpace: string;
    recSpace: string;
  };
}

export const fmt = (v: number | null) => (v === null ? "∞" : String(v));

const keyOf = (c: CellRef) => `${c.row},${c.col}`;

/* --------------------------------------------------------------- code views */

function recursiveCode(p: DpPseudo) {
  return [
    `function solve(${p.signature}) {`,
    `  if (${p.baseCond}) return ${p.baseValue};   // base case`,
    `  return ${p.recurrence};`,
    `}`,
  ];
}

function memoCode(p: DpPseudo) {
  return [
    `const memo = new Map();`,
    `function solve(${p.signature}) {`,
    `  const key = ${p.keyExpr};`,
    `  if (memo.has(key)) return memo.get(key);   // cache hit`,
    `  if (${p.baseCond}) return ${p.baseValue};`,
    `  const value = ${p.recurrence};`,
    `  memo.set(key, value);`,
    `  return value;`,
    `}`,
  ];
}

function tableCode(p: DpPseudo) {
  return [
    `function solve(${p.signature}) {`,
    `  const dp = ${p.tableInit};`,
    `  ${p.tableLoop} {`,
    `    ${p.tableBody};`,
    `  }`,
    `  return ${p.answer};`,
    `}`,
  ];
}

function optimizedCode(p: DpPseudo) {
  return [
    `function solve(${p.signature}) {`,
    `  ${p.optimizedInit};`,
    `  ${p.tableLoop} {`,
    `    ${p.optimizedBody};`,
    `  }`,
    `  return ${p.optimizedAnswer};`,
    `}`,
  ];
}

/* ------------------------------------------------------------- call tracking */

interface Frame {
  id: number;
  label: string;
  state: CellState;
  result?: string | undefined;
}

/** Call stack + recursion tree bookkeeping, shared by the three recursive stages. */
function tracer() {
  let frames: Frame[] = [];
  let tree: CallTreeNode[] = [];
  let nextId = 0;
  let depth = 0;

  return {
    get maxDepth() {
      return depth;
    },
    open(label: string, parentId: string | null, note?: string) {
      const id = `c${nextId++}`;
      frames = [
        ...frames.map((f) => ({ ...f, state: "visited" as CellState })),
        { id: nextId, label, state: "inspect" },
      ];
      depth = Math.max(depth, frames.length);
      tree = [...tree, { id, parentId, label, state: "inspect", note }];
      return id;
    },
    returning(result: string) {
      frames = frames.map((f, i, arr) =>
        i === arr.length - 1 ? { ...f, state: "success" as CellState, result } : f,
      );
    },
    close(id: string, result: string, state: CellState = "success") {
      frames = frames.slice(0, -1).map((f, i, arr) => ({
        ...f,
        state: i === arr.length - 1 ? ("inspect" as CellState) : ("visited" as CellState),
      }));
      tree = tree.map((n) => (n.id === id ? { ...n, state, result } : n));
    },
    snapshot(extra: Partial<DpVizState> = {}): DpVizState {
      return {
        frames: frames.map((f) => ({ ...f })),
        treeNodes: tree.map((n) => ({ ...n })),
        ...extra,
        counters: { "stack depth": frames.length, ...extra.counters },
      };
    },
  };
}

/** Plain memoized solve, used to finish a run once the step budget is spent. */
function solveDirect(spec: DpSpec, input: DpInput) {
  const cache = new Map<string, number | null>();
  const go = (cell: CellRef): number | null => {
    const k = keyOf(cell);
    const hit = cache.get(k);
    if (hit !== undefined) return hit;
    const base = spec.base(cell, input);
    if (base) {
      cache.set(k, base.value);
      return base.value;
    }
    const parts = spec.deps(cell, input).map((d) => ({ value: go(d.cell), label: d.label }));
    const out = spec.combine(parts, cell, input).value;
    cache.set(k, out);
    return out;
  };
  return go;
}

const CALL_BUDGET = 260;

/* --------------------------------------------------------- recursive stages */

function runRecursive(spec: DpSpec, input: DpInput, stage: "brute" | "repeat" | "memo") {
  const r = createRecorder<DpVizState>();
  const t = tracer();
  const fast = solveDirect(spec, input);
  const memo = new Map<string, number | null>();
  const seen = new Map<string, number>();
  const lines =
    stage === "memo"
      ? { open: [2, 3], hit: [4], base: [5], recurse: [6], combine: [6, 7] }
      : { open: [1], hit: [1], base: [2], recurse: [3], combine: [3] };

  let calls = 0;
  let repeats = 0;
  let hits = 0;
  let truncated = false;

  const counters = () =>
    stage === "brute"
      ? { calls }
      : stage === "repeat"
        ? { calls, "repeat calls": repeats }
        : { calls, "cache hits": hits };

  const memoView = () => {
    const view: Record<string, string | number> = {};
    for (const [k, v] of memo) view[spec.label(refOf(k), input)] = fmt(v);
    return view;
  };

  const snap = (extra: Partial<DpVizState> = {}) =>
    t.snapshot({
      formula: spec.formula,
      ...(stage === "memo" ? { memo: memoView(), memoLabel: "memo cache" } : {}),
      ...extra,
      counters: { ...counters(), ...extra.counters },
    });

  const go = (cell: CellRef, parentId: string | null): number | null => {
    if (truncated) return fast(cell);
    calls += 1;
    if (calls > CALL_BUDGET) {
      truncated = true;
      return fast(cell);
    }

    const k = keyOf(cell);
    const label = spec.label(cell, input);

    if (stage === "memo" && memo.has(k)) {
      const cached = memo.get(k) ?? null;
      hits += 1;
      const id = t.open(label, parentId, "memo");
      r.push(
        "highlight",
        `${label} has been solved before, so the cache answers it: ${fmt(cached)}. Notice this node has no children at all: a whole subtree just disappeared.`,
        lines.hit,
        { call: label, cacheHit: true, returns: fmt(cached) },
        snap(),
      );
      t.returning(fmt(cached));
      t.close(id, fmt(cached), "done");
      return cached;
    }

    const times = seen.get(k) ?? 0;
    seen.set(k, times + 1);
    const repeat = times > 0;
    if (repeat) repeats += 1;
    const id = t.open(label, parentId, stage === "repeat" && repeat ? "repeat" : undefined);
    r.push(
      "visit",
      stage === "repeat" && repeat
        ? `${label} is called again (repeat number ${times + 1}). Nothing remembered the earlier answer, so this entire subtree is about to be recomputed from scratch.`
        : `${label} is called. A frame goes on the stack; nothing is known yet.`,
      lines.open,
      { call: label, repeated: repeat },
      snap(),
    );

    const base = spec.base(cell, input);
    if (base) {
      t.returning(fmt(base.value));
      r.push(
        "complete",
        `${label} is a base case: ${base.why} It returns ${fmt(base.value)} without recursing.`,
        lines.base,
        { call: label, returns: fmt(base.value) },
        snap(),
      );
      memo.set(k, base.value);
      t.close(id, fmt(base.value), repeat && stage !== "memo" ? "visited" : "success");
      return base.value;
    }

    const deps = spec.deps(cell, input);
    const parts: DpPart[] = [];
    for (const dep of deps) {
      r.push(
        "highlight",
        `To answer ${label} we first need ${spec.label(dep.cell, input)}; that is the option "${dep.label}". This frame pauses.`,
        lines.recurse,
        { call: label, waitingFor: spec.label(dep.cell, input) },
        snap(),
      );
      parts.push({ value: go(dep.cell, id), label: dep.label });
    }

    const out = spec.combine(parts, cell, input);
    memo.set(k, out.value);
    t.returning(fmt(out.value));
    r.push(
      "update",
      `${label}: ${out.why} It returns ${fmt(out.value)}.${stage === "memo" ? " The answer is written into the cache, so any later call is free." : ""}`,
      lines.combine,
      { call: label, returns: fmt(out.value) },
      snap(),
    );
    t.close(id, fmt(out.value), repeat && stage !== "memo" ? "visited" : "success");
    return out.value;
  };

  const answer = go(spec.target(input), null);
  const tail = truncated
    ? " (the run was cut short after a few hundred calls; that on its own is the lesson of this stage)"
    : "";
  r.push(
    "complete",
    `Done: ${spec.answerText(answer, input)}${tail}. ${
      stage === "brute"
        ? "Every answer was recomputed from scratch. Look at the call counter, then switch to the next stage."
        : stage === "repeat"
          ? "Every node marked repeat is duplicated work. Remembering answers is the entire fix."
          : "The cache turned an exponential tree into one call per distinct sub-problem."
    }`,
    lines.combine,
    { result: fmt(answer), calls },
    snap({ output: spec.answerText(answer, input) }),
  );
  return r.steps;
}

function refOf(key: string): CellRef {
  const [row, col] = key.split(",").map(Number);
  return { row: row ?? 0, col: col ?? 0 };
}

/* ------------------------------------------------------------- table stages */

function runTable(spec: DpSpec, input: DpInput, optimized: boolean) {
  const r = createRecorder<DpVizState>();
  const { rows, cols } = spec.size(input);
  const values: (number | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );
  const filled: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );
  const target = spec.target(input);
  const oneRow = spec.dims === 1;
  const lines = { base: [2], read: [3, 4], write: [4], done: [6] };
  let fills = 0;
  let dropped = 0;

  const stale = (cell: CellRef, current: CellRef) =>
    optimized && (oneRow ? current.col - cell.col > spec.keep : current.row - cell.row > spec.keep);

  const build = (current: CellRef, reads: CellRef[], doneCell: boolean): DpVizState => {
    const cells: DpCell[][] = values.map((row, ri) =>
      row.map((value, ci) => {
        const here = { row: ri, col: ci };
        const isCurrent = ri === current.row && ci === current.col;
        const isRead = reads.some((c) => c.row === ri && c.col === ci);
        let state: CellState = "default";
        if (stale(here, current)) state = "eliminated";
        else if (isCurrent) state = doneCell ? "success" : "inspect";
        else if (isRead) state = "compare";
        else if (filled[ri]?.[ci]) state = "done";
        return { value, state };
      }),
    );
    return {
      table: {
        label: optimized ? "dp table: only the live cells are kept" : "dp table",
        cells,
        oneRow,
        current,
        reads: reads.map((c) => ({ ...c })),
        ...(spec.rowLabels && !oneRow ? { rowLabels: spec.rowLabels(input) } : {}),
        ...(spec.colLabels ? { colLabels: spec.colLabels(input) } : {}),
      },
      formula: spec.formula,
      counters: optimized
        ? { "cells filled": fills, "cells dropped": dropped, "cells kept": fills - dropped }
        : { "cells filled": fills, "table size": rows * cols },
    };
  };

  const countDropped = (current: CellRef) => {
    if (!optimized) return;
    dropped = 0;
    for (let ri = 0; ri < rows; ri++) {
      for (let ci = 0; ci < cols; ci++) {
        if (filled[ri]?.[ci] && stale({ row: ri, col: ci }, current)) dropped += 1;
      }
    }
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = { row, col };
      const label = spec.label(cell, input);
      const base = spec.base(cell, input);

      if (base) {
        values[row]![col] = base.value;
        filled[row]![col] = true;
        fills += 1;
        countDropped(cell);
        r.push(
          "insert",
          `${label} is a base case: ${base.why} Fill it in with ${fmt(base.value)}: no reads needed.`,
          lines.base,
          { cell: label, value: fmt(base.value) },
          build(cell, [], true),
        );
        continue;
      }

      const deps = spec.deps(cell, input);
      const readCells = deps.map((d) => d.cell);
      countDropped(cell);
      r.push(
        "compare",
        `${label} reads ${deps.map((d) => `${spec.label(d.cell, input)} (${d.label})`).join(" and ")}. Those cells are already final, which is why bottom-up works: nothing waits on anything.`,
        lines.read,
        { cell: label, reads: deps.map((d) => spec.label(d.cell, input)).join(", ") },
        build(cell, readCells, false),
      );

      const parts: DpPart[] = deps.map((d) => ({
        value: values[d.cell.row]?.[d.cell.col] ?? null,
        label: d.label,
      }));
      const out = spec.combine(parts, cell, input);
      values[row]![col] = out.value;
      filled[row]![col] = true;
      fills += 1;
      countDropped(cell);
      r.push(
        "update",
        `${out.why} So ${label} = ${fmt(out.value)}.${
          optimized && dropped > 0
            ? ` Cells further back are struck out: the loop can never read them again, so a real implementation would not store them.`
            : ""
        }`,
        lines.write,
        { cell: label, value: fmt(out.value) },
        build(cell, readCells, true),
      );
    }
  }

  const answer = values[target.row]?.[target.col] ?? null;
  const final = build(target, [], true);
  r.push(
    "complete",
    `The table is full and the answer sits in ${spec.label(target, input)}: ${spec.answerText(answer, input)}.${
      optimized
        ? ` Only ${spec.keep + 1} ${oneRow ? "values" : "rows"} were ever alive at once, which is the whole space saving.`
        : " Every cell was computed exactly once: that is the difference from the recursive stages."
    }`,
    lines.done,
    { result: fmt(answer), "cells filled": fills },
    { ...final, output: spec.answerText(answer, input) },
  );
  return r.steps;
}

/* ----------------------------------------------------------- stage assembly */

function complexityFor(spec: DpSpec, stage: DpStage): ComplexityInfo {
  const { bruteTime, dpTime, dpSpace, optSpace, recSpace } = spec.cost;
  if (stage === "brute" || stage === "repeat") {
    return {
      timeBest: bruteTime,
      timeAverage: bruteTime,
      timeWorst: bruteTime,
      space: recSpace,
      plainEnglish: `Every sub-problem is recomputed every time it is asked for, so the work explodes to ${bruteTime}. The space is only ${recSpace} because just one path of the tree is on the stack at a time.`,
    };
  }
  if (stage === "memo") {
    return {
      timeBest: dpTime,
      timeAverage: dpTime,
      timeWorst: dpTime,
      space: `${dpSpace} + ${recSpace} stack`,
      plainEnglish: `Each distinct sub-problem is solved once and cached, so the time collapses to ${dpTime}. You pay ${dpSpace} for the cache plus ${recSpace} for the recursion stack.`,
    };
  }
  if (stage === "table") {
    return {
      timeBest: dpTime,
      timeAverage: dpTime,
      timeWorst: dpTime,
      space: dpSpace,
      plainEnglish: `Same ${dpTime} work as memoization, but with no recursion, so no stack and no overflow risk. The table itself costs ${dpSpace}.`,
    };
  }
  return {
    timeBest: dpTime,
    timeAverage: dpTime,
    timeWorst: dpTime,
    space: optSpace,
    plainEnglish: `The time stays ${dpTime}; the space drops to ${optSpace} because each cell only ever reads a couple of recent cells, so the rest can be thrown away.`,
  };
}

export type DpDefinition = AlgorithmDefinition<DpVizState, DpInput>;

export function dpStage(spec: DpSpec, stage: DpStage): DpDefinition {
  const stageMeta = DP_STAGES.find((s) => s.slug === stage)!;
  const code =
    stage === "memo"
      ? memoCode(spec.pseudo)
      : stage === "table"
        ? tableCode(spec.pseudo)
        : stage === "optimized"
          ? optimizedCode(spec.pseudo)
          : recursiveCode(spec.pseudo);

  return {
    slug: `${spec.slug}-${stage}`,
    title: `${spec.title}: ${stageMeta.title.replace(/^\d+\.\s*/, "")}`,
    tagline: `${stageMeta.blurb} ${spec.stateMeaning}`,
    language: "JavaScript",
    code,
    complexity: complexityFor(spec, stage),
    generate: (input) =>
      stage === "table" || stage === "optimized"
        ? runTable(spec, input, stage === "optimized")
        : runRecursive(spec, input, stage),
  };
}
