/**
 * The eight dynamic programming examples, each described once as a `DpSpec`.
 * The stage engine in ./shared.ts turns every spec into five runnable stages.
 */

import type { DpPart, DpSpec } from "./shared";

const sum = (parts: DpPart[]) => {
  if (parts.some((p) => p.value === null)) return null;
  return parts.reduce((s, p) => s + (p.value ?? 0), 0);
};

const chars = (s: string) => ["ε", ...s.split("")];
const range = (n: number) => Array.from({ length: n }, (_, i) => String(i));

/* ------------------------------------------------------------------ 1-D simple */

export const fibonacciSpec: DpSpec = {
  slug: "fibonacci",
  title: "Fibonacci",
  group: "One dimension",
  tagline:
    "The cleanest place to see the whole progression: the same numbers computed five different ways.",
  stateMeaning: "dp[i] is the i-th Fibonacci number.",
  formula: "dp[i] = dp[i - 1] + dp[i - 2]",
  dims: 1,
  size: ({ n }) => ({ rows: 1, cols: n + 1 }),
  target: ({ n }) => ({ row: 0, col: n }),
  label: (c) => `fib(${c.col})`,
  base: (c) => (c.col <= 1 ? { value: c.col, why: `fib(${c.col}) is defined as ${c.col}.` } : null),
  deps: (c) => [
    { cell: { row: 0, col: c.col - 1 }, label: "one back" },
    { cell: { row: 0, col: c.col - 2 }, label: "two back" },
  ],
  combine: (parts) => {
    const value = sum(parts);
    return {
      value,
      why: `${parts[0]?.value} + ${parts[1]?.value} = ${value}.`,
    };
  },
  keep: 2,
  colLabels: ({ n }) => range(n + 1),
  answerText: (v, { n }) => `fib(${n}) = ${v}`,
  pseudo: {
    signature: "n",
    baseCond: "n <= 1",
    baseValue: "n",
    recurrence: "solve(n - 1) + solve(n - 2)",
    keyExpr: "n",
    tableInit: "new Array(n + 1).fill(0)",
    tableLoop: "for (let i = 0; i <= n; i++)",
    tableBody: "dp[i] = i <= 1 ? i : dp[i - 1] + dp[i - 2]",
    answer: "dp[n]",
    optimizedInit: "let a = 0, b = 1",
    optimizedBody: "[a, b] = [b, a + b]",
    optimizedAnswer: "n === 0 ? 0 : b",
  },
  cost: { bruteTime: "O(2ⁿ)", dpTime: "O(n)", dpSpace: "O(n)", optSpace: "O(1)", recSpace: "O(n)" },
};

export const climbingStairsSpec: DpSpec = {
  slug: "climbing-stairs",
  title: "Climbing Stairs",
  group: "One dimension",
  tagline:
    "Same recurrence as Fibonacci, but derived from a real question, which is exactly how it shows up in interviews.",
  stateMeaning:
    "dp[i] is the number of distinct ways to reach step i taking 1 or 2 steps at a time.",
  formula: "dp[i] = dp[i - 1] + dp[i - 2]",
  dims: 1,
  size: ({ n }) => ({ rows: 1, cols: n + 1 }),
  target: ({ n }) => ({ row: 0, col: n }),
  label: (c) => `ways(${c.col})`,
  base: (c) =>
    c.col <= 1
      ? {
          value: 1,
          why:
            c.col === 0
              ? "there is exactly one way to already be at the bottom: do nothing."
              : "step 1 can only be reached by a single 1-step.",
        }
      : null,
  deps: (c) => [
    { cell: { row: 0, col: c.col - 1 }, label: "arrive with a 1-step" },
    { cell: { row: 0, col: c.col - 2 }, label: "arrive with a 2-step" },
  ],
  combine: (parts, c) => {
    const value = sum(parts);
    return {
      value,
      why: `The last move onto step ${c.col} was either a 1-step (${parts[0]?.value} ways) or a 2-step (${parts[1]?.value} ways), and those sets never overlap: ${value} ways.`,
    };
  },
  keep: 2,
  colLabels: ({ n }) => range(n + 1),
  answerText: (v, { n }) => `${v} distinct ways to climb ${n} steps`,
  pseudo: {
    signature: "n",
    baseCond: "n <= 1",
    baseValue: "1",
    recurrence: "solve(n - 1) + solve(n - 2)",
    keyExpr: "n",
    tableInit: "new Array(n + 1).fill(1)",
    tableLoop: "for (let i = 2; i <= n; i++)",
    tableBody: "dp[i] = dp[i - 1] + dp[i - 2]",
    answer: "dp[n]",
    optimizedInit: "let a = 1, b = 1",
    optimizedBody: "[a, b] = [b, a + b]",
    optimizedAnswer: "b",
  },
  cost: { bruteTime: "O(2ⁿ)", dpTime: "O(n)", dpSpace: "O(n)", optSpace: "O(1)", recSpace: "O(n)" },
};

/* ------------------------------------------------------- 1-D with a choice */

export const coinChangeSpec: DpSpec = {
  slug: "coin-change",
  title: "Coin Change",
  group: "One dimension, with a choice",
  tagline:
    "One branch per coin, so the brute-force tree is wide as well as deep, and a cell can be genuinely impossible.",
  stateMeaning: "dp[a] is the fewest coins that add up to exactly a (∞ when a is impossible).",
  formula: "dp[a] = 1 + min(dp[a - coin]) over every coin that fits",
  dims: 1,
  size: ({ amount }) => ({ rows: 1, cols: amount + 1 }),
  target: ({ amount }) => ({ row: 0, col: amount }),
  label: (c) => `coins(${c.col})`,
  base: (c) => (c.col === 0 ? { value: 0, why: "an amount of 0 needs no coins at all." } : null),
  deps: (c, input) =>
    input.coins
      .filter((coin) => c.col - coin >= 0)
      .map((coin) => ({ cell: { row: 0, col: c.col - coin }, label: `use a ${coin}` })),
  combine: (parts, c) => {
    const usable = parts.filter((p) => p.value !== null);
    if (usable.length === 0) {
      return {
        value: null,
        why: `No coin leads to a solvable amount from ${c.col}, so ${c.col} is impossible.`,
      };
    }
    const best = usable.reduce((b, p) => ((p.value ?? 0) < (b.value ?? 0) ? p : b));
    return {
      value: (best.value ?? 0) + 1,
      why: `The cheapest option is "${best.label}", leaving ${best.value} coins, plus the coin itself.`,
    };
  },
  keep: 1,
  colLabels: ({ amount }) => range(amount + 1),
  answerText: (v, { amount }) =>
    v === null ? `${amount} cannot be made with those coins` : `${amount} needs ${v} coins`,
  pseudo: {
    signature: "amount",
    baseCond: "amount === 0",
    baseValue: "0",
    recurrence: "1 + Math.min(...coins.map(c => solve(amount - c)))",
    keyExpr: "amount",
    tableInit: "new Array(amount + 1).fill(Infinity)",
    tableLoop: "for (let a = 1; a <= amount; a++) for (const c of coins)",
    tableBody: "if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1)",
    answer: "dp[amount]",
    optimizedInit: "// dp[a] only reads a - maxCoin .. a - 1",
    optimizedBody: "dp[a] = Math.min(dp[a], dp[a - c] + 1)",
    optimizedAnswer: "dp[amount]",
  },
  cost: {
    bruteTime: "O(cᵃ)",
    dpTime: "O(amount × coins)",
    dpSpace: "O(amount)",
    optSpace: "O(maxCoin)",
    recSpace: "O(amount)",
  },
};

export const houseRobberSpec: DpSpec = {
  slug: "house-robber",
  title: "House Robber",
  group: "One dimension, with a choice",
  tagline:
    "Take it or skip it: the first problem where the recurrence is a decision rather than a formula.",
  stateMeaning:
    "dp[k] is the most money you can take from the first k houses without robbing two neighbours.",
  formula: "dp[k] = max(dp[k - 1], dp[k - 2] + house[k - 1])",
  dims: 1,
  size: ({ houses }) => ({ rows: 1, cols: houses.length + 1 }),
  target: ({ houses }) => ({ row: 0, col: houses.length }),
  label: (c) => `best(${c.col})`,
  base: (c, input) => {
    if (c.col === 0) return { value: 0, why: "with no houses there is nothing to take." };
    if (c.col === 1)
      return { value: input.houses[0] ?? 0, why: "with one house the only choice is to rob it." };
    return null;
  },
  deps: (c) => [
    { cell: { row: 0, col: c.col - 1 }, label: "skip" },
    { cell: { row: 0, col: c.col - 2 }, label: "rob" },
  ],
  combine: (parts, c, input) => {
    const money = input.houses[c.col - 1] ?? 0;
    const skip = parts[0]?.value ?? 0;
    const rob = (parts[1]?.value ?? 0) + money;
    const value = Math.max(skip, rob);
    return {
      value,
      why: `Skip house ${c.col} and keep ${skip}, or rob it for ${money} on top of ${parts[1]?.value} = ${rob}. The better choice is ${value}.`,
    };
  },
  keep: 2,
  colLabels: ({ houses }) => range(houses.length + 1),
  answerText: (v) => `${v} is the maximum you can take`,
  pseudo: {
    signature: "k",
    baseCond: "k <= 1",
    baseValue: "k === 0 ? 0 : house[0]",
    recurrence: "Math.max(solve(k - 1), solve(k - 2) + house[k - 1])",
    keyExpr: "k",
    tableInit: "new Array(n + 1).fill(0)",
    tableLoop: "for (let k = 2; k <= n; k++)",
    tableBody: "dp[k] = Math.max(dp[k - 1], dp[k - 2] + house[k - 1])",
    answer: "dp[n]",
    optimizedInit: "let prev = 0, cur = house[0]",
    optimizedBody: "[prev, cur] = [cur, Math.max(cur, prev + house[k - 1])]",
    optimizedAnswer: "cur",
  },
  cost: { bruteTime: "O(2ⁿ)", dpTime: "O(n)", dpSpace: "O(n)", optSpace: "O(1)", recSpace: "O(n)" },
};

/* --------------------------------------------------------------- 2-D tables */

export const knapsackSpec: DpSpec = {
  slug: "knapsack",
  title: "0/1 Knapsack",
  group: "Two dimensions",
  tagline:
    "Two things vary at once (which items are left and how much room is left), so one number is no longer enough state.",
  stateMeaning: "dp[i][w] is the best value using only the first i items with a bag that holds w.",
  formula: "dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w - weight[i]])",
  dims: 2,
  size: ({ weights }) => ({ rows: weights.length + 1, cols: 0 }),
  target: ({ weights, capacity }) => ({ row: weights.length, col: capacity }),
  label: (c) => `dp(${c.row},${c.col})`,
  base: (c) =>
    c.row === 0
      ? { value: 0, why: "with no items considered the value is 0 for any capacity." }
      : null,
  deps: (c, input) => {
    const weight = input.weights[c.row - 1] ?? 0;
    const list = [{ cell: { row: c.row - 1, col: c.col }, label: "skip" }];
    if (weight <= c.col)
      list.push({ cell: { row: c.row - 1, col: c.col - weight }, label: "take" });
    return list;
  },
  combine: (parts, c, input) => {
    const weight = input.weights[c.row - 1] ?? 0;
    const worth = input.values[c.row - 1] ?? 0;
    const skip = parts.find((p) => p.label === "skip")?.value ?? 0;
    const takePart = parts.find((p) => p.label === "take");
    if (!takePart) {
      return {
        value: skip,
        why: `Item ${c.row} weighs ${weight}, which does not fit in ${c.col}, so the only option is to skip it and keep ${skip}.`,
      };
    }
    const take = (takePart.value ?? 0) + worth;
    const value = Math.max(skip, take);
    return {
      value,
      why: `Skip item ${c.row} for ${skip}, or take it: ${worth} plus the best of the remaining capacity ${c.col - weight} (${takePart.value}) = ${take}. Better is ${value}.`,
    };
  },
  keep: 1,
  rowLabels: ({ weights, values }) => [
    "none",
    ...weights.map((w, i) => `w${w}/v${values[i] ?? 0}`),
  ],
  colLabels: ({ capacity }) => range(capacity + 1),
  answerText: (v, { capacity }) => `the best value for a bag of capacity ${capacity} is ${v}`,
  pseudo: {
    signature: "i, w",
    baseCond: "i === 0",
    baseValue: "0",
    recurrence: "Math.max(solve(i - 1, w), value[i - 1] + solve(i - 1, w - weight[i - 1]))",
    keyExpr: "`${i},${w}`",
    tableInit: "grid(n + 1, cap + 1)",
    tableLoop: "for (let i = 1; i <= n; i++) for (let w = 0; w <= cap; w++)",
    tableBody: "dp[i][w] = best(skip, take)",
    answer: "dp[n][cap]",
    optimizedInit: "let row = new Array(cap + 1).fill(0)",
    optimizedBody:
      "for (let w = cap; w >= weight[i - 1]; w--) row[w] = Math.max(row[w], value[i - 1] + row[w - weight[i - 1]])",
    optimizedAnswer: "row[cap]",
  },
  cost: {
    bruteTime: "O(2ⁿ)",
    dpTime: "O(n × cap)",
    dpSpace: "O(n × cap)",
    optSpace: "O(cap)",
    recSpace: "O(n)",
  },
};

export const lcsSpec: DpSpec = {
  slug: "lcs",
  title: "Longest Common Subsequence",
  group: "Two dimensions",
  tagline:
    "Two strings, two indexes. Match and both move; mismatch and you try dropping one character from each side.",
  stateMeaning:
    "dp[i][j] is the length of the longest common subsequence of the first i characters of A and the first j of B.",
  formula: "match → dp[i-1][j-1] + 1, otherwise max(dp[i-1][j], dp[i][j-1])",
  dims: 2,
  size: ({ a, b }) => ({ rows: a.length + 1, cols: b.length + 1 }),
  target: ({ a, b }) => ({ row: a.length, col: b.length }),
  label: (c) => `dp(${c.row},${c.col})`,
  base: (c) =>
    c.row === 0 || c.col === 0
      ? { value: 0, why: "an empty string shares nothing with anything." }
      : null,
  deps: (c, input) => {
    const same = input.a[c.row - 1] === input.b[c.col - 1];
    if (same) return [{ cell: { row: c.row - 1, col: c.col - 1 }, label: "match" }];
    return [
      { cell: { row: c.row - 1, col: c.col }, label: "drop from A" },
      { cell: { row: c.row, col: c.col - 1 }, label: "drop from B" },
    ];
  },
  combine: (parts, c, input) => {
    const ca = input.a[c.row - 1];
    const cb = input.b[c.col - 1];
    if (parts.length === 1) {
      const value = (parts[0]?.value ?? 0) + 1;
      return {
        value,
        why: `"${ca}" and "${cb}" match, so both strings advance and the subsequence grows: ${parts[0]?.value} + 1 = ${value}.`,
      };
    }
    const left = parts[0]?.value ?? 0;
    const right = parts[1]?.value ?? 0;
    const value = Math.max(left, right);
    return {
      value,
      why: `"${ca}" ≠ "${cb}", so try dropping "${ca}" (${left}) or dropping "${cb}" (${right}) and keep the better: ${value}.`,
    };
  },
  keep: 1,
  rowLabels: ({ a }) => chars(a),
  colLabels: ({ b }) => chars(b),
  answerText: (v) => `the longest common subsequence has length ${v}`,
  pseudo: {
    signature: "i, j",
    baseCond: "i === 0 || j === 0",
    baseValue: "0",
    recurrence: "a[i-1] === b[j-1] ? solve(i-1, j-1) + 1 : Math.max(solve(i-1, j), solve(i, j-1))",
    keyExpr: "`${i},${j}`",
    tableInit: "grid(a.length + 1, b.length + 1)",
    tableLoop: "for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)",
    tableBody: "dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])",
    answer: "dp[a.length][b.length]",
    optimizedInit: "let prev = new Array(b.length + 1).fill(0), cur = prev.slice()",
    optimizedBody: "cur[j] = a[i-1] === b[j-1] ? prev[j-1] + 1 : Math.max(prev[j], cur[j-1])",
    optimizedAnswer: "cur[b.length]",
  },
  cost: {
    bruteTime: "O(2^(m+n))",
    dpTime: "O(m × n)",
    dpSpace: "O(m × n)",
    optSpace: "O(n)",
    recSpace: "O(m + n)",
  },
};

/* -------------------------------------------------------------------- grids */

export const uniquePathsSpec: DpSpec = {
  slug: "unique-paths",
  title: "Unique Paths",
  group: "Grid",
  tagline: "The grid is the table: the clearest possible picture of what a DP cell means.",
  stateMeaning: "dp[r][c] is the number of ways to reach cell (r, c) moving only right or down.",
  formula: "dp[r][c] = dp[r-1][c] + dp[r][c-1]",
  dims: 2,
  size: ({ rows, cols }) => ({ rows, cols }),
  target: ({ rows, cols }) => ({ row: rows - 1, col: cols - 1 }),
  label: (c) => `dp(${c.row},${c.col})`,
  base: (c) =>
    c.row === 0 || c.col === 0
      ? {
          value: 1,
          why: "cells on the top row or left column can only be reached one way: straight along the edge.",
        }
      : null,
  deps: (c) => [
    { cell: { row: c.row - 1, col: c.col }, label: "arrive from above" },
    { cell: { row: c.row, col: c.col - 1 }, label: "arrive from the left" },
  ],
  combine: (parts, c) => {
    const value = sum(parts);
    return {
      value,
      why: `Every path into (${c.row}, ${c.col}) arrives from above (${parts[0]?.value} paths) or from the left (${parts[1]?.value} paths): ${value}.`,
    };
  },
  keep: 1,
  rowLabels: ({ rows }) => range(rows),
  colLabels: ({ cols }) => range(cols),
  answerText: (v, { rows, cols }) => `${v} unique paths across a ${rows}×${cols} grid`,
  pseudo: {
    signature: "r, c",
    baseCond: "r === 0 || c === 0",
    baseValue: "1",
    recurrence: "solve(r - 1, c) + solve(r, c - 1)",
    keyExpr: "`${r},${c}`",
    tableInit: "grid(rows, cols)",
    tableLoop: "for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)",
    tableBody: "dp[r][c] = r === 0 || c === 0 ? 1 : dp[r-1][c] + dp[r][c-1]",
    answer: "dp[rows - 1][cols - 1]",
    optimizedInit: "let row = new Array(cols).fill(1)",
    optimizedBody: "row[c] += row[c - 1]",
    optimizedAnswer: "row[cols - 1]",
  },
  cost: {
    bruteTime: "O(2^(m+n))",
    dpTime: "O(m × n)",
    dpSpace: "O(m × n)",
    optSpace: "O(cols)",
    recSpace: "O(m + n)",
  },
};

export const minPathSumSpec: DpSpec = {
  slug: "min-path-sum",
  title: "Minimum Path Sum",
  group: "Grid",
  tagline:
    "Same grid, but now each cell has a cost, so the table holds best-so-far totals instead of counts.",
  stateMeaning:
    "dp[r][c] is the cheapest total cost of any path from the top-left corner to (r, c).",
  formula: "dp[r][c] = cost[r][c] + min(dp[r-1][c], dp[r][c-1])",
  dims: 2,
  size: ({ grid }) => ({ rows: grid.length, cols: grid[0]?.length ?? 0 }),
  target: ({ grid }) => ({ row: grid.length - 1, col: (grid[0]?.length ?? 1) - 1 }),
  label: (c) => `dp(${c.row},${c.col})`,
  base: (c, input) =>
    c.row === 0 && c.col === 0
      ? {
          value: input.grid[0]?.[0] ?? 0,
          why: "the start cell costs exactly its own value.",
        }
      : null,
  deps: (c) => {
    const list: { cell: { row: number; col: number }; label: string }[] = [];
    if (c.row > 0) list.push({ cell: { row: c.row - 1, col: c.col }, label: "come from above" });
    if (c.col > 0) list.push({ cell: { row: c.row, col: c.col - 1 }, label: "come from the left" });
    return list;
  },
  combine: (parts, c, input) => {
    const cost = input.grid[c.row]?.[c.col] ?? 0;
    const usable = parts.filter((p) => p.value !== null);
    const best = usable.reduce((b, p) => ((p.value ?? 0) < (b.value ?? 0) ? p : b));
    const value = (best.value ?? 0) + cost;
    return {
      value,
      why: `The cheapest way in is "${best.label}" at ${best.value}, and this cell costs ${cost}: ${value}.`,
    };
  },
  keep: 1,
  rowLabels: ({ grid }) => grid.map((_, i) => String(i)),
  colLabels: ({ grid }) => range(grid[0]?.length ?? 0),
  answerText: (v) => `the cheapest path costs ${v}`,
  pseudo: {
    signature: "r, c",
    baseCond: "r === 0 && c === 0",
    baseValue: "cost[0][0]",
    recurrence: "cost[r][c] + Math.min(solve(r - 1, c), solve(r, c - 1))",
    keyExpr: "`${r},${c}`",
    tableInit: "grid(rows, cols)",
    tableLoop: "for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)",
    tableBody: "dp[r][c] = cost[r][c] + Math.min(up, left)",
    answer: "dp[rows - 1][cols - 1]",
    optimizedInit: "let row = new Array(cols).fill(Infinity)",
    optimizedBody: "row[c] = cost[r][c] + Math.min(row[c], row[c - 1])",
    optimizedAnswer: "row[cols - 1]",
  },
  cost: {
    bruteTime: "O(2^(m+n))",
    dpTime: "O(m × n)",
    dpSpace: "O(m × n)",
    optSpace: "O(cols)",
    recSpace: "O(m + n)",
  },
};

/** Knapsack's column count depends on capacity, filled in here to keep the spec tidy. */
knapsackSpec.size = ({ weights, capacity }) => ({ rows: weights.length + 1, cols: capacity + 1 });

export const DP_SPECS: DpSpec[] = [
  fibonacciSpec,
  climbingStairsSpec,
  coinChangeSpec,
  houseRobberSpec,
  knapsackSpec,
  lcsSpec,
  uniquePathsSpec,
  minPathSumSpec,
];
