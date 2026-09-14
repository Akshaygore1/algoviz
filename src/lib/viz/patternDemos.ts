import type { PatternId } from "@/data/patterns";
import { validAnagram, twoSum } from "@/lib/viz/problems/arraysHashing";
import { binarySearch } from "@/lib/viz/problems/binarySearchProblems";
import { reverseList, mergeTwoLists, linkedListCycle } from "@/lib/viz/problems/linkedList";
import { longestUniqueSubstring } from "@/lib/viz/problems/slidingWindow";
import { validPalindrome } from "@/lib/viz/problems/twoPointers";
import { dailyTemperatures, minStack, validParentheses } from "@/lib/viz/problems/stack";
import {
  fillCells,
  toNum,
  toNums,
  type ProblemDefinition,
  type ProblemStep,
  type ProblemVizState,
  type VizGraph,
} from "@/lib/viz/problemState";
import type { CellState } from "@/lib/viz/types";

type S = ProblemVizState;

const O = (
  timeBest: string,
  timeAverage: string,
  timeWorst: string,
  space: string,
  plainEnglish: string,
) => ({ timeBest, timeAverage, timeWorst, space, plainEnglish });

interface ParsedGraph {
  nodes: string[];
  edges: { from: string; to: string; directed: boolean }[];
  adjacency: Map<string, string[]>;
}

function parseGraph(raw: string | undefined, directed: boolean): ParsedGraph {
  const nodes: string[] = [];
  const nodeSet = new Set<string>();
  const edges: ParsedGraph["edges"] = [];
  const adjacency = new Map<string, string[]>();
  const addNode = (node: string) => {
    const clean = node.trim();
    if (!clean || nodeSet.has(clean)) return;
    nodeSet.add(clean);
    nodes.push(clean);
    adjacency.set(clean, []);
  };

  for (const token of (raw ?? "")
    .split(/[\s,;]+/)
    .filter(Boolean)
    .slice(0, 24)) {
    const match = token.match(/^(.+?)(?:->|>|-)(.+)$/);
    if (!match) continue;
    const from = match[1]!.trim();
    const to = match[2]!.trim();
    if (!from || !to) continue;
    addNode(from);
    addNode(to);
    edges.push({ from, to, directed });
    adjacency.get(from)!.push(to);
    if (!directed) {
      adjacency.get(to)!.push(from);
    }
  }

  return { nodes, edges, adjacency };
}

function graphState(
  graph: ParsedGraph,
  nodeStates: Record<string, CellState> = {},
  edgeStates: Record<string, CellState> = {},
  extra: Pick<VizGraph, "queue" | "stack"> = {},
): VizGraph {
  return {
    label: graph.edges.some((edge) => edge.directed) ? "Directed graph" : "Graph",
    nodes: graph.nodes.map((id) => ({
      id,
      label: id,
      state: nodeStates[id] ?? "default",
    })),
    edges: graph.edges.map((edge) => ({
      ...edge,
      state: edgeStates[`${edge.from}->${edge.to}`] ?? "default",
    })),
    ...extra,
  };
}

function graphFallback(message: string): ProblemStep[] {
  return [
    {
      id: 0,
      type: "complete",
      description: message,
      highlightedCodeLines: [],
      variables: {},
      state: { notes: [message] },
    },
  ];
}

/* ---------------------------------------------------------- Prefix Sum */

const rangeSum: ProblemDefinition = {
  slug: "range-sum-query",
  title: "Range Sum Query",
  difficulty: "Easy",
  pattern: "Cumulative prefix totals",
  tagline:
    "Build one cumulative row, then answer any inclusive range with a subtraction instead of rescanning the values.",
  insight:
    "The extra empty-prefix slot makes every range use the same formula: prefix[right + 1] − prefix[left].",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "Build the cumulative row once; every later range query is one subtraction.",
  ),
  code: [
    "function rangeSum(nums, left, right) {",
    "  const prefix = [0];",
    "  for (const n of nums) {",
    "    prefix.push(prefix.at(-1) + n);",
    "  }",
    "  return prefix[right + 1] - prefix[left];",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "3 1 4 1 5 9",
      presets: [
        { label: "Classic", value: "3 1 4 1 5 9" },
        { label: "Negatives", value: "2 -1 3 -2 4" },
      ],
    },
    { kind: "number", key: "left", label: "left", min: 0, max: 11 },
    { kind: "number", key: "right", label: "right", min: 0, max: 11 },
  ],
  defaults: { nums: "3 1 4 1 5 9", left: "1", right: "4" },
  generate: ({ nums: raw, left: rawLeft, right: rawRight }) => {
    const nums = toNums(raw, 12);
    if (nums.length === 0) return graphFallback("Add at least one number to build a prefix row.");
    const left = Math.max(0, Math.min(nums.length - 1, Math.floor(toNum(rawLeft, 0))));
    const right = Math.max(
      left,
      Math.min(nums.length - 1, Math.floor(toNum(rawRight, nums.length - 1))),
    );
    const prefix = [0];
    const rec = { steps: [] as ProblemStep[] };
    const push = (
      type: ProblemStep["type"],
      description: string,
      highlightedCodeLines: number[],
      variables: Record<string, string | number | boolean | null>,
      values: number[],
      prefixValues: number[],
      cells: CellState[],
      prefixCells: CellState[],
      output?: string,
    ) => {
      rec.steps.push({
        id: rec.steps.length,
        type,
        description,
        highlightedCodeLines,
        variables,
        state: {
          rows: [
            { label: "nums", values, cells, pointers: { left, right } },
            { label: "prefix", values: prefixValues, cells: prefixCells, showIndex: true },
          ],
          notes: [`sum(${left}..${right}) = prefix[${right + 1}] − prefix[${left}]`],
          ...(output ? { output } : {}),
        },
      });
    };

    push(
      "highlight",
      "Start with an empty-prefix entry at index 0. It represents the sum before the array begins.",
      [2],
      { left, right },
      nums,
      prefix,
      fillCells(nums.length),
      ["inspect"],
    );

    for (let i = 0; i < nums.length; i++) {
      prefix.push(prefix[i]! + nums[i]!);
      const numsCells = fillCells(nums.length);
      numsCells[i] = "visited";
      const prefixCells = fillCells(prefix.length);
      prefixCells[prefix.length - 1] = "inspect";
      push(
        "update",
        `Add nums[${i}] (${nums[i]}) to the running total. prefix[${i + 1}] is now ${prefix[i + 1]}.`,
        [3, 4],
        { index: i, total: prefix[i + 1]! },
        nums,
        prefix,
        numsCells,
        prefixCells,
      );
    }

    const answer = prefix[right + 1]! - prefix[left]!;
    const doneNums = nums.map((_, i) =>
      i >= left && i <= right ? "success" : ("done" as CellState),
    );
    push(
      "complete",
      `Subtract prefix[${right + 1}] (${prefix[right + 1]}) − prefix[${left}] (${prefix[left]}) = ${answer}.`,
      [6],
      { left, right, result: answer },
      nums,
      prefix,
      doneNums,
      prefix.map(() => "done" as CellState),
      `rangeSum = ${answer}`,
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------ Breadth-first search */

const bfsShortestPath: ProblemDefinition = {
  slug: "bfs-shortest-path",
  title: "Shortest Path in an Unweighted Graph",
  difficulty: "Easy",
  pattern: "Queue frontier, level by level",
  tagline:
    "A queue explores the closest frontier first, so the first time the target is reached is the shortest path in an unweighted graph.",
  insight:
    "Mark a node when you enqueue it. That prevents duplicate work and guarantees its parent is the shortest-path parent.",
  language: "JavaScript",
  complexity: O(
    "O(V + E)",
    "O(V + E)",
    "O(V + E)",
    "O(V)",
    "Every node and edge is inspected at most once.",
  ),
  code: [
    "const queue = [start];",
    "seen.add(start);",
    "while (queue.length) {",
    "  const node = queue.shift();",
    "  for (const next of graph[node]) {",
    "    if (seen.has(next)) continue;",
    "    seen.add(next); queue.push(next);",
    "  }",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "edges",
      label: "edges (A-B)",
      placeholder: "A-B A-C B-D C-D D-E",
      presets: [
        { label: "Shortest path", value: "A-B A-C B-D C-D D-E" },
        { label: "Two components", value: "A-B B-C D-E" },
      ],
    },
    { kind: "text", key: "start", label: "start", placeholder: "A" },
    { kind: "text", key: "target", label: "target", placeholder: "E" },
  ],
  defaults: { edges: "A-B A-C B-D C-D D-E", start: "A", target: "E" },
  generate: ({ edges: rawEdges, start: rawStart, target: rawTarget }) => {
    const graph = parseGraph(rawEdges, false);
    if (graph.nodes.length === 0)
      return graphFallback("Add edges such as A-B or A-C to build a graph.");
    const start = graph.nodes.includes((rawStart ?? "").trim())
      ? (rawStart ?? "").trim()
      : graph.nodes[0]!;
    const target = graph.nodes.includes((rawTarget ?? "").trim())
      ? (rawTarget ?? "").trim()
      : graph.nodes.at(-1)!;
    const rec = { steps: [] as ProblemStep[] };
    const seen = new Set([start]);
    const queue = [start];
    const parent = new Map<string, string | null>([[start, null]]);
    const nodeStates: Record<string, CellState> = { [start]: "inspect" };
    const edgeStates: Record<string, CellState> = {};
    const push = (
      type: ProblemStep["type"],
      description: string,
      variables: Record<string, string | number | boolean | null>,
    ) => {
      rec.steps.push({
        id: rec.steps.length,
        type,
        description,
        highlightedCodeLines: [1, 2, 3, 4, 5, 6, 7, 8],
        variables,
        state: {
          graph: graphState(graph, nodeStates, edgeStates, { queue: [...queue] }),
          notes: [`start = ${start}`, `target = ${target}`],
        },
      });
    };
    push(
      "highlight",
      `Start at ${start}. Mark it before enqueueing so it cannot enter the queue twice.`,
      { queue: queue.length },
    );

    while (queue.length > 0) {
      const node = queue.shift()!;
      nodeStates[node] = "inspect";
      push("visit", `Dequeue ${node}. Its neighbours are the next frontier to inspect.`, {
        node,
        queue: queue.length,
      });
      if (node === target) break;
      for (const next of graph.adjacency.get(node) ?? []) {
        const key = graph.edges.some((edge) => edge.from === node && edge.to === next)
          ? `${node}->${next}`
          : `${next}->${node}`;
        if (seen.has(next)) {
          edgeStates[key] = "eliminated";
          continue;
        }
        seen.add(next);
        parent.set(next, node);
        queue.push(next);
        nodeStates[next] = "visited";
        edgeStates[key] = "success";
        push(
          "insert",
          `Enqueue ${next}; it is the first route to reach that node, so its parent is ${node}.`,
          { node: next, parent: node, queue: queue.length },
        );
      }
      nodeStates[node] = node === target ? "success" : "done";
    }

    const path: string[] = [];
    if (seen.has(target)) {
      for (let node: string | null = target; node; node = parent.get(node) ?? null)
        path.unshift(node);
    }
    Object.keys(nodeStates).forEach((node) => {
      nodeStates[node] = path.includes(node) ? "success" : "done";
    });
    push(
      "complete",
      path.length > 0
        ? `The first route to ${target} is shortest: ${path.join(" → ")}.`
        : `${target} is unreachable from ${start}.`,
      { distance: path.length > 0 ? path.length - 1 : -1 },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------ Depth-first search */

const dfsComponents: ProblemDefinition = {
  slug: "dfs-components",
  title: "Connected Components",
  difficulty: "Easy",
  pattern: "Depth-first exploration",
  tagline:
    "Follow one branch as far as it goes, then backtrack. Starting a new DFS only when a node is still unseen counts the connected components.",
  insight:
    "The visited set is the invariant: it stops cycles from recursing forever and ensures every node is assigned to exactly one component.",
  language: "JavaScript",
  complexity: O(
    "O(V + E)",
    "O(V + E)",
    "O(V + E)",
    "O(V)",
    "Each node and edge is explored once across all DFS calls.",
  ),
  code: [
    "for (const node of nodes) {",
    "  if (seen.has(node)) continue;",
    "  const stack = [node];",
    "  while (stack.length) {",
    "    const cur = stack.pop(); seen.add(cur);",
    "    for (const next of graph[cur]) stack.push(next);",
    "  }",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "edges",
      label: "edges (A-B)",
      placeholder: "A-B A-C B-D C-E D-F E-F",
      presets: [
        { label: "One component", value: "A-B A-C B-D C-E D-F E-F" },
        { label: "Three components", value: "A-B C-D E-F" },
      ],
    },
  ],
  defaults: { edges: "A-B A-C B-D C-E D-F E-F" },
  generate: ({ edges: rawEdges }) => {
    const graph = parseGraph(rawEdges, false);
    if (graph.nodes.length === 0)
      return graphFallback("Add edges such as A-B or A-C to build a graph.");
    const rec = { steps: [] as ProblemStep[] };
    const seen = new Set<string>();
    const nodeStates: Record<string, CellState> = {};
    const edgeStates: Record<string, CellState> = {};
    const stack: string[] = [];
    let components = 0;
    const push = (
      type: ProblemStep["type"],
      description: string,
      variables: Record<string, string | number | boolean | null>,
    ) => {
      rec.steps.push({
        id: rec.steps.length,
        type,
        description,
        highlightedCodeLines: [1, 2, 3, 4, 5, 6, 7, 8],
        variables,
        state: {
          graph: graphState(graph, nodeStates, edgeStates, { stack: [...stack] }),
          notes: [`components = ${components}`],
        },
      });
    };
    push(
      "highlight",
      "Scan the node list. An unseen node starts a new component and a fresh DFS stack.",
      { components },
    );

    for (const start of graph.nodes) {
      if (seen.has(start)) continue;
      components++;
      stack.push(start);
      nodeStates[start] = "inspect";
      push("insert", `Start component ${components} at ${start}.`, {
        component: components,
        node: start,
      });
      while (stack.length) {
        const node = stack.pop()!;
        if (seen.has(node)) continue;
        seen.add(node);
        nodeStates[node] = "success";
        push(
          "visit",
          `Visit ${node}; push each unseen neighbour so DFS can follow this branch deeply.`,
          { node, stack: stack.length },
        );
        for (const next of graph.adjacency.get(node) ?? []) {
          const key = graph.edges.some((edge) => edge.from === node && edge.to === next)
            ? `${node}->${next}`
            : `${next}->${node}`;
          edgeStates[key] = seen.has(next) ? "eliminated" : "inspect";
          if (!seen.has(next)) {
            stack.push(next);
            nodeStates[next] = "visited";
          }
        }
        nodeStates[node] = "done";
      }
    }

    push(
      "complete",
      `DFS finished: ${components} connected component${components === 1 ? "" : "s"}.`,
      { components },
    );
    return rec.steps;
  },
};

/* -------------------------------------------------------- Topological sort */

const courseSchedule: ProblemDefinition = {
  slug: "course-schedule",
  title: "Course Schedule",
  difficulty: "Medium",
  pattern: "Prerequisites → zero-indegree queue",
  tagline:
    "A course can enter the queue only after every prerequisite has been removed. If nodes remain after the queue empties, the prerequisites contain a cycle.",
  insight:
    "Indegree is the compact state that tells you how many prerequisites are still blocking each course.",
  language: "JavaScript",
  complexity: O(
    "O(V + E)",
    "O(V + E)",
    "O(V + E)",
    "O(V)",
    "Each prerequisite edge is removed exactly once.",
  ),
  code: [
    "const queue = nodes.filter((n) => indegree[n] === 0);",
    "while (queue.length) {",
    "  const course = queue.shift(); order.push(course);",
    "  for (const next of graph[course]) {",
    "    if (--indegree[next] === 0) queue.push(next);",
    "  }",
    "}",
    "return order.length === nodes.length ? order : [];",
  ],
  fields: [
    {
      kind: "text",
      key: "edges",
      label: "prerequisites (A>B)",
      placeholder: "cook>shop shop>ship cook>pack pack>ship",
      presets: [
        { label: "Valid order", value: "cook>shop shop>ship cook>pack pack>ship" },
        { label: "Cycle", value: "A>B B>C C>A" },
      ],
    },
  ],
  defaults: { edges: "cook>shop shop>ship cook>pack pack>ship" },
  generate: ({ edges: rawEdges }) => {
    const graph = parseGraph(rawEdges, true);
    if (graph.nodes.length === 0)
      return graphFallback("Add prerequisites such as A>B to build a dependency graph.");
    const rec = { steps: [] as ProblemStep[] };
    const indegree = new Map(graph.nodes.map((node) => [node, 0]));
    for (const edge of graph.edges) indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1);
    const queue = graph.nodes.filter((node) => indegree.get(node) === 0);
    const order: string[] = [];
    const nodeStates: Record<string, CellState> = {};
    const edgeStates: Record<string, CellState> = {};
    const push = (
      type: ProblemStep["type"],
      description: string,
      variables: Record<string, string | number | boolean | null>,
    ) => {
      rec.steps.push({
        id: rec.steps.length,
        type,
        description,
        highlightedCodeLines: [1, 2, 3, 4, 5, 6, 7],
        variables,
        state: {
          graph: graphState(graph, nodeStates, edgeStates, { queue: [...queue] }),
          panels: [
            {
              label: "indegree",
              entries: graph.nodes.map((node) => ({
                key: node,
                value: String(indegree.get(node) ?? 0),
                state: queue.includes(node) ? ("inspect" as CellState) : undefined,
              })),
            },
          ],
          notes: [`order = [${order.join(", ")}]`],
        },
      });
    };
    push("highlight", "Only courses with zero remaining prerequisites can start the schedule.", {
      available: queue.length,
    });

    while (queue.length) {
      const course = queue.shift()!;
      order.push(course);
      nodeStates[course] = "success";
      push("visit", `Take ${course} from the queue and place it in the schedule.`, {
        course,
        scheduled: order.length,
      });
      for (const next of graph.adjacency.get(course) ?? []) {
        const key = `${course}->${next}`;
        edgeStates[key] = "done";
        indegree.set(next, (indegree.get(next) ?? 0) - 1);
        if (indegree.get(next) === 0) {
          queue.push(next);
          nodeStates[next] = "visited";
          push("insert", `${next} has no prerequisites left, so enqueue it.`, {
            course: next,
            available: queue.length,
          });
        }
      }
      nodeStates[course] = "done";
    }

    const valid = order.length === graph.nodes.length;
    push(
      valid ? "complete" : "eliminate",
      valid
        ? `Every course is scheduled: ${order.join(" → ")}.`
        : "The queue emptied before every course was scheduled: a prerequisite cycle exists.",
      { scheduled: order.length, cycle: !valid },
    );
    return rec.steps;
  },
};

/* -------------------------------------------------------------- Top K */

function heapState(heap: number[], highlight?: number): S["stacks"] {
  return [
    {
      label: "min-heap (keep k)",
      orientation: "horizontal",
      items: heap.map((value) => ({
        value,
        state: value === highlight ? ("inspect" as CellState) : ("default" as CellState),
      })),
    },
  ];
}

function siftUp(heap: number[]) {
  let i = heap.length - 1;
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (heap[p]! <= heap[i]!) break;
    [heap[p], heap[i]] = [heap[i]!, heap[p]!];
    i = p;
  }
}

function siftDown(heap: number[]) {
  let i = 0;
  while (true) {
    const left = i * 2 + 1;
    const right = left + 1;
    let smallest = i;
    if (left < heap.length && heap[left]! < heap[smallest]!) smallest = left;
    if (right < heap.length && heap[right]! < heap[smallest]!) smallest = right;
    if (smallest === i) break;
    [heap[i], heap[smallest]] = [heap[smallest]!, heap[i]!];
    i = smallest;
  }
}

const topKHeap: ProblemDefinition = {
  slug: "top-k-heap",
  title: "K Largest Elements",
  difficulty: "Medium",
  pattern: "Min-heap of size k",
  tagline:
    "Keep only the k largest values seen so far. The smallest value in the heap is the cutoff that decides whether a newcomer belongs.",
  insight:
    "The heap never grows beyond k, so each update costs O(log k) instead of sorting all n values.",
  language: "JavaScript",
  complexity: O(
    "O(n log k)",
    "O(n log k)",
    "O(n log k)",
    "O(k)",
    "Every value competes with a heap containing at most k candidates.",
  ),
  code: [
    "const heap = [];",
    "for (const x of nums) {",
    "  heap.push(x); siftUp(heap);",
    "  if (heap.length > k) {",
    "    heap[0] = heap.pop(); siftDown(heap);",
    "  }",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums",
      placeholder: "3 2 1 5 6 4",
      presets: [
        { label: "Classic", value: "3 2 1 5 6 4" },
        { label: "Duplicates", value: "5 5 4 4 3 2" },
      ],
    },
    { kind: "number", key: "k", label: "k", min: 1, max: 8 },
  ],
  defaults: { nums: "3 2 1 5 6 4", k: "2" },
  generate: ({ nums: raw, k: rawK }) => {
    const nums = toNums(raw, 16);
    if (nums.length === 0) return graphFallback("Add at least two numbers to maintain a heap.");
    const k = Math.max(1, Math.min(nums.length, Math.floor(toNum(rawK, 2))));
    const heap: number[] = [];
    const rec = { steps: [] as ProblemStep[] };
    const cells = fillCells(nums.length);
    const push = (
      type: ProblemStep["type"],
      description: string,
      variables: Record<string, string | number | boolean | null>,
      output?: string,
    ) => {
      rec.steps.push({
        id: rec.steps.length,
        type,
        description,
        highlightedCodeLines: [1, 2, 3, 4, 5, 6, 7],
        variables,
        state: {
          rows: [{ label: "input", values: nums, cells: [...cells] }],
          stacks: heapState([...heap], variables["value"] as number | undefined),
          notes: [`k = ${k}`, `cutoff = ${heap[0] ?? "—"}`],
          ...(output ? { output } : {}),
        },
      });
    };
    push(
      "highlight",
      `Read the stream once and keep a min-heap containing at most ${k} candidates.`,
      { k },
    );

    nums.forEach((value, i) => {
      cells[i] = "inspect";
      if (heap.length < k || value > heap[0]!) {
        heap.push(value);
        siftUp(heap);
        push(
          "insert",
          `${value} belongs in the current top-${k}; insert it and restore heap order.`,
          { value, index: i },
        );
        if (heap.length > k) {
          const removed = heap[0]!;
          heap[0] = heap.pop()!;
          siftDown(heap);
          push("delete", `The heap grew past k, so remove its smallest value (${removed}).`, {
            value: removed,
            index: i,
          });
        }
      } else {
        push(
          "eliminate",
          `${value} is no larger than the heap cutoff (${heap[0]}), so discard it.`,
          { value, index: i },
        );
      }
      cells[i] = heap.includes(value) ? "success" : "eliminated";
    });

    const result = [...heap].sort((a, b) => b - a);
    cells.fill("default");
    const remaining = new Map<number, number>();
    result.forEach((value) => remaining.set(value, (remaining.get(value) ?? 0) + 1));
    nums.forEach((value, i) => {
      const count = remaining.get(value) ?? 0;
      if (count > 0) {
        cells[i] = "done";
        remaining.set(value, count - 1);
      }
    });
    push(
      "complete",
      `The heap contains the ${k} largest value${k === 1 ? "" : "s"}: ${result.join(", ")}.`,
      { result: result.join(",") },
      `topK = [${result.join(", ")}]`,
    );
    return rec.steps;
  },
};

/* --------------------------------------------------------- Dynamic programming */

const climbingStairs: ProblemDefinition = {
  slug: "climbing-stairs-pattern",
  title: "Climbing Stairs",
  difficulty: "Easy",
  pattern: "One-dimensional DP table",
  tagline:
    "The number of ways to reach step i is the sum of the ways to reach the previous two steps.",
  insight:
    "The recurrence is simple; the important DP move is naming the repeated subproblem and filling its table in dependency order.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "Each table entry is computed once from two earlier entries.",
  ),
  code: [
    "const dp = [1, 1];",
    "for (let i = 2; i <= n; i++) {",
    "  dp[i] = dp[i - 1] + dp[i - 2];",
    "}",
    "return dp[n];",
  ],
  fields: [{ kind: "number", key: "n", label: "n", min: 2, max: 12 }],
  defaults: { n: "6" },
  generate: ({ n: rawN }) => {
    const n = Math.max(2, Math.min(12, Math.floor(toNum(rawN, 6))));
    const values: (number | string)[] = Array.from({ length: n + 1 }, () => "—");
    const cells = fillCells(n + 1);
    values[0] = 1;
    values[1] = 1;
    cells[0] = "done";
    cells[1] = "done";
    const rec = { steps: [] as ProblemStep[] };
    const push = (
      type: ProblemStep["type"],
      description: string,
      highlightedCodeLines: number[],
      variables: Record<string, string | number | boolean | null>,
      output?: string,
    ) => {
      rec.steps.push({
        id: rec.steps.length,
        type,
        description,
        highlightedCodeLines,
        variables,
        state: {
          rows: [{ label: "ways to reach each step", values: [...values], cells: [...cells] }],
          notes: ["dp[i] = dp[i − 1] + dp[i − 2]"],
          ...(output ? { output } : {}),
        },
      });
    };
    push(
      "highlight",
      "Seed the base cases: there is one way to stand at step 0 and one way to reach step 1.",
      [1],
      { n },
    );
    for (let i = 2; i <= n; i++) {
      values[i] = Number(values[i - 1]) + Number(values[i - 2]);
      cells[i - 1] = "inspect";
      cells[i] = "success";
      push("update", `Fill dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${values[i]}.`, [2, 3], {
        i,
        value: values[i] ?? 0,
      });
      cells[i - 1] = "done";
    }
    cells.fill("done");
    push(
      "complete",
      `There are ${values[n]} ways to climb ${n} steps.`,
      [5],
      { n, result: Number(values[n]) },
      `climbingStairs = ${values[n]}`,
    );
    return rec.steps;
  },
};

export interface PatternDemoDefinition {
  example: string;
  route?: string;
  definition: ProblemDefinition;
}

export const PATTERN_DEMOS: Record<PatternId, PatternDemoDefinition> = {
  "hash-lookup": { example: "Two Sum", route: "/problems/arrays-hashing", definition: twoSum },
  "frequency-map": {
    example: "Valid Anagram",
    route: "/problems/arrays-hashing",
    definition: validAnagram,
  },
  "two-pointers": {
    example: "Valid Palindrome",
    route: "/problems/two-pointers",
    definition: validPalindrome,
  },
  "sliding-window": {
    example: "Longest Substring Without Repeating Characters",
    route: "/problems/sliding-window",
    definition: longestUniqueSubstring,
  },
  "binary-search": {
    example: "Binary Search",
    route: "/problems/binary-search",
    definition: binarySearch,
  },
  "fast-slow": {
    example: "Linked List Cycle",
    route: "/problems/linked-list",
    definition: linkedListCycle,
  },
  "prefix-sum": {
    example: "Range Sum Query",
    route: "/problems/arrays-hashing",
    definition: rangeSum,
  },
  "stack-matching": {
    example: "Valid Parentheses",
    route: "/problems/stack",
    definition: validParentheses,
  },
  "auxiliary-stack": { example: "Min Stack", route: "/problems/stack", definition: minStack },
  "monotonic-stack": {
    example: "Daily Temperatures",
    route: "/problems/stack",
    definition: dailyTemperatures,
  },
  "pointer-rewiring": {
    example: "Reverse Linked List",
    route: "/problems/linked-list",
    definition: reverseList,
  },
  merge: {
    example: "Merge Two Sorted Lists",
    route: "/problems/linked-list",
    definition: mergeTwoLists,
  },
  bfs: { example: "Shortest Path in an Unweighted Graph", definition: bfsShortestPath },
  "topological-sort": { example: "Course Schedule", definition: courseSchedule },
  dfs: { example: "Connected Components", definition: dfsComponents },
  "top-k": { example: "K Largest Elements", route: "/visualizers/heap", definition: topKHeap },
  dp: {
    example: "Climbing Stairs",
    route: "/visualizers/dynamic-programming",
    definition: climbingStairs,
  },
};

export type { ProblemStep };
