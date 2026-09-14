import { createRecorder } from "../recorder";
import type { TreeNodeViz, TreeVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface TreeInput {
  values: number[];
  value?: number;
}

type Def = AlgorithmDefinition<TreeVizState, TreeInput>;
type Nodes = Record<string, TreeNodeViz>;

/** Builds a BST by inserting values in order. Duplicates are ignored. */
export function buildBST(values: number[]): { nodes: Nodes; rootId: string | null } {
  const nodes: Nodes = {};
  let rootId: string | null = null;
  let next = 0;

  for (const value of values) {
    const id = `n${next++}`;
    const node: TreeNodeViz = { id, value, left: null, right: null, state: "default" };
    if (!rootId) {
      nodes[id] = node;
      rootId = id;
      continue;
    }
    let currentId: string = rootId;
    for (;;) {
      const current = nodes[currentId]!;
      if (value === current.value) break;
      if (value < current.value) {
        if (current.left === null) {
          nodes[currentId] = { ...current, left: id };
          nodes[id] = node;
          break;
        }
        currentId = current.left;
      } else {
        if (current.right === null) {
          nodes[currentId] = { ...current, right: id };
          nodes[id] = node;
          break;
        }
        currentId = current.right;
      }
    }
  }
  return { nodes, rootId };
}

const reset = (nodes: Nodes, state: CellState = "default"): Nodes =>
  Object.fromEntries(Object.entries(nodes).map(([id, n]) => [id, { ...n, state }]));

const mark = (nodes: Nodes, marks: Record<string, CellState>): Nodes =>
  Object.fromEntries(
    Object.entries(nodes).map(([id, n]) => [id, { ...n, state: marks[id] ?? "default" }]),
  );

/* ------------------------------------------------------------- BST insert */

export const bstInsert: Def = {
  slug: "bst-insert",
  title: "BST insert",
  tagline:
    "Every comparison at a node throws away one whole subtree. That is the BST promise: search, insert and delete all follow a single root-to-leaf path.",
  language: "JavaScript",
  code: [
    "function insert(root, value) {",
    "  if (root === null) return new Node(value);",
    "  if (value < root.value) {",
    "    root.left = insert(root.left, value);",
    "  } else if (value > root.value) {",
    "    root.right = insert(root.right, value);",
    "  }",
    "  return root;",
    "}",
  ],
  complexity: {
    timeBest: "O(log n)",
    timeAverage: "O(log n)",
    timeWorst: "O(n)",
    space: "O(h)",
    plainEnglish:
      "Each step halves the remaining tree when the tree is balanced, giving log n. Insert sorted values and the tree degenerates into a linked list; that O(n) worst case is exactly why AVL and red-black trees exist.",
  },
  generate: ({ values, value = 0 }) => {
    const r = createRecorder<TreeVizState>();
    const built = buildBST(values);
    const nodes = built.nodes;
    const path: string[] = [];

    r.push(
      "highlight",
      `Inserting ${value}. Start at the root: everything smaller goes left, everything larger goes right.`,
      [1],
      { value, depth: 0 },
      { nodes: reset(nodes), rootId: built.rootId, counters: { comparisons: 0 } },
    );

    let currentId = built.rootId;
    let depth = 0;
    while (currentId) {
      const current = nodes[currentId]!;
      path.push(currentId);
      const goLeft = value < current.value;
      const marks: Record<string, CellState> = {};
      path.slice(0, -1).forEach((id) => (marks[id] = "visited"));
      marks[currentId] = "compare";
      r.push(
        "compare",
        value === current.value
          ? `${value} is already in the tree, so nothing to do: a BST holds no duplicates.`
          : `${value} is ${goLeft ? "smaller" : "larger"} than ${current.value}, so it must live in the ${goLeft ? "left" : "right"} subtree. The entire ${goLeft ? "right" : "left"} side is now irrelevant.`,
        goLeft ? [3, 4] : [5, 6],
        { comparing: current.value, value, direction: goLeft ? "left" : "right", depth },
        { nodes: mark(nodes, marks), rootId: built.rootId, counters: { comparisons: depth + 1 } },
      );
      if (value === current.value) return r.steps;
      const nextId = goLeft ? current.left : current.right;
      if (nextId === null) {
        const newId = "new";
        const updated: Nodes = {
          ...mark(nodes, Object.fromEntries(path.map((id) => [id, "visited" as CellState]))),
          [currentId]: {
            ...current,
            state: "visited",
            ...(goLeft ? { left: newId } : { right: newId }),
          },
          [newId]: { id: newId, value, left: null, right: null, state: "success" },
        };
        r.push(
          "insert",
          `${current.value} has no ${goLeft ? "left" : "right"} child, so ${value} becomes a new leaf here. We compared it against ${depth + 1} node(s), the height of the path, not the size of the tree.`,
          [2],
          { inserted: value, comparisons: depth + 1 },
          { nodes: updated, rootId: built.rootId, counters: { comparisons: depth + 1 } },
        );
        r.push(
          "complete",
          `The BST property still holds everywhere: for every node, the whole left subtree is smaller and the whole right subtree is larger. Reading it in-order gives sorted values.`,
          [8],
          { size: values.length + 1 },
          {
            nodes: { ...reset(updated), [newId]: { ...updated[newId]!, state: "done" } },
            rootId: built.rootId,
          },
        );
        return r.steps;
      }
      currentId = nextId;
      depth += 1;
    }
    return r.steps;
  },
};

/* ------------------------------------------------------------- BST search */

export const bstSearch: Def = {
  slug: "bst-search",
  title: "BST search",
  tagline:
    "Binary search on a tree. Each comparison eliminates a subtree, so a balanced tree of a million nodes needs about 20 comparisons.",
  language: "JavaScript",
  code: [
    "function search(root, target) {",
    "  let node = root;",
    "  while (node !== null) {",
    "    if (node.value === target) return node;",
    "    node = target < node.value ? node.left : node.right;",
    "  }",
    "  return null;",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(log n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "One comparison per level. Balanced trees have log n levels; a degenerate (sorted-input) tree has n, which is the case interviewers probe.",
  },
  generate: ({ values, value = 0 }) => {
    const r = createRecorder<TreeVizState>();
    const built = buildBST(values);
    const nodes = built.nodes;
    const visited: string[] = [];

    r.push(
      "highlight",
      `Searching for ${value}. Start at the root.`,
      [2],
      { target: value },
      {
        nodes: reset(nodes),
        rootId: built.rootId,
        counters: { comparisons: 0 },
      },
    );

    let currentId = built.rootId;
    let comparisons = 0;
    while (currentId) {
      const current = nodes[currentId]!;
      comparisons += 1;
      const hit = current.value === value;
      const goLeft = value < current.value;
      const marks: Record<string, CellState> = {};
      visited.forEach((id) => (marks[id] = "visited"));
      marks[currentId] = hit ? "success" : "compare";
      r.push(
        hit ? "highlight" : "compare",
        hit
          ? `${value} found after ${comparisons} comparison(s). Every comparison threw away a subtree, which is why this is O(log n) on a balanced tree.`
          : `${value} is ${goLeft ? "smaller" : "larger"} than ${current.value}, so go ${goLeft ? "left" : "right"} and ignore the other subtree entirely.`,
        hit ? [4] : [5],
        {
          node: current.value,
          target: value,
          comparisons,
          direction: hit ? "found" : goLeft ? "left" : "right",
        },
        { nodes: mark(nodes, marks), rootId: built.rootId, counters: { comparisons } },
      );
      if (hit) return r.steps;
      visited.push(currentId);
      currentId = goLeft ? current.left : current.right;
    }

    r.push(
      "complete",
      `We reached a null link, which means ${value} is not in the tree. The miss still only cost ${comparisons} comparisons.`,
      [7],
      { found: false, comparisons },
      {
        nodes: mark(
          nodes,
          Object.fromEntries(visited.map((id) => [id, "eliminated" as CellState])),
        ),
        rootId: built.rootId,
        counters: { comparisons },
      },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------- BST delete */

export const bstDelete: Def = {
  slug: "bst-delete",
  title: "BST delete",
  tagline:
    "Three cases: a leaf just goes, a node with one child is replaced by that child, and a node with two children is replaced by its in-order successor.",
  language: "JavaScript",
  code: [
    "function remove(root, value) {",
    "  if (root === null) return null;",
    "  if (value < root.value) root.left = remove(root.left, value);",
    "  else if (value > root.value) root.right = remove(root.right, value);",
    "  else {",
    "    if (root.left === null) return root.right;",
    "    if (root.right === null) return root.left;",
    "    const succ = min(root.right);",
    "    root.value = succ.value;",
    "    root.right = remove(root.right, succ.value);",
    "  }",
    "  return root;",
    "}",
  ],
  complexity: {
    timeBest: "O(log n)",
    timeAverage: "O(log n)",
    timeWorst: "O(n)",
    space: "O(h)",
    plainEnglish:
      "Finding the node costs one path down the tree, and finding the successor costs part of another, both bounded by the height.",
  },
  generate: ({ values, value = 0 }) => {
    const r = createRecorder<TreeVizState>();
    const built = buildBST(values);
    let nodes = { ...built.nodes };
    let rootId = built.rootId;

    // find the node
    const path: string[] = [];
    let currentId = rootId;
    while (currentId && nodes[currentId]!.value !== value) {
      path.push(currentId);
      const current = nodes[currentId]!;
      r.push(
        "compare",
        `${value} is ${value < current.value ? "smaller" : "larger"} than ${current.value}, so continue ${value < current.value ? "left" : "right"} to find it.`,
        [3, 4],
        { comparing: current.value, target: value },
        {
          nodes: mark(nodes, {
            ...Object.fromEntries(path.map((id) => [id, "visited" as CellState])),
            [currentId]: "compare",
          }),
          rootId,
        },
      );
      currentId = value < current.value ? current.left : current.right;
    }

    if (!currentId) {
      r.push(
        "complete",
        `${value} is not in the tree, so nothing is deleted.`,
        [2],
        { found: false },
        { nodes: reset(nodes), rootId },
      );
      return r.steps;
    }

    const target = nodes[currentId]!;
    r.push(
      "highlight",
      `Found ${value}. It has ${target.left && target.right ? "two children" : target.left || target.right ? "one child" : "no children"}, which decides how we remove it.`,
      [5],
      {
        node: value,
        left: target.left ? nodes[target.left]!.value : null,
        right: target.right ? nodes[target.right]!.value : null,
      },
      { nodes: mark(nodes, { [currentId]: "error" }), rootId },
    );

    const parentId = path[path.length - 1] ?? null;
    const attach = (childId: string | null) => {
      if (parentId) {
        const parent = nodes[parentId]!;
        nodes = {
          ...nodes,
          [parentId]:
            parent.left === currentId
              ? { ...parent, left: childId }
              : { ...parent, right: childId },
        };
      } else {
        rootId = childId;
      }
    };

    if (!target.left || !target.right) {
      const child = target.left ?? target.right;
      attach(child);
      const cleaned = { ...nodes };
      delete cleaned[currentId];
      nodes = cleaned;
      r.push(
        "delete",
        child
          ? `With only one child, ${value} is simply replaced by ${nodes[child]!.value}. That subtree is already on the correct side of the parent, so the ordering still holds.`
          : `${value} is a leaf, so it is removed directly: no rewiring needed beyond clearing the parent's link.`,
        child ? [6, 7] : [6],
        { removed: value },
        { nodes: reset(nodes, "done"), rootId },
      );
      r.push(
        "complete",
        "The BST property is intact: in-order traversal still reads in sorted order.",
        [12],
        { size: values.length - 1 },
        { nodes: reset(nodes), rootId },
      );
      return r.steps;
    }

    // two children: in-order successor
    let succId = target.right;
    const succPath: string[] = [];
    while (nodes[succId]!.left) {
      succPath.push(succId);
      succId = nodes[succId]!.left!;
    }
    r.push(
      "highlight",
      `Two children, so we need the in-order successor: the smallest value in the right subtree, which is ${nodes[succId]!.value}. It is the only value that can sit here without breaking the ordering.`,
      [8],
      { successor: nodes[succId]!.value },
      { nodes: mark(nodes, { [currentId]: "error", [succId]: "inspect" }), rootId },
    );

    const succValue = nodes[succId]!.value;
    const succRight = nodes[succId]!.right;
    // detach successor from its parent
    const succParentId = succPath[succPath.length - 1] ?? currentId;
    const succParent = nodes[succParentId]!;
    nodes = {
      ...nodes,
      [succParentId]:
        succParent.left === succId
          ? { ...succParent, left: succRight }
          : { ...succParent, right: succRight },
      [currentId]: { ...nodes[currentId]!, value: succValue, state: "success" },
    };
    const cleaned2 = { ...nodes };
    delete cleaned2[succId];
    nodes = cleaned2;

    r.push(
      "update",
      `Copy ${succValue} into the deleted node's place and remove the successor from its old position. Everything left of here is still smaller and everything right is still larger.`,
      [9, 10],
      { removed: value, promoted: succValue },
      { nodes, rootId },
    );
    r.push(
      "complete",
      `${value} is gone and the tree is still a valid BST.`,
      [12],
      { size: values.length - 1 },
      { nodes: reset(nodes), rootId },
    );
    return r.steps;
  },
};

/* --------------------------------------------------------------- traversals */

function traversalDef(kind: "preorder" | "inorder" | "postorder"): Def {
  const codeByKind: Record<typeof kind, string[]> = {
    preorder: [
      "function preorder(node, out) {",
      "  if (node === null) return;",
      "  out.push(node.value);   // visit first",
      "  preorder(node.left, out);",
      "  preorder(node.right, out);",
      "}",
    ],
    inorder: [
      "function inorder(node, out) {",
      "  if (node === null) return;",
      "  inorder(node.left, out);",
      "  out.push(node.value);   // visit in the middle",
      "  inorder(node.right, out);",
      "}",
    ],
    postorder: [
      "function postorder(node, out) {",
      "  if (node === null) return;",
      "  postorder(node.left, out);",
      "  postorder(node.right, out);",
      "  out.push(node.value);   // visit last",
      "}",
    ],
  };
  const taglines: Record<typeof kind, string> = {
    preorder:
      "Visit the node, then its left subtree, then its right. Preorder is how you copy or serialise a tree: the root arrives before its children.",
    inorder:
      "Left subtree, node, right subtree. On a BST this prints the values in sorted order, which is the fastest way to check whether a tree really is a BST.",
    postorder:
      "Both subtrees first, node last. Postorder is how you delete or free a tree, and how you compute values that depend on children (height, sums).",
  };
  const visitLine: Record<typeof kind, number> = { preorder: 3, inorder: 4, postorder: 5 };

  return {
    slug: `tree-${kind}`,
    title: `${kind[0]!.toUpperCase()}${kind.slice(1)} traversal`,
    tagline: taglines[kind],
    language: "JavaScript",
    code: codeByKind[kind],
    complexity: {
      timeBest: "O(n)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      space: "O(h)",
      plainEnglish:
        "Every node is visited exactly once. The memory is the recursion stack, which is the height of the tree (log n when balanced, n in the worst case).",
    },
    generate: ({ values }) => {
      const r = createRecorder<TreeVizState>();
      const built = buildBST(values);
      const nodes = built.nodes;
      const out: number[] = [];
      const visited: Record<string, CellState> = {};

      r.push(
        "highlight",
        `${kind} traversal of the tree. The recursion always goes as deep left as it can first; the only difference between the three orders is when a node is recorded.`,
        [1],
        { visited: 0 },
        {
          nodes: reset(nodes),
          rootId: built.rootId,
          output: [],
          outputLabel: kind,
          counters: { visited: 0 },
        },
      );

      const walk = (id: string | null) => {
        if (!id) return;
        const node = nodes[id]!;
        visited[id] = "inspect";
        r.push(
          "visit",
          `Entering ${node.value}.${kind === "preorder" ? ` Preorder records it right now, before looking at any child.` : kind === "inorder" ? " Inorder must finish the entire left subtree before recording it." : " Postorder cannot record it until both subtrees are done."}`,
          [2],
          { node: node.value, visited: out.length },
          {
            nodes: mark(nodes, { ...visited, [id]: "inspect" }),
            rootId: built.rootId,
            output: [...out],
            outputLabel: kind,
            counters: { visited: out.length },
          },
        );

        if (kind === "preorder") {
          out.push(node.value);
          visited[id] = "success";
          r.push(
            "highlight",
            `Recorded ${node.value}. Output so far: ${out.join(", ")}.`,
            [visitLine[kind]],
            { node: node.value, visited: out.length },
            {
              nodes: mark(nodes, visited),
              rootId: built.rootId,
              output: [...out],
              outputLabel: kind,
              counters: { visited: out.length },
            },
          );
        }
        walk(node.left);
        if (kind === "inorder") {
          out.push(node.value);
          visited[id] = "success";
          r.push(
            "highlight",
            `The left subtree of ${node.value} is finished, so ${node.value} is recorded now. Output so far: ${out.join(", ")}, always ascending on a BST.`,
            [visitLine[kind]],
            { node: node.value, visited: out.length },
            {
              nodes: mark(nodes, visited),
              rootId: built.rootId,
              output: [...out],
              outputLabel: kind,
              counters: { visited: out.length },
            },
          );
        }
        walk(node.right);
        if (kind === "postorder") {
          out.push(node.value);
          visited[id] = "success";
          r.push(
            "highlight",
            `Both subtrees of ${node.value} are done, so ${node.value} is recorded last. Output so far: ${out.join(", ")}.`,
            [visitLine[kind]],
            { node: node.value, visited: out.length },
            {
              nodes: mark(nodes, visited),
              rootId: built.rootId,
              output: [...out],
              outputLabel: kind,
              counters: { visited: out.length },
            },
          );
        }
        visited[id] = "done";
      };

      walk(built.rootId);

      r.push(
        "complete",
        `${kind} result: ${out.join(", ")}.${kind === "inorder" ? " Sorted: that is the BST invariant showing up as an ordered list." : ""}`,
        [1],
        { result: out.join(","), visited: out.length },
        {
          nodes: reset(nodes, "done"),
          rootId: built.rootId,
          output: out,
          outputLabel: kind,
          counters: { visited: out.length },
        },
      );
      return r.steps;
    },
  };
}

export const treePreorder = traversalDef("preorder");
export const treeInorder = traversalDef("inorder");
export const treePostorder = traversalDef("postorder");

/* ------------------------------------------------------- level order (BFS) */

export const treeLevelOrder: Def = {
  slug: "tree-level-order",
  title: "Level-order traversal (BFS)",
  tagline:
    "The only traversal that is not recursive. A queue processes the tree layer by layer, which is what 'shortest path' and 'per level' questions need.",
  language: "JavaScript",
  code: [
    "function levelOrder(root) {",
    "  if (!root) return [];",
    "  const queue = [root];",
    "  const out = [];",
    "  while (queue.length) {",
    "    const node = queue.shift();",
    "    out.push(node.value);",
    "    if (node.left) queue.push(node.left);",
    "    if (node.right) queue.push(node.right);",
    "  }",
    "  return out;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(w)",
    plainEnglish:
      "Each node is enqueued and dequeued once. Memory is the widest level, which for a full tree is about half the nodes, the opposite trade-off from recursive traversals, which pay for depth instead.",
  },
  generate: ({ values }) => {
    const r = createRecorder<TreeVizState>();
    const built = buildBST(values);
    const nodes = built.nodes;
    const out: number[] = [];
    const marks: Record<string, CellState> = {};
    const queue: string[] = built.rootId ? [built.rootId] : [];

    r.push(
      "highlight",
      "The queue starts with just the root. Whatever is in the queue is the frontier: the nodes we know about but have not processed.",
      [3, 4],
      { queue: queue.length },
      {
        nodes: reset(nodes),
        rootId: built.rootId,
        output: [],
        outputLabel: "level order",
        counters: { queue: queue.length, visited: 0 },
      },
    );

    while (queue.length) {
      const id = queue.shift()!;
      const node = nodes[id]!;
      out.push(node.value);
      marks[id] = "success";
      queue.forEach((q) => (marks[q] = "inspect"));
      const children = [node.left, node.right].filter(Boolean) as string[];
      children.forEach((c) => (marks[c] = "compare"));
      r.push(
        "visit",
        `Dequeue ${node.value} and record it. Its ${children.length} child(ren) join the back of the queue, so they are only processed after everything already waiting; that is what keeps the traversal level by level.`,
        [6, 7, 8, 9],
        { node: node.value, queue: queue.length + children.length, visited: out.length },
        {
          nodes: mark(nodes, marks),
          rootId: built.rootId,
          output: [...out],
          outputLabel: "level order",
          counters: { queue: queue.length + children.length, visited: out.length },
        },
      );
      queue.push(...children);
    }

    r.push(
      "complete",
      `Level order: ${out.join(", ")}. Reading top-to-bottom, left-to-right, exactly how you would draw the tree.`,
      [11],
      { result: out.join(","), visited: out.length },
      {
        nodes: reset(nodes, "done"),
        rootId: built.rootId,
        output: out,
        outputLabel: "level order",
        counters: { visited: out.length },
      },
    );
    return r.steps;
  },
};

export const TREE_OPS: Def[] = [
  bstInsert,
  bstSearch,
  bstDelete,
  treeInorder,
  treePreorder,
  treePostorder,
  treeLevelOrder,
];
