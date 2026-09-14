/**
 * Backtracking examples.
 *
 * Every generator follows the same three-beat rhythm students should learn to
 * hear: choose, explore, un-choose. The call stack and the call tree show the
 * explore part; the board (or the row of chips) shows the choice being undone.
 */

import { createRecorder } from "../recorder";
import type { BacktrackVizState, BoardCell, CallTreeNode } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface BtInput {
  /** Pool for subsets and permutations. */
  items: number[];
  candidates: number[];
  target: number;
  /** Board size for n-queens. */
  n: number;
  /** 1 = open, 0 = wall. */
  maze: number[][];
  grid: string[][];
  word: string;
}

export type BtDefinition = AlgorithmDefinition<BacktrackVizState, BtInput>;

/** Hard cap so a bad input can never freeze the page. */
const STEP_BUDGET = 900;

interface Frame {
  id: number;
  label: string;
  state: CellState;
  result?: string | undefined;
}

function tracer() {
  let frames: Frame[] = [];
  let tree: CallTreeNode[] = [];
  let calls = 0;
  let maxDepth = 0;
  let solutions = 0;
  let backtracks = 0;
  let pruned = 0;
  let nextId = 0;

  return {
    open(label: string, parentId: string | null, note?: string) {
      const id = `b${nextId++}`;
      calls += 1;
      frames = [
        ...frames.map((f) => ({ ...f, state: "visited" as CellState })),
        { id: nextId, label, state: "inspect" },
      ];
      maxDepth = Math.max(maxDepth, frames.length);
      tree = [...tree, { id, parentId, label, state: "inspect", note }];
      return id;
    },
    close(id: string, result: string, state: CellState = "done") {
      frames = frames.slice(0, -1).map((f, i, arr) => ({
        ...f,
        state: i === arr.length - 1 ? ("inspect" as CellState) : ("visited" as CellState),
      }));
      tree = tree.map((n) => (n.id === id ? { ...n, state, result } : n));
    },
    found() {
      solutions += 1;
    },
    back() {
      backtracks += 1;
    },
    prune() {
      pruned += 1;
    },
    get solutions() {
      return solutions;
    },
    snapshot(extra: Partial<BacktrackVizState> = {}): BacktrackVizState {
      return {
        frames: frames.map((f) => ({ ...f })),
        treeNodes: tree.map((n) => ({ ...n })),
        ...extra,
        counters: {
          calls,
          "solutions found": solutions,
          "backtracks (un-choose)": backtracks,
          "branches pruned": pruned,
          "max depth": maxDepth,
          ...extra.counters,
        },
      };
    },
  };
}

const chip = (label: string, state: CellState): BoardCell => ({ label, state });
const list = (values: (number | string)[]) => `[${values.join(", ")}]`;

/* ------------------------------------------------------------------ subsets */

const SUBSETS_CODE = [
  "function subsets(nums) {",
  "  const res = [], path = [];",
  "  function backtrack(i) {",
  "    if (i === nums.length) {",
  "      res.push([...path]);   // a complete choice",
  "      return;",
  "    }",
  "    path.push(nums[i]);      // choose",
  "    backtrack(i + 1);        // explore",
  "    path.pop();              // un-choose",
  "    backtrack(i + 1);        // explore without it",
  "  }",
  "  backtrack(0);",
  "  return res;",
  "}",
];

function subsetsGenerate(input: BtInput) {
  const items = input.items.slice(0, 4);
  const rec = createRecorder<BacktrackVizState>();
  const t = tracer();
  const chosen = items.map(() => false);
  const solutions: string[] = [];
  let budget = STEP_BUDGET;

  const picked = () => items.filter((_, i) => chosen[i]);
  const snap = (cursor: number | null) =>
    t.snapshot({
      items: items.map((v, i) =>
        chip(String(v), chosen[i] ? "success" : i === cursor ? "inspect" : "default"),
      ),
      itemsLabel: "pool",
      partial: list(picked()),
      partialLabel: "current subset",
      solutions: [...solutions],
      solutionsLabel: "subsets found",
    });

  const go = (i: number, parentId: string | null) => {
    if (budget-- <= 0) return;
    const id = t.open(`bt(${i})`, parentId);

    if (i === items.length) {
      const found = list(picked());
      solutions.push(found);
      t.found();
      rec.push(
        "complete",
        `Index ${i} is past the end, so every item has been decided: record ${found} as subset ${solutions.length}.`,
        [4, 5, 6],
        { i, subset: found, found: solutions.length },
        snap(null),
      );
      t.close(id, found, "success");
      return;
    }

    rec.push(
      "visit",
      `At index ${i}: decide whether ${items[i]} joins the subset. Both answers are explored, in that order.`,
      [3, 4],
      { i, item: items[i]!, subset: list(picked()) },
      snap(i),
    );

    chosen[i] = true;
    rec.push(
      "insert",
      `Choose ${items[i]}: push it onto the path, then explore everything that follows this decision.`,
      [8, 9],
      { i, item: items[i]!, subset: list(picked()) },
      snap(i),
    );
    go(i + 1, id);

    chosen[i] = false;
    t.back();
    rec.push(
      "delete",
      `Un-choose ${items[i]}. This is the backtrack: the path is restored exactly as it was before the choice.`,
      [10, 11],
      { i, item: items[i]!, subset: list(picked()) },
      snap(i),
    );
    go(i + 1, id);

    t.close(id, `${Math.pow(2, items.length - i)} subsets`, "done");
    rec.push(
      "update",
      `Both branches at index ${i} are done, so this call returns and the one below it continues.`,
      [12],
      { i, subset: list(picked()) },
      snap(null),
    );
  };

  rec.push(
    "highlight",
    `Start with an empty subset and index 0. Each item has exactly two options (in or out), which is why the answer has 2^${items.length} = ${Math.pow(2, items.length)} subsets.`,
    [1, 2, 13],
    { items: list(items), expected: Math.pow(2, items.length) },
    snap(0),
  );
  go(0, null);
  rec.push(
    "complete",
    `Every branch has been explored. ${solutions.length} subsets found: the empty one, the full one, and everything between.`,
    [14],
    { found: solutions.length },
    t.snapshot({
      items: items.map((v) => chip(String(v), "done")),
      itemsLabel: "pool",
      solutions: [...solutions],
      solutionsLabel: "subsets found",
      output: `${solutions.length} subsets`,
    }),
  );
  return rec.steps;
}

/* ------------------------------------------------------------- permutations */

const PERMS_CODE = [
  "function permute(nums) {",
  "  const res = [], path = [], used = [];",
  "  function backtrack() {",
  "    if (path.length === nums.length) {",
  "      res.push([...path]);",
  "      return;",
  "    }",
  "    for (let i = 0; i < nums.length; i++) {",
  "      if (used[i]) continue;   // already in the path",
  "      used[i] = true; path.push(nums[i]);   // choose",
  "      backtrack();                          // explore",
  "      path.pop(); used[i] = false;          // un-choose",
  "    }",
  "  }",
  "  backtrack();",
  "  return res;",
  "}",
];

function permutationsGenerate(input: BtInput) {
  const items = input.items.slice(0, 4);
  const rec = createRecorder<BacktrackVizState>();
  const t = tracer();
  const used = items.map(() => false);
  const path: number[] = [];
  const solutions: string[] = [];
  let budget = STEP_BUDGET;

  const snap = (cursor: number | null, blocked = false) =>
    t.snapshot({
      items: items.map((v, i) =>
        chip(
          String(v),
          used[i] ? "success" : i === cursor ? (blocked ? "error" : "inspect") : "default",
        ),
      ),
      itemsLabel: "pool (green = already used)",
      partial: list(path),
      partialLabel: "current permutation",
      solutions: [...solutions],
      solutionsLabel: "permutations found",
    });

  const go = (parentId: string | null) => {
    if (budget-- <= 0) return;
    const id = t.open(`bt(${list(path)})`, parentId);

    if (path.length === items.length) {
      const found = list(path);
      solutions.push(found);
      t.found();
      rec.push(
        "complete",
        `The path uses every item, so ${found} is a complete permutation (number ${solutions.length}).`,
        [4, 5, 6],
        { permutation: found, found: solutions.length },
        snap(null),
      );
      t.close(id, found, "success");
      return;
    }

    rec.push(
      "visit",
      `Path is ${list(path)}. Try each unused item in position ${path.length}.`,
      [3, 8],
      { path: list(path), position: path.length },
      snap(null),
    );

    for (let i = 0; i < items.length; i++) {
      if (used[i]) {
        t.prune();
        rec.push(
          "eliminate",
          `${items[i]} is already in the path, so it cannot be reused; skip this branch entirely.`,
          [9],
          { i, item: items[i]!, path: list(path) },
          snap(i, true),
        );
        continue;
      }
      used[i] = true;
      path.push(items[i]!);
      rec.push(
        "insert",
        `Choose ${items[i]} for position ${path.length - 1}, mark it used, and recurse.`,
        [10, 11],
        { i, item: items[i]!, path: list(path) },
        snap(i),
      );
      go(id);
      path.pop();
      used[i] = false;
      t.back();
      rec.push(
        "delete",
        `Un-choose ${items[i]}: pop it from the path and free it again so the next branch can use it.`,
        [12],
        { i, item: items[i]!, path: list(path) },
        snap(i),
      );
    }

    t.close(id, "explored", "done");
    rec.push(
      "update",
      `Every item has been tried at position ${path.length}, so this call returns.`,
      [13, 14],
      { path: list(path) },
      snap(null),
    );
  };

  const total = items.reduce((acc, _, i) => acc * (i + 1), 1);
  rec.push(
    "highlight",
    `Build the permutation one position at a time. With ${items.length} distinct items there are ${items.length}! = ${total} of them.`,
    [1, 2, 15],
    { items: list(items), expected: total },
    snap(null),
  );
  go(null);
  rec.push(
    "complete",
    `All branches explored: ${solutions.length} permutations. The "used" flags are what stop an item appearing twice.`,
    [16],
    { found: solutions.length },
    t.snapshot({
      items: items.map((v) => chip(String(v), "done")),
      itemsLabel: "pool",
      solutions: [...solutions],
      solutionsLabel: "permutations found",
      output: `${solutions.length} permutations`,
    }),
  );
  return rec.steps;
}

/* ---------------------------------------------------------- combination sum */

const COMBO_CODE = [
  "function combinationSum(cands, target) {",
  "  const res = [], path = [];",
  "  function backtrack(start, remain) {",
  "    if (remain === 0) { res.push([...path]); return; }",
  "    if (remain < 0) return;                 // prune: overshot",
  "    for (let i = start; i < cands.length; i++) {",
  "      path.push(cands[i]);                  // choose",
  "      backtrack(i, remain - cands[i]);      // reuse allowed",
  "      path.pop();                           // un-choose",
  "    }",
  "  }",
  "  backtrack(0, target);",
  "  return res;",
  "}",
];

function comboGenerate(input: BtInput) {
  const cands = [...new Set(input.candidates.filter((c) => c > 0))]
    .sort((a, b) => a - b)
    .slice(0, 4);
  const target = input.target;
  const rec = createRecorder<BacktrackVizState>();
  const t = tracer();
  const path: number[] = [];
  const solutions: string[] = [];
  let budget = STEP_BUDGET;

  const snap = (cursor: number | null, state: CellState = "inspect") =>
    t.snapshot({
      items: cands.map((v, i) => chip(String(v), i === cursor ? state : "default")),
      itemsLabel: "candidates (each may be reused)",
      partial: list(path),
      partialLabel: "current combination",
      solutions: [...solutions],
      solutionsLabel: "combinations found",
    });

  const go = (start: number, remain: number, parentId: string | null) => {
    if (budget-- <= 0) return;
    const id = t.open(`bt(start=${start}, remain=${remain})`, parentId);

    if (remain === 0) {
      const found = list(path);
      solutions.push(found);
      t.found();
      rec.push(
        "complete",
        `Remaining is 0, so ${found} adds up to exactly ${target}. Solution ${solutions.length}.`,
        [4],
        { remain, combination: found },
        snap(null),
      );
      t.close(id, found, "success");
      return;
    }
    if (remain < 0) {
      t.prune();
      rec.push(
        "eliminate",
        `Remaining is ${remain}, below zero: the last choice overshot the target, so this whole branch is abandoned.`,
        [5],
        { remain },
        snap(null, "error"),
      );
      t.close(id, "overshot", "error");
      return;
    }

    rec.push(
      "visit",
      `Need ${remain} more, and may only use candidates from index ${start} onwards; that rule is what stops duplicate combinations in a different order.`,
      [3, 6],
      { start, remain, path: list(path) },
      snap(start),
    );

    for (let i = start; i < cands.length; i++) {
      path.push(cands[i]!);
      rec.push(
        "insert",
        `Choose ${cands[i]}, leaving ${remain - cands[i]!} to make. Recurse with start = ${i}, so ${cands[i]} can be chosen again.`,
        [7, 8],
        { i, choice: cands[i]!, remain: remain - cands[i]!, path: list(path) },
        snap(i),
      );
      go(i, remain - cands[i]!, id);
      path.pop();
      t.back();
      rec.push(
        "delete",
        `Un-choose ${cands[i]} and move on to the next candidate.`,
        [9],
        { i, path: list(path) },
        snap(i),
      );
    }

    t.close(id, "explored", "done");
    rec.push(
      "update",
      `All candidates from index ${start} tried for a remainder of ${remain}.`,
      [10, 11],
      { start, remain },
      snap(null),
    );
  };

  rec.push(
    "highlight",
    `Target ${target}. At every step the choice is "which candidate do I add next?", and the remainder shrinks until it hits 0 (a solution) or goes negative (a dead end).`,
    [1, 2, 12],
    { target, candidates: list(cands) },
    snap(null),
  );
  go(0, target, null);
  rec.push(
    "complete",
    `${solutions.length} combination(s) sum to ${target}. Sorting the candidates plus the "start" index keeps each one unique.`,
    [13],
    { found: solutions.length },
    t.snapshot({
      items: cands.map((v) => chip(String(v), "done")),
      itemsLabel: "candidates",
      solutions: [...solutions],
      solutionsLabel: "combinations found",
      output: `${solutions.length} combination(s) for ${target}`,
    }),
  );
  return rec.steps;
}

/* ---------------------------------------------------------------- n-queens */

const QUEENS_CODE = [
  "function solveNQueens(n) {",
  "  const cols = new Set(), diag = new Set(), anti = new Set();",
  "  function backtrack(row) {",
  "    if (row === n) return true;             // all queens placed",
  "    for (let col = 0; col < n; col++) {",
  "      if (cols.has(col) || diag.has(row - col) || anti.has(row + col))",
  "        continue;                           // attacked, prune",
  "      place(row, col);                      // choose",
  "      if (backtrack(row + 1)) return true;  // explore",
  "      remove(row, col);                     // un-choose",
  "    }",
  "    return false;                           // dead end",
  "  }",
  "  return backtrack(0);",
  "}",
];

function queensGenerate(input: BtInput) {
  const n = Math.min(6, Math.max(4, Math.round(input.n)));
  const rec = createRecorder<BacktrackVizState>();
  const t = tracer();
  const queens: number[] = []; // queens[row] = col
  const cols = new Set<number>();
  const diag = new Set<number>();
  const anti = new Set<number>();
  let budget = STEP_BUDGET;
  let solved = false;

  const board = (
    cursor: { row: number; col: number } | null,
    cursorState: CellState = "inspect",
  ) => {
    const cells: BoardCell[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => {
        if (queens[r] === c) return chip("Q", "success");
        if (cursor && cursor.row === r && cursor.col === c) return chip("·", cursorState);
        const attacked = queens.some(
          (qc, qr) => qc === c || qr - qc === r - c || qr + qc === r + c,
        );
        return chip(attacked ? "×" : "·", attacked ? "eliminated" : "default");
      }),
    );
    return {
      cells,
      label: `${n}×${n} board: Q = queen, × = attacked square`,
      rowLabels: Array.from({ length: n }, (_, r) => `row ${r}`),
      colLabels: Array.from({ length: n }, (_, c) => String(c)),
    };
  };

  const snap = (cursor: { row: number; col: number } | null, cursorState?: CellState) =>
    t.snapshot({
      board: board(cursor, cursorState),
      partial: queens.length ? queens.map((c, r) => `r${r}c${c}`).join(" ") : "no queens yet",
      partialLabel: "queens placed",
    });

  const go = (row: number, parentId: string | null): boolean => {
    if (budget-- <= 0) return false;
    const id = t.open(`row ${row}`, parentId);

    if (row === n) {
      t.found();
      rec.push(
        "complete",
        `Row ${row} is past the last row, so all ${n} queens are placed with no two attacking each other.`,
        [4],
        { row, queens: queens.join(",") },
        snap(null),
      );
      t.close(id, "solved", "success");
      return true;
    }

    rec.push(
      "visit",
      `Row ${row}: exactly one queen goes here. Try the columns left to right, skipping any square already attacked.`,
      [3, 5],
      { row },
      snap(null),
    );

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag.has(row - col) || anti.has(row + col)) {
        t.prune();
        rec.push(
          "eliminate",
          `(${row}, ${col}) is attacked by a queen already on the board, so skip it without recursing. This pruning is what makes n-queens tractable.`,
          [6, 7],
          { row, col },
          snap({ row, col }, "error"),
        );
        continue;
      }
      queens[row] = col;
      cols.add(col);
      diag.add(row - col);
      anti.add(row + col);
      rec.push(
        "insert",
        `Place a queen at (${row}, ${col}) (which claims column ${col}, diagonal ${row - col} and anti-diagonal ${row + col}), then move to row ${row + 1}.`,
        [8, 9],
        { row, col, placed: row + 1 },
        snap(null),
      );

      if (go(row + 1, id)) {
        t.close(id, `col ${col}`, "success");
        return true;
      }

      queens.length = row;
      cols.delete(col);
      diag.delete(row - col);
      anti.delete(row + col);
      t.back();
      rec.push(
        "delete",
        `Row ${row + 1} had no safe square, so remove the queen from (${row}, ${col}) and try the next column. This is the backtrack.`,
        [10],
        { row, col },
        snap({ row, col }, "error"),
      );
    }

    t.close(id, "dead end", "error");
    rec.push(
      "update",
      `No column in row ${row} works, so this call reports failure and the row above must move its queen.`,
      [11, 12],
      { row },
      snap(null),
    );
    return false;
  };

  rec.push(
    "highlight",
    `Place one queen per row. A square is safe when its column, its diagonal and its anti-diagonal are all free; three sets make that check O(1).`,
    [1, 2, 13],
    { n },
    snap(null),
  );
  solved = go(0, null);
  rec.push(
    "complete",
    solved
      ? `Solved: one queen in every row, none attacking another. Larger boards work the same way; only the amount of backtracking changes.`
      : `No arrangement exists for this board size.`,
    [13, 14],
    { n, solved },
    t.snapshot({
      board: board(null),
      partial: queens.map((c, r) => `r${r}c${c}`).join(" "),
      partialLabel: "queens placed",
      output: solved ? `solution: ${queens.map((c, r) => `(${r},${c})`).join(" ")}` : "no solution",
    }),
  );
  return rec.steps;
}

/* ------------------------------------------------------------ rat in a maze */

const MAZE_CODE = [
  "function findPath(grid) {",
  "  const path = [];",
  "  function backtrack(r, c) {",
  "    if (!inside(r, c) || grid[r][c] === 0 || seen(r, c)) return false;",
  "    path.push([r, c]);                     // choose",
  "    if (r === n - 1 && c === m - 1) return true;",
  "    for (const [dr, dc] of [[1,0],[0,1],[-1,0],[0,-1]])",
  "      if (backtrack(r + dr, c + dc)) return true;   // explore",
  "    path.pop();                            // un-choose",
  "    return false;",
  "  }",
  "  return backtrack(0, 0);",
  "}",
];

const DIRS: [number, number, string][] = [
  [1, 0, "down"],
  [0, 1, "right"],
  [-1, 0, "up"],
  [0, -1, "left"],
];

function mazeGenerate(input: BtInput) {
  const grid = input.maze;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const rec = createRecorder<BacktrackVizState>();
  const t = tracer();
  const onPath: boolean[][] = grid.map((r) => r.map(() => false));
  const deadEnd: boolean[][] = grid.map((r) => r.map(() => false));
  let budget = STEP_BUDGET;

  const board = (cursor: { r: number; c: number } | null, cursorState: CellState = "inspect") => ({
    cells: grid.map((row, r) =>
      row.map((v, c) => {
        if (cursor && cursor.r === r && cursor.c === c && !onPath[r]![c])
          return chip(v === 0 ? "▩" : "?", cursorState);
        if (v === 0) return chip("▩", "eliminated");
        if (onPath[r]![c]) return chip(r === rows - 1 && c === cols - 1 ? "★" : "•", "success");
        if (deadEnd[r]![c]) return chip("×", "error");
        return chip("·", "default");
      }),
    ),
    label: "▩ = wall, • = current path, × = dead end, ★ = exit",
    rowLabels: grid.map((_, r) => `r${r}`),
    colLabels: Array.from({ length: cols }, (_, c) => String(c)),
  });

  const pathCells = () => {
    const out: string[] = [];
    onPath.forEach((row, r) => row.forEach((on, c) => on && out.push(`(${r},${c})`)));
    return out;
  };

  const snap = (cursor: { r: number; c: number } | null, cursorState?: CellState) =>
    t.snapshot({
      board: board(cursor, cursorState),
      partial: pathCells().join(" → ") || "still at the start",
      partialLabel: "path so far",
    });

  const go = (r: number, c: number, parentId: string | null, how: string): boolean => {
    if (budget-- <= 0) return false;
    const id = t.open(`(${r},${c})`, parentId, how);

    if (r < 0 || c < 0 || r >= rows || c >= cols) {
      t.prune();
      rec.push(
        "eliminate",
        `Moving ${how} leaves the grid, so that branch is rejected immediately.`,
        [4],
        { r, c },
        snap(null),
      );
      t.close(id, "off grid", "error");
      return false;
    }
    if (grid[r]![c] === 0) {
      t.prune();
      rec.push(
        "eliminate",
        `(${r}, ${c}) is a wall: rejected before doing any work.`,
        [4],
        { r, c },
        snap({ r, c }, "error"),
      );
      t.close(id, "wall", "error");
      return false;
    }
    if (onPath[r]![c] || deadEnd[r]![c]) {
      t.prune();
      rec.push(
        "eliminate",
        `(${r}, ${c}) is already on the path or known to be a dead end: revisiting it would loop forever.`,
        [4],
        { r, c },
        snap({ r, c }, "error"),
      );
      t.close(id, "seen", "error");
      return false;
    }

    onPath[r]![c] = true;
    rec.push(
      "insert",
      `Step onto (${r}, ${c}): this is the "choose" beat. The cell is now part of the candidate path.`,
      [5],
      { r, c, steps: pathCells().length },
      snap(null),
    );

    if (r === rows - 1 && c === cols - 1) {
      t.found();
      rec.push(
        "complete",
        `(${r}, ${c}) is the exit, so the path currently on the board is a full solution: every call above simply returns true.`,
        [6],
        { r, c, length: pathCells().length },
        snap(null),
      );
      t.close(id, "exit", "success");
      return true;
    }

    rec.push(
      "visit",
      `From (${r}, ${c}) try the four moves in a fixed order: down, right, up, left.`,
      [7],
      { r, c },
      snap(null),
    );

    for (const [dr, dc, name] of DIRS) {
      if (go(r + dr, c + dc, id, name)) {
        t.close(id, "on path", "success");
        return true;
      }
    }

    onPath[r]![c] = false;
    deadEnd[r]![c] = true;
    t.back();
    rec.push(
      "delete",
      `Every direction from (${r}, ${c}) failed, so step back off it. Un-choosing is what lets the search try a different route.`,
      [9, 10],
      { r, c },
      snap({ r, c }, "error"),
    );
    t.close(id, "dead end", "error");
    return false;
  };

  rec.push(
    "highlight",
    `Walk from the top-left towards the bottom-right. Each move is a choice, each wall or repeat is pruned, and a dead end is undone.`,
    [1, 2, 12],
    { rows, cols },
    snap(null),
  );
  const solved = go(0, 0, null, "start");
  rec.push(
    "complete",
    solved
      ? `Path found. Notice how many cells were stepped on and then abandoned; that is the search, not a mistake.`
      : `No path reaches the exit: every route runs into walls or dead ends.`,
    [12, 13],
    { solved },
    t.snapshot({
      board: board(null),
      partial: pathCells().join(" → "),
      partialLabel: "path so far",
      output: solved ? pathCells().join(" → ") : "no path exists",
    }),
  );
  return rec.steps;
}

/* -------------------------------------------------------------- word search */

const WORD_CODE = [
  "function exist(board, word) {",
  "  function backtrack(r, c, k) {",
  "    if (k === word.length) return true;",
  "    if (!inside(r, c) || board[r][c] !== word[k]) return false;",
  "    const tmp = board[r][c];",
  "    board[r][c] = '#';                     // choose (mark visited)",
  "    for (const [dr, dc] of DIRS)",
  "      if (backtrack(r + dr, c + dc, k + 1)) return true;",
  "    board[r][c] = tmp;                     // un-choose",
  "    return false;",
  "  }",
  "  return cells.some(([r, c]) => backtrack(r, c, 0));",
  "}",
];

function wordSearchGenerate(input: BtInput) {
  const grid = input.grid;
  const word = input.word.toUpperCase().slice(0, 6);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const rec = createRecorder<BacktrackVizState>();
  const t = tracer();
  const used: boolean[][] = grid.map((r) => r.map(() => false));
  let mismatch: { r: number; c: number } | null = null;
  let budget = STEP_BUDGET;

  const board = () => ({
    cells: grid.map((row, r) =>
      row.map((ch, c) => {
        if (used[r]![c]) return chip(ch, "success");
        if (mismatch && mismatch.r === r && mismatch.c === c) return chip(ch, "error");
        return chip(ch, "default");
      }),
    ),
    label: "green = letters currently matched",
    rowLabels: grid.map((_, r) => `r${r}`),
    colLabels: Array.from({ length: cols }, (_, c) => String(c)),
  });

  const matched = () =>
    grid.flatMap((row, r) => row.filter((_, c) => used[r]![c]).map((ch) => ch)).join("");

  const snap = (k: number) =>
    t.snapshot({
      board: board(),
      items: word
        .split("")
        .map((ch, i) => chip(ch, i < k ? "success" : i === k ? "inspect" : "default")),
      itemsLabel: `target word "${word}"`,
      partial: matched() || "nothing matched yet",
      partialLabel: "letters matched",
    });

  const go = (r: number, c: number, k: number, parentId: string | null): boolean => {
    if (budget-- <= 0) return false;
    const id = t.open(`(${r},${c}) k=${k}`, parentId);

    if (k === word.length) {
      t.found();
      rec.push(
        "complete",
        `All ${word.length} letters of "${word}" have been matched along a connected path.`,
        [3],
        { k },
        snap(k),
      );
      t.close(id, "found", "success");
      return true;
    }
    if (r < 0 || c < 0 || r >= rows || c >= cols || used[r]![c] || grid[r]![c] !== word[k]) {
      t.prune();
      const why =
        r < 0 || c < 0 || r >= rows || c >= cols
          ? "that move leaves the grid"
          : used[r]![c]
            ? "that cell is already used by this path"
            : `'${grid[r]![c]}' is not the letter '${word[k]}' we need`;
      if (r >= 0 && c >= 0 && r < rows && c < cols) mismatch = { r, c };
      rec.push(
        "eliminate",
        `Rejected: ${why}. The branch stops here: no deeper calls are made.`,
        [4],
        { r, c, k, need: word[k] ?? "" },
        snap(k),
      );
      mismatch = null;
      t.close(id, "no match", "error");
      return false;
    }

    used[r]![c] = true;
    rec.push(
      "insert",
      `'${grid[r]![c]}' at (${r}, ${c}) matches letter ${k + 1} of "${word}". Mark the cell used so this path cannot reuse it, then look at the four neighbours.`,
      [5, 6, 7],
      { r, c, k, letter: grid[r]![c] ?? "" },
      snap(k + 1),
    );

    for (const [dr, dc] of DIRS) {
      if (go(r + dr, c + dc, k + 1, id)) {
        t.close(id, "on path", "success");
        return true;
      }
    }

    used[r]![c] = false;
    t.back();
    rec.push(
      "delete",
      `No neighbour of (${r}, ${c}) continues the word, so un-mark the cell and let another path use it.`,
      [9, 10],
      { r, c, k },
      snap(k),
    );
    t.close(id, "dead end", "error");
    return false;
  };

  rec.push(
    "highlight",
    `Look for "${word}" as a connected path of neighbouring cells. Any starting cell is allowed, and no cell may be reused within one path.`,
    [1, 12],
    { word, rows, cols },
    snap(0),
  );

  let found = false;
  for (let r = 0; r < rows && !found; r++) {
    for (let c = 0; c < cols && !found; c++) {
      if (grid[r]![c] !== word[0]) continue;
      rec.push(
        "visit",
        `(${r}, ${c}) holds '${word[0]}', so it is a possible start; launch the search from here.`,
        [12],
        { r, c },
        snap(0),
      );
      found = go(r, c, 0, null);
    }
  }

  rec.push(
    "complete",
    found
      ? `"${word}" exists in the grid. The green cells are the path that survived; everything else was tried and undone.`
      : `"${word}" is not in the grid: every start was explored and every branch failed.`,
    [12, 13],
    { word, found },
    t.snapshot({
      board: board(),
      items: word.split("").map((ch) => chip(ch, found ? "done" : "error")),
      itemsLabel: `target word "${word}"`,
      output: found ? `"${word}" found` : `"${word}" not found`,
    }),
  );
  return rec.steps;
}

/* ---------------------------------------------------------------- registry */

export const BACKTRACKING_OPS: BtDefinition[] = [
  {
    slug: "subsets",
    title: "Subsets",
    tagline: "The purest backtracking shape: every item is in or out.",
    code: SUBSETS_CODE,
    language: "javascript",
    complexity: {
      timeBest: "O(2ⁿ)",
      timeAverage: "O(n · 2ⁿ)",
      timeWorst: "O(n · 2ⁿ)",
      space: "O(n) stack + O(n · 2ⁿ) output",
      plainEnglish:
        "There are 2ⁿ subsets and copying each one costs up to n, so the output itself dominates. The recursion only ever holds n frames.",
    },
    generate: subsetsGenerate,
  },
  {
    slug: "permutations",
    title: "Permutations",
    tagline: "Choose an unused item for each position, then free it again.",
    code: PERMS_CODE,
    language: "javascript",
    complexity: {
      timeBest: "O(n!)",
      timeAverage: "O(n · n!)",
      timeWorst: "O(n · n!)",
      space: "O(n) stack + O(n · n!) output",
      plainEnglish:
        "Every ordering must be produced, and there are n! of them. The used flags are what keep each ordering valid.",
    },
    generate: permutationsGenerate,
  },
  {
    slug: "combination-sum",
    title: "Combination Sum",
    tagline: "Pruning in action: a negative remainder kills a whole branch.",
    code: COMBO_CODE,
    language: "javascript",
    complexity: {
      timeBest: "O(n)",
      timeAverage: "O(n^(target/min))",
      timeWorst: "O(n^(target/min))",
      space: "O(target/min) stack",
      plainEnglish:
        "The tree is as deep as target divided by the smallest candidate. Overshooting the target prunes early, which is why sorting helps.",
    },
    generate: comboGenerate,
  },
  {
    slug: "n-queens",
    title: "N-Queens",
    tagline: "One queen per row, with attacked squares pruned before recursing.",
    code: QUEENS_CODE,
    language: "javascript",
    complexity: {
      timeBest: "O(n!)",
      timeAverage: "O(n!)",
      timeWorst: "O(n!)",
      space: "O(n)",
      plainEnglish:
        "Without pruning it would be nⁿ; checking columns and both diagonals first cuts it to roughly n! and in practice far fewer branches.",
    },
    generate: queensGenerate,
  },
  {
    slug: "rat-in-a-maze",
    title: "Rat in a Maze",
    tagline: "Step forward, and step back off dead ends.",
    code: MAZE_CODE,
    language: "javascript",
    complexity: {
      timeBest: "O(rows · cols)",
      timeAverage: "O(4^(rows·cols))",
      timeWorst: "O(4^(rows·cols))",
      space: "O(rows · cols) stack",
      plainEnglish:
        "Four choices per cell in the worst case; marking cells as visited is what keeps the search finite instead of looping.",
    },
    generate: mazeGenerate,
  },
  {
    slug: "word-search",
    title: "Word Search",
    tagline: "A grid DFS that unmarks each cell on the way out.",
    code: WORD_CODE,
    language: "javascript",
    complexity: {
      timeBest: "O(rows · cols)",
      timeAverage: "O(rows · cols · 4^len)",
      timeWorst: "O(rows · cols · 4^len)",
      space: "O(len) stack",
      plainEnglish:
        "Each starting cell branches four ways per letter. The mark-and-restore trick avoids a separate visited grid.",
    },
    generate: wordSearchGenerate,
  },
];
