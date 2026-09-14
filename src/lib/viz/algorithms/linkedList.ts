import { createRecorder } from "../recorder";
import type { ChainNode, ListVizState } from "../state";
import type { AlgorithmDefinition, CellState, ComplexityInfo } from "../types";

export interface ListInput {
  values: number[];
  /** Value used by insert / delete / search operations. */
  value?: number;
  /** Position used by insert-at / delete-at. */
  position?: number;
  variant?: "singly" | "doubly" | "circular";
  /** Second list for merge; cycle target index for cycle detection. */
  second?: number[];
}

type Def = AlgorithmDefinition<ListVizState, ListInput>;

const O1: ComplexityInfo = {
  timeBest: "O(1)",
  timeAverage: "O(1)",
  timeWorst: "O(1)",
  space: "O(1)",
  plainEnglish:
    "No walking required: we only rewire a fixed number of pointers, so the list length does not matter at all.",
};

const ON: ComplexityInfo = {
  timeBest: "O(1)",
  timeAverage: "O(n)",
  timeWorst: "O(n)",
  space: "O(1)",
  plainEnglish:
    "A linked list has no indexes, so reaching position k means following k links. In the worst case we walk the whole list once, and we reuse the same few pointer variables the entire time.",
};

function nodes(
  values: number[],
  variant: ListVizState["variant"],
  state: CellState = "default",
): ChainNode[] {
  return values.map((value, i) => ({ id: `n${i}`, value, state }));
}

function withState(list: ChainNode[], id: string | null, state: CellState): ChainNode[] {
  return list.map((n) => (n.id === id ? { ...n, state } : n));
}

/* ------------------------------------------------------------------ traverse */

export const listTraverse: Def = {
  slug: "linked-list-traverse",
  title: "Traverse a linked list",
  tagline:
    "There is no arr[i] here. The only way to reach a node is to start at head and follow next, one link at a time, which is exactly why random access costs O(n).",
  language: "JavaScript",
  code: [
    "function traverse(head) {",
    "  let current = head;",
    "  while (current !== null) {",
    "    visit(current.value);",
    "    current = current.next;",
    "  }",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "Every node is visited exactly once, and we only keep one pointer variable, so memory does not grow with the list.",
  },
  generate: ({ values, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    r.push(
      "highlight",
      "current starts at head. Nothing has been visited yet.",
      [2],
      { current: "head", visited: 0 },
      {
        nodes: base,
        variant,
        pointers: { current: base[0]?.id ?? null },
        counters: { visited: 0 },
      },
    );

    base.forEach((node, i) => {
      r.push(
        "visit",
        `current points at the node holding ${node.value}. We read its value, then follow next to move on: we cannot jump ahead.`,
        [3, 4],
        { current: node.value, visited: i + 1 },
        {
          nodes: base.map((n, j) => ({
            ...n,
            state: j < i ? "visited" : j === i ? "inspect" : "default",
          })),
          variant,
          pointers: { current: node.id },
          counters: { visited: i + 1 },
        },
      );
    });

    r.push(
      "complete",
      `current is now null, so the loop ends. We touched all ${values.length} nodes in ${values.length} steps: O(n).`,
      [2, 6],
      { current: null, visited: values.length },
      {
        nodes: base.map((n) => ({ ...n, state: "done" })),
        variant,
        pointers: { current: null },
        counters: { visited: values.length },
      },
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- insert head */

export const listInsertHead: Def = {
  slug: "linked-list-insert-head",
  title: "Insert at head",
  tagline:
    "The operation arrays are bad at. No shifting: point the new node at the old head, then move head. Two assignments, whatever the length.",
  language: "JavaScript",
  code: [
    "function insertHead(head, value) {",
    "  const node = new Node(value);",
    "  node.next = head;",
    "  head = node;",
    "  return head;",
    "}",
  ],
  complexity: O1,
  generate: ({ values, value = 0, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    r.push(
      "highlight",
      `We want ${value} to become the new first node.`,
      [1],
      { value, length: values.length },
      {
        nodes: base,
        variant,
        pointers: { head: base[0]?.id ?? null },
      },
    );
    r.push(
      "insert",
      `Create the node holding ${value}. It is not linked to anything yet.`,
      [2],
      { value },
      {
        nodes: base,
        variant,
        pointers: { head: base[0]?.id ?? null },
        floating: { value, label: "new node" },
      },
    );
    const withNew: ChainNode[] = [{ id: "new", value, state: "inspect" }, ...base];
    r.push(
      "update",
      `node.next = head, so the new node now points at ${values[0] ?? "null"}. The rest of the list is untouched: nothing was copied or shifted.`,
      [3],
      { value, "node.next": values[0] ?? null },
      { nodes: withNew, variant, pointers: { node: "new", head: base[0]?.id ?? null } },
    );
    r.push(
      "complete",
      `head = node. ${value} is the first element and the whole operation took two pointer assignments: O(1), no matter how long the list is.`,
      [4, 5],
      { head: value, length: values.length + 1 },
      {
        nodes: withNew.map((n, i) => ({ ...n, state: i === 0 ? "success" : "done" })),
        variant,
        pointers: { head: "new" },
      },
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- insert tail */

export const listInsertTail: Def = {
  slug: "linked-list-insert-tail",
  title: "Insert at tail",
  tagline:
    "Without a tail pointer we must walk to the end first. That walk is the O(n), not the insertion itself, which is why real implementations cache tail.",
  language: "JavaScript",
  code: [
    "function insertTail(head, value) {",
    "  const node = new Node(value);",
    "  if (head === null) return node;",
    "  let current = head;",
    "  while (current.next !== null) {",
    "    current = current.next;",
    "  }",
    "  current.next = node;",
    "  return head;",
    "}",
  ],
  complexity: ON,
  generate: ({ values, value = 0, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    r.push(
      "insert",
      `Create the node holding ${value}, then find where it belongs: the end.`,
      [2],
      { value },
      {
        nodes: base,
        variant,
        pointers: { head: base[0]?.id ?? null },
        floating: { value, label: "new node" },
      },
    );

    base.forEach((node, i) => {
      const last = i === base.length - 1;
      r.push(
        last ? "highlight" : "visit",
        last
          ? `current.next is null, so ${node.value} is the tail. This is where we attach.`
          : `current is at ${node.value} and its next is not null, so keep walking. This walk is the cost of tail insertion.`,
        last ? [4] : [4, 5],
        { current: node.value, steps: i + 1 },
        {
          nodes: base.map((n, j) => ({
            ...n,
            state: j < i ? "visited" : j === i ? (last ? "inspect" : "compare") : "default",
          })),
          variant,
          pointers: { current: node.id },
          counters: { "links followed": i },
          floating: { value, label: "new node" },
        },
      );
    });

    const appended: ChainNode[] = [
      ...base.map((n) => ({ ...n, state: "done" as CellState })),
      { id: "new", value, state: "success" },
    ];
    r.push(
      "complete",
      `current.next = node attaches ${value} at the end. Total work: ${values.length} link hops plus one assignment: O(n) because of the walk.`,
      [7, 8],
      { tail: value, length: values.length + 1 },
      {
        nodes: appended,
        variant,
        pointers: { tail: "new" },
        counters: { "links followed": values.length },
      },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------- insert at position */

export const listInsertAt: Def = {
  slug: "linked-list-insert-at",
  title: "Insert at position",
  tagline:
    "Stop one node early. To splice a node in at position k you need the node at k-1, because a singly linked node cannot look backwards.",
  language: "JavaScript",
  code: [
    "function insertAt(head, value, k) {",
    "  if (k === 0) return insertHead(head, value);",
    "  let prev = head;",
    "  for (let i = 0; i < k - 1; i++) {",
    "    if (prev === null) return head;",
    "    prev = prev.next;",
    "  }",
    "  const node = new Node(value);",
    "  node.next = prev.next;",
    "  prev.next = node;",
    "  return head;",
    "}",
  ],
  complexity: ON,
  generate: ({ values, value = 0, position = 1, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    const k = Math.max(0, Math.min(position, values.length));
    r.push(
      "highlight",
      `Goal: put ${value} at position ${k}. We must first reach position ${Math.max(0, k - 1)}, the node just before it.`,
      [1],
      { value, k },
      {
        nodes: base,
        variant,
        pointers: { prev: base[0]?.id ?? null },
        floating: { value, label: "new node" },
      },
    );

    for (let i = 0; i < Math.max(0, k - 1); i++) {
      r.push(
        "visit",
        `prev moves from ${base[i]?.value} to ${base[i + 1]?.value}. ${Math.max(0, k - 1) - i - 1} more hop(s) to go.`,
        [3, 5],
        { i, prev: base[i + 1]?.value ?? null },
        {
          nodes: base.map((n, j) => ({ ...n, state: j <= i ? "visited" : "default" })),
          variant,
          pointers: { prev: base[i + 1]?.id ?? null },
          floating: { value, label: "new node" },
        },
      );
    }

    const prevIndex = k - 1;
    if (prevIndex >= 0) {
      r.push(
        "highlight",
        `prev is at ${base[prevIndex]?.value}. The node currently after it (${values[k] ?? "null"}) is the one we push along.`,
        [7],
        { prev: base[prevIndex]?.value ?? null, "prev.next": values[k] ?? null },
        {
          nodes: withState(base, base[prevIndex]?.id ?? null, "inspect"),
          variant,
          pointers: { prev: base[prevIndex]?.id ?? null },
          floating: { value, label: "new node" },
        },
      );
    }

    const spliced: ChainNode[] = [
      ...base.slice(0, k).map((n) => ({ ...n, state: "done" as CellState })),
      { id: "new", value, state: "success" },
      ...base.slice(k).map((n) => ({ ...n, state: "done" as CellState })),
    ];
    r.push(
      "update",
      `node.next = prev.next first: if we overwrote prev.next before this, we would lose the rest of the list forever. Order matters.`,
      [8],
      { "node.next": values[k] ?? null },
      { nodes: spliced, variant, pointers: { node: "new" } },
    );
    r.push(
      "complete",
      `prev.next = node finishes the splice. ${value} sits at position ${k} and no other node moved in memory: only two links changed.`,
      [9, 10],
      { position: k, length: values.length + 1 },
      { nodes: spliced, variant, pointers: { head: spliced[0]?.id ?? null } },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------------- delete */

export const listDelete: Def = {
  slug: "linked-list-delete",
  title: "Delete by value",
  tagline:
    "Deletion is just prev.next = current.next. The trick every interview checks: keep a prev pointer, and handle deleting the head separately.",
  language: "JavaScript",
  code: [
    "function remove(head, value) {",
    "  if (head === null) return null;",
    "  if (head.value === value) return head.next;",
    "  let prev = head;",
    "  while (prev.next !== null) {",
    "    if (prev.next.value === value) {",
    "      prev.next = prev.next.next;",
    "      return head;",
    "    }",
    "    prev = prev.next;",
    "  }",
    "  return head;",
    "}",
  ],
  complexity: ON,
  generate: ({ values, value = 0, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    const target = value;

    if (values[0] === target) {
      r.push(
        "compare",
        `head holds ${values[0]}, which is the value we want gone: this is the special case.`,
        [3],
        { value: target },
        {
          nodes: withState(base, base[0]?.id ?? null, "error"),
          variant,
          pointers: { head: base[0]?.id ?? null },
        },
      );
      r.push(
        "delete",
        `Returning head.next makes the second node the new head. The old node is simply unreachable now: no shifting, no copying.`,
        [3],
        { head: values[1] ?? null, length: values.length - 1 },
        {
          nodes: base.slice(1).map((n) => ({ ...n, state: "done" as CellState })),
          variant,
          pointers: { head: base[1]?.id ?? null },
        },
      );
      return r.steps;
    }

    let found = false;
    for (let i = 0; i < base.length - 1 && !found; i++) {
      const nextNode = base[i + 1]!;
      const hit = nextNode.value === target;
      r.push(
        "compare",
        hit
          ? `prev.next holds ${nextNode.value}: found it. prev is the node we need to rewire.`
          : `prev.next holds ${nextNode.value}, not ${target}. Move prev forward one link.`,
        hit ? [5] : [5, 9],
        { prev: base[i]!.value, "prev.next": nextNode.value, target },
        {
          nodes: base.map((n, j) => ({
            ...n,
            state:
              j === i
                ? "inspect"
                : j === i + 1
                  ? hit
                    ? "error"
                    : "compare"
                  : j < i
                    ? "visited"
                    : "default",
          })),
          variant,
          pointers: { prev: base[i]!.id },
        },
      );
      if (hit) {
        found = true;
        const removed = base
          .filter((_, j) => j !== i + 1)
          .map((n) => ({ ...n, state: "done" as CellState }));
        r.push(
          "delete",
          `prev.next = prev.next.next skips over ${target}. One assignment removes it: compare that with an array, where every later element shifts left.`,
          [6, 7],
          { removed: target, length: values.length - 1 },
          { nodes: removed, variant, pointers: { prev: base[i]!.id } },
        );
      }
    }

    if (!found) {
      r.push(
        "complete",
        `We walked off the end without finding ${target}, so the list is returned unchanged. A search miss still costs a full O(n) walk.`,
        [11],
        { target, found: false },
        { nodes: base.map((n) => ({ ...n, state: "visited" })), variant },
      );
    }
    return r.steps;
  },
};

/* ------------------------------------------------------------------- search */

export const listSearch: Def = {
  slug: "linked-list-search",
  title: "Search a linked list",
  tagline:
    "Always linear, even if the values are sorted. Binary search needs random access, and a linked list cannot jump to the middle.",
  language: "JavaScript",
  code: [
    "function search(head, target) {",
    "  let current = head;",
    "  let index = 0;",
    "  while (current !== null) {",
    "    if (current.value === target) return index;",
    "    current = current.next;",
    "    index++;",
    "  }",
    "  return -1;",
    "}",
  ],
  complexity: ON,
  generate: ({ values, value = 0, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    let found = -1;

    for (let i = 0; i < base.length; i++) {
      const node = base[i]!;
      const hit = node.value === value;
      r.push(
        hit ? "highlight" : "compare",
        hit
          ? `${node.value} equals the target, so we return index ${i} immediately: no need to look at the rest.`
          : `${node.value} is not ${value}. There is no way to skip ahead, so we follow next and check the very next node.`,
        hit ? [5] : [4, 6, 7],
        { current: node.value, index: i, target: value, comparisons: i + 1 },
        {
          nodes: base.map((n, j) => ({
            ...n,
            state: j === i ? (hit ? "success" : "compare") : j < i ? "visited" : "default",
          })),
          variant,
          pointers: { current: node.id },
          counters: { comparisons: i + 1 },
        },
      );
      if (hit) {
        found = i;
        break;
      }
    }

    if (found === -1) {
      r.push(
        "complete",
        `current is null and we never matched ${value}, so the answer is -1 after ${values.length} comparisons.`,
        [9],
        { found: false, comparisons: values.length },
        {
          nodes: base.map((n) => ({ ...n, state: "eliminated" })),
          variant,
          pointers: { current: null },
          counters: { comparisons: values.length },
        },
      );
    }
    return r.steps;
  },
};

/* ------------------------------------------------------------------ reverse */

export const listReverse: Def = {
  slug: "linked-list-reverse",
  title: "Reverse a linked list",
  tagline:
    "The classic. Three pointers (prev, current, next) and one rule: save next before you overwrite current.next, or you lose the rest of the list.",
  language: "JavaScript",
  code: [
    "function reverse(head) {",
    "  let prev = null;",
    "  let current = head;",
    "  while (current !== null) {",
    "    const next = current.next;",
    "    current.next = prev;",
    "    prev = current;",
    "    current = next;",
    "  }",
    "  return prev;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "One pass, three pointer variables. The iterative version uses constant memory; the recursive version looks shorter but costs O(n) stack space, which interviewers will ask about.",
  },
  generate: ({ values, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const original = nodes(values, variant);
    let reversed: ChainNode[] = [];
    let remaining = original;

    r.push(
      "highlight",
      "prev starts as null (the reversed list is empty) and current starts at head. We will move nodes from the front of the old list to the front of the new one.",
      [2, 3],
      { prev: null, current: values[0] ?? null, reversed: 0 },
      { nodes: original, variant, pointers: { current: original[0]?.id ?? null, prev: null } },
    );

    for (let i = 0; i < original.length; i++) {
      const node = original[i]!;
      const nextValue = values[i + 1] ?? null;
      r.push(
        "highlight",
        `Save next = ${nextValue ?? "null"} first. If we flipped current.next before this, everything after ${node.value} would be unreachable.`,
        [5],
        { current: node.value, next: nextValue, prev: values[i - 1] ?? null },
        {
          nodes: [
            ...reversed,
            ...remaining.map((n, j) => ({
              ...n,
              state: j === 0 ? ("inspect" as CellState) : n.state,
            })),
          ],
          variant,
          pointers: { current: node.id, next: original[i + 1]?.id ?? null },
          counters: { reversed: i },
        },
      );
      reversed = [
        { ...node, state: "success" },
        ...reversed.map((n) => ({ ...n, state: "done" as CellState })),
      ];
      remaining = remaining.slice(1);
      r.push(
        "update",
        `current.next = prev flips the arrow backwards. ${node.value} now leads the reversed part, and prev/current both step forward.`,
        [6, 7, 8],
        { prev: node.value, current: nextValue, reversed: i + 1 },
        {
          nodes: [...reversed, ...remaining],
          variant,
          pointers: { prev: node.id, current: original[i + 1]?.id ?? null },
          counters: { reversed: i + 1 },
        },
      );
    }

    r.push(
      "complete",
      `current is null, so prev is the new head. The list reads ${[...values].reverse().join(" → ")} and we never allocated a second list.`,
      [10],
      { head: values[values.length - 1] ?? null, reversed: values.length },
      {
        nodes: reversed.map((n) => ({ ...n, state: "done" })),
        variant,
        pointers: { head: reversed[0]?.id ?? null },
        counters: { reversed: values.length },
      },
    );
    return r.steps;
  },
};

/* -------------------------------------------------------------- find middle */

export const listFindMiddle: Def = {
  slug: "linked-list-middle",
  title: "Find the middle node",
  tagline:
    "Fast and slow pointers. Slow moves one link, fast moves two: when fast falls off the end, slow is standing on the middle. One pass, no length needed.",
  language: "JavaScript",
  code: [
    "function middle(head) {",
    "  let slow = head;",
    "  let fast = head;",
    "  while (fast !== null && fast.next !== null) {",
    "    slow = slow.next;",
    "    fast = fast.next.next;",
    "  }",
    "  return slow;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "Fast covers the list once, so the work is linear, but we only pass through once, unlike the naive count-then-walk-again approach.",
  },
  generate: ({ values, variant = "singly" }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, variant);
    let slow = 0;
    let fast = 0;

    const snap = (s: number, f: number, extra: Partial<ListVizState> = {}) => ({
      nodes: base.map((n, j) => ({
        ...n,
        state: (j === s
          ? "inspect"
          : j === f
            ? "compare"
            : j < s
              ? "visited"
              : "default") as CellState,
      })),
      variant,
      pointers: { slow: base[s]?.id ?? null, fast: f < base.length ? base[f]!.id : null },
      ...extra,
    });

    r.push(
      "highlight",
      "Both pointers start at head. The gap between them is what will find the middle.",
      [2, 3],
      { slow: values[0] ?? null, fast: values[0] ?? null },
      snap(0, 0),
    );

    while (fast < values.length && fast + 1 < values.length) {
      slow += 1;
      fast += 2;
      r.push(
        "visit",
        `slow takes one step to ${values[slow]}; fast takes two to ${values[fast] ?? "past the end"}. Fast is always twice as far along, so it arrives at the end when slow is halfway.`,
        [4, 5, 6],
        { slow: values[slow] ?? null, fast: values[fast] ?? null },
        snap(slow, fast),
      );
    }

    r.push(
      "complete",
      `fast has run out of nodes, so slow is sitting on ${values[slow]}, the middle of a list of ${values.length}. We never counted the length.`,
      [8],
      { middle: values[slow] ?? null },
      {
        nodes: base.map((n, j) => ({
          ...n,
          state: (j === slow ? "success" : "done") as CellState,
        })),
        variant,
        pointers: { slow: base[slow]?.id ?? null },
      },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------- detect cycle */

export const listDetectCycle: Def = {
  slug: "linked-list-cycle",
  title: "Detect a cycle (Floyd's)",
  tagline:
    "Same two pointers, different question. In a loop the fast pointer laps the slow one, so if they ever meet there is a cycle, and if fast hits null there isn't.",
  language: "JavaScript",
  code: [
    "function hasCycle(head) {",
    "  let slow = head;",
    "  let fast = head;",
    "  while (fast !== null && fast.next !== null) {",
    "    slow = slow.next;",
    "    fast = fast.next.next;",
    "    if (slow === fast) return true;",
    "  }",
    "  return false;",
    "}",
  ],
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "The pointers close the gap by one node per round, so they meet within a full pass. The hash-set solution is also O(n) time but costs O(n) memory; this one costs nothing.",
  },
  generate: ({ values, position }) => {
    const r = createRecorder<ListVizState>();
    const base = nodes(values, "singly");
    const n = values.length;
    const loopStart = position !== undefined && position >= 0 && position < n ? position : -1;
    const next = (i: number) => {
      const j = i + 1;
      if (j < n) return j;
      return loopStart >= 0 ? loopStart : -1;
    };

    const snap = (s: number, f: number, met: boolean) => ({
      nodes: base.map((nd, j) => ({
        ...nd,
        state: (met && (j === s || j === f)
          ? "success"
          : j === s
            ? "inspect"
            : j === f
              ? "compare"
              : "default") as CellState,
      })),
      variant: (loopStart >= 0 ? "circular" : "singly") as ListVizState["variant"],
      pointers: { slow: s >= 0 ? base[s]!.id : null, fast: f >= 0 ? base[f]!.id : null },
      counters: loopStart >= 0 ? { "loop starts at index": loopStart } : undefined,
    });

    r.push(
      "highlight",
      loopStart >= 0
        ? `This list loops: the last node points back to index ${loopStart}. Both pointers start at head.`
        : "This list ends in null. Both pointers start at head.",
      [2, 3],
      { slow: values[0] ?? null, fast: values[0] ?? null },
      snap(0, 0, false),
    );

    let slow = 0;
    let fast = 0;
    let guard = 0;
    while (guard++ < 4 * n + 4) {
      const f1 = next(fast);
      const f2 = f1 === -1 ? -1 : next(f1);
      if (f1 === -1 || f2 === -1) {
        r.push(
          "complete",
          "fast reached null, which can only happen when the list has an end. No cycle.",
          [4, 9],
          { cycle: false },
          {
            nodes: base.map((nd) => ({ ...nd, state: "done" as CellState })),
            variant: "singly",
            pointers: { fast: null },
          },
        );
        break;
      }
      slow = next(slow);
      fast = f2;
      const met = slow === fast;
      r.push(
        met ? "highlight" : "visit",
        met
          ? `slow and fast are both on ${values[slow]}. Fast gained one node per round and caught up, which is only possible inside a loop: cycle confirmed.`
          : `slow → ${values[slow]}, fast → ${values[fast]}. Fast is closing the gap by one node each round.`,
        met ? [7] : [5, 6],
        { slow: values[slow] ?? null, fast: values[fast] ?? null, met },
        snap(slow, fast, met),
      );
      if (met) break;
    }
    return r.steps;
  },
};

/* -------------------------------------------------------------------- merge */

export const listMerge: Def = {
  slug: "linked-list-merge",
  title: "Merge two sorted lists",
  tagline:
    "Compare the two heads, take the smaller, advance that list. A dummy head node removes every 'is this the first node?' special case.",
  language: "JavaScript",
  code: [
    "function merge(a, b) {",
    "  const dummy = new Node(0);",
    "  let tail = dummy;",
    "  while (a !== null && b !== null) {",
    "    if (a.value <= b.value) { tail.next = a; a = a.next; }",
    "    else { tail.next = b; b = b.next; }",
    "    tail = tail.next;",
    "  }",
    "  tail.next = a !== null ? a : b;",
    "  return dummy.next;",
    "}",
  ],
  complexity: {
    timeBest: "O(n + m)",
    timeAverage: "O(n + m)",
    timeWorst: "O(n + m)",
    space: "O(1)",
    plainEnglish:
      "Each node is looked at once and relinked, never copied, so the merged list reuses the original nodes and needs no extra memory.",
  },
  generate: ({ values, second = [] }) => {
    const r = createRecorder<ListVizState>();
    const a = [...values].sort((x, y) => x - y);
    const b = [...second].sort((x, y) => x - y);
    let i = 0;
    let j = 0;
    const merged: ChainNode[] = [];

    const snap = (extra?: { note?: string }) => ({
      nodes: [
        ...merged,
        ...a.slice(i).map((v, k) => ({
          id: `a${i + k}`,
          value: v,
          state: (k === 0 ? "compare" : "default") as CellState,
        })),
        ...b.slice(j).map((v, k) => ({
          id: `b${j + k}`,
          value: v,
          state: (k === 0 ? "compare" : "eliminated") as CellState,
        })),
      ],
      variant: "singly" as const,
      counters: {
        "merged nodes": merged.length,
        "list A left": a.length - i,
        "list B left": b.length - j,
      },
      ...extra,
    });

    r.push(
      "highlight",
      `List A is ${a.join(" → ")} and list B is ${b.join(" → ")}. Because both are sorted, the smallest remaining value is always one of the two heads.`,
      [2, 3],
      { a: a[0] ?? null, b: b[0] ?? null },
      snap(),
    );

    while (i < a.length && j < b.length) {
      const takeA = a[i]! <= b[j]!;
      const value = takeA ? a[i]! : b[j]!;
      r.push(
        "compare",
        `Compare ${a[i]} from A with ${b[j]} from B. ${value} is smaller, so it must come next in the merged list.`,
        [5, 6],
        { "a.value": a[i]!, "b.value": b[j]!, take: takeA ? "A" : "B" },
        snap(),
      );
      merged.push({ id: `m${merged.length}`, value, state: "success" });
      if (takeA) i++;
      else j++;
      r.push(
        "insert",
        `tail.next points at ${value} and that list advances. Nothing is re-sorted: the sorted order comes for free from the comparison.`,
        [5, 6, 7],
        { merged: merged.length },
        snap(),
      );
    }

    const rest = i < a.length ? a.slice(i) : b.slice(j);
    rest.forEach((v) => merged.push({ id: `m${merged.length}`, value: v, state: "done" }));
    r.push(
      "complete",
      rest.length
        ? `One list ran out, so the remaining ${rest.length} node(s) are attached in one assignment: they are already sorted and all larger.`
        : "Both lists finished at the same time; the merged list is complete.",
      [9, 10],
      { length: merged.length },
      {
        nodes: merged.map((n) => ({ ...n, state: "done" as CellState })),
        variant: "singly",
        counters: { "merged nodes": merged.length },
      },
    );
    return r.steps;
  },
};

export const LINKED_LIST_OPS: Def[] = [
  listTraverse,
  listInsertHead,
  listInsertTail,
  listInsertAt,
  listDelete,
  listSearch,
  listReverse,
  listFindMiddle,
  listDetectCycle,
  listMerge,
];
