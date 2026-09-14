/**
 * Linked List: 11 interview problems as pure step generators.
 *
 * Chains are rebuilt from an explicit order array on every snapshot, which is
 * what lets stepping backward work without undoing pointer surgery.
 */

import { createRecorder } from "../recorder";
import {
  toNum,
  toNums,
  toWords,
  type ProblemDefinition,
  type ProblemVizState,
  type VizChain,
} from "../problemState";
import type { ChainNode } from "../state";
import type { CellState } from "../types";

type S = ProblemVizState;

const O = (
  timeBest: string,
  timeAverage: string,
  timeWorst: string,
  space: string,
  plainEnglish: string,
) => ({ timeBest, timeAverage, timeWorst, space, plainEnglish });

/** Build chain nodes from values in the given visual order. */
const nodesOf = (
  values: number[],
  order: number[],
  marks: Record<number, CellState> = {},
  fallback: CellState = "default",
): ChainNode[] =>
  order.map((idx) => ({ id: `n${idx}`, value: values[idx] ?? 0, state: marks[idx] ?? fallback }));

const ptr = (i: number | null | undefined) =>
  i === null || i === undefined || i < 0 ? null : `n${i}`;

/* --------------------------------------------------- 1. Reverse Linked List */

export const reverseList: ProblemDefinition = {
  slug: "reverse-linked-list",
  title: "Reverse Linked List",
  difficulty: "Easy",
  pattern: "Three-pointer pointer flip",
  tagline:
    "Walk the list once, turning each arrow around as you pass it. You need three references: what came before, where you are, and where you were about to go.",
  insight:
    "Save the next node before you overwrite the current arrow, or the rest of the list is lost. That single line is what most candidates forget under pressure.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(1)",
    "One pass, reusing the existing nodes with no extra storage.",
  ),
  code: [
    "function reverseList(head) {",
    "  let prev = null, cur = head;",
    "  while (cur) {",
    "    const next = cur.next;",
    "    cur.next = prev;",
    "    prev = cur;",
    "    cur = next;",
    "  }",
    "  return prev;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "list",
      placeholder: "1 2 3 4 5",
      presets: [
        { label: "Classic", value: "1 2 3 4 5" },
        { label: "Two nodes", value: "1 2" },
        { label: "Single node", value: "7" },
      ],
    },
  ],
  defaults: { values: "1 2 3 4 5" },
  generate: ({ values: raw }) => {
    const v = toNums(raw, 8);
    const rec = createRecorder<S>();
    let reversed: number[] = [];
    let steps = 0;

    const snap = (cur: number, marks: Record<number, CellState>, note: string): S => {
      const rest = v.map((_, i) => i).filter((i) => i >= cur);
      const chains: VizChain[] = [
        {
          label: "reversed so far",
          nodes: nodesOf(v, reversed, marks, "done"),
          pointers: { prev: ptr(reversed[0] ?? null) },
        },
        {
          label: "still to do",
          nodes: nodesOf(v, rest, marks),
          pointers: {
            cur: ptr(cur < v.length ? cur : null),
            next: ptr(cur + 1 < v.length ? cur + 1 : null),
          },
        },
      ];
      return { chains, counters: { steps }, notes: [note] };
    };

    rec.push(
      "highlight",
      "Nothing is reversed yet. prev points at nothing, cur sits on the head.",
      [2],
      { prev: "null", cur: v[0] ?? 0 },
      snap(0, {}, "prev = null"),
    );

    for (let i = 0; i < v.length; i++) {
      steps++;
      rec.push(
        "visit",
        `Remember that ${v[i + 1] ?? "null"} comes next, before we overwrite this node's arrow.`,
        [4],
        { cur: v[i] ?? 0, next: v[i + 1] ?? "null" },
        snap(i, { [i]: "compare" }, "saved next"),
      );
      reversed = [i, ...reversed];
      rec.push(
        "update",
        `Point ${v[i]} back at ${reversed[1] === undefined ? "null" : v[reversed[1]!]}. It is now the front of the reversed part.`,
        [5, 6, 7],
        { prev: v[i] ?? 0 },
        snap(
          i + 1,
          { [i]: "success" },
          `reversed ${reversed.length} node${reversed.length === 1 ? "" : "s"}`,
        ),
      );
    }

    rec.push(
      "complete",
      `Every arrow is flipped. The new head is ${v[reversed[0] ?? 0] ?? "null"}.`,
      [9],
      { head: v[reversed[0] ?? 0] ?? 0 },
      {
        chains: [{ label: "reversed list", nodes: nodesOf(v, reversed, {}, "done") }],
        counters: { steps },
        output: `reversed = ${reversed.map((i) => v[i]).join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

/* ----------------------------------------------- 2. Merge Two Sorted Lists */

export const mergeTwoLists: ProblemDefinition = {
  slug: "merge-two-sorted-lists",
  title: "Merge Two Sorted Lists",
  difficulty: "Easy",
  pattern: "Two cursors and a dummy head",
  tagline:
    "Compare the front of each list and take the smaller one. A dummy node in front removes every special case about the first element.",
  insight:
    "The dummy head is the reusable trick here: with it, appending is always the same two lines, so there is no separate 'is this the first node' branch.",
  language: "JavaScript",
  complexity: O(
    "O(n + m)",
    "O(n + m)",
    "O(n + m)",
    "O(1)",
    "Each node is visited once and relinked, never copied.",
  ),
  code: [
    "function mergeTwoLists(a, b) {",
    "  const dummy = { next: null };",
    "  let tail = dummy;",
    "  while (a && b) {",
    "    if (a.val <= b.val) { tail.next = a; a = a.next; }",
    "    else { tail.next = b; b = b.next; }",
    "    tail = tail.next;",
    "  }",
    "  tail.next = a ?? b;",
    "  return dummy.next;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "a",
      label: "list1 (sorted)",
      placeholder: "1 2 4",
      presets: [
        { label: "Classic", value: "1 2 4" },
        { label: "Empty", value: "" },
      ],
    },
    {
      kind: "numbers",
      key: "b",
      label: "list2 (sorted)",
      placeholder: "1 3 4",
      presets: [
        { label: "Classic", value: "1 3 4" },
        { label: "Longer", value: "2 3 5 8" },
      ],
    },
  ],
  defaults: { a: "1 2 4", b: "1 3 4" },
  generate: ({ a: aRaw, b: bRaw }) => {
    const A = toNums(aRaw, 7).sort((x, y) => x - y);
    const B = toNums(bRaw, 7).sort((x, y) => x - y);
    const rec = createRecorder<S>();
    const merged: { from: "a" | "b"; value: number }[] = [];
    let comparisons = 0;

    const chainOf = (
      label: string,
      vals: number[],
      from: number,
      prefix: string,
      mark?: CellState,
    ): VizChain => ({
      label,
      nodes: vals.slice(from).map((value, k) => ({
        id: `${prefix}${from + k}`,
        value,
        state: k === 0 ? (mark ?? "inspect") : "default",
      })),
      pointers: vals.length > from ? { [prefix === "a" ? "a" : "b"]: `${prefix}${from}` } : {},
    });

    const snap = (
      i: number,
      j: number,
      note: string,
      marks?: { a?: CellState; b?: CellState },
    ): S => ({
      chains: [
        chainOf("list1", A, i, "a", marks?.a),
        chainOf("list2", B, j, "b", marks?.b),
        {
          label: "merged result",
          nodes: merged.map((m, k) => ({
            id: `m${k}`,
            value: m.value,
            state: k === merged.length - 1 ? "success" : "done",
          })),
        },
      ],
      counters: { comparisons, merged: merged.length },
      notes: [note],
    });

    rec.push(
      "highlight",
      "A dummy node sits in front of the result, so appending never needs a special first case.",
      [2, 3],
      { merged: 0 },
      snap(0, 0, "result empty"),
    );

    let i = 0;
    let j = 0;
    while (i < A.length && j < B.length) {
      comparisons++;
      rec.push(
        "compare",
        `Compare the two fronts: ${A[i]} and ${B[j]}.`,
        [4, 5],
        { a: A[i] ?? 0, b: B[j] ?? 0, comparisons },
        snap(i, j, `${A[i]} vs ${B[j]}`, { a: "compare", b: "compare" }),
      );
      if (A[i]! <= B[j]!) {
        merged.push({ from: "a", value: A[i]! });
        rec.push(
          "insert",
          `${A[i]} is not bigger, so it is appended and list1 moves on. Ties take from list1 to keep the merge stable.`,
          [5, 7],
          { appended: A[i] ?? 0 },
          snap(i + 1, j, `appended ${A[i]}`),
        );
        i++;
      } else {
        merged.push({ from: "b", value: B[j]! });
        rec.push(
          "insert",
          `${B[j]} is smaller, so it is appended and list2 moves on.`,
          [6, 7],
          { appended: B[j] ?? 0 },
          snap(i, j + 1, `appended ${B[j]}`),
        );
        j++;
      }
    }

    const restLabel = i < A.length ? "list1" : j < B.length ? "list2" : null;
    while (i < A.length) merged.push({ from: "a", value: A[i++]! });
    while (j < B.length) merged.push({ from: "b", value: B[j++]! });

    rec.push(
      "update",
      restLabel
        ? `One list is empty, so the whole remaining tail of ${restLabel} is already sorted and can be attached in one move.`
        : "Both lists are empty at the same time, so nothing is left to attach.",
      [9],
      { merged: merged.length },
      snap(i, j, "tail attached"),
    );

    rec.push(
      "complete",
      `The merged list is ${merged.map((m) => m.value).join(" → ") || "empty"}.`,
      [10],
      { length: merged.length },
      {
        chains: [
          {
            label: "merged list",
            nodes: merged.map((m, k) => ({
              id: `m${k}`,
              value: m.value,
              state: "done" as CellState,
            })),
          },
        ],
        counters: { comparisons, merged: merged.length },
        output: `merged = ${merged.map((m) => m.value).join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

/* ---------------------------------------------------------- 3. Reorder List */

const reorderList: ProblemDefinition = {
  slug: "reorder-list",
  title: "Reorder List",
  difficulty: "Medium",
  pattern: "Find the middle, reverse the second half, weave",
  tagline:
    "Three known techniques in sequence: split the list at its middle with slow and fast pointers, reverse the back half, then alternate nodes from each half.",
  insight:
    "Interviewers use this to see whether you can compose sub-routines you already know instead of inventing one clever pass. Name the three phases out loud before writing code.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(1)", "Three linear passes, all in place."),
  code: [
    "function reorderList(head) {",
    "  let slow = head, fast = head;",
    "  while (fast?.next) { slow = slow.next; fast = fast.next.next; }",
    "  let second = reverse(slow.next);",
    "  slow.next = null;",
    "  let first = head;",
    "  while (second) {",
    "    [first.next, second.next] = [second, first.next];",
    "    first = second.next; second = tmp;",
    "  }",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "list",
      placeholder: "1 2 3 4 5",
      presets: [
        { label: "Odd length", value: "1 2 3 4 5" },
        { label: "Even length", value: "1 2 3 4" },
        { label: "Longer", value: "1 2 3 4 5 6 7" },
      ],
    },
  ],
  defaults: { values: "1 2 3 4 5" },
  generate: ({ values: raw }) => {
    const v = toNums(raw, 8);
    const rec = createRecorder<S>();
    let steps = 0;

    const snap = (
      label: string,
      groups: {
        label: string;
        order: number[];
        marks?: Record<number, CellState>;
        pointers?: Record<string, string | null>;
      }[],
    ): S => ({
      chains: groups.map((g) => ({
        label: g.label,
        nodes: nodesOf(v, g.order, g.marks ?? {}),
        pointers: g.pointers ?? {},
      })),
      counters: { steps },
      notes: [label],
    });

    const all = v.map((_, i) => i);
    rec.push(
      "highlight",
      "Phase 1: find the middle with a slow pointer that moves one node while a fast pointer moves two.",
      [2],
      { slow: v[0] ?? 0 },
      snap("phase 1: find the middle", [
        { label: "list", order: all, pointers: { slow: ptr(0), fast: ptr(0) } },
      ]),
    );

    let slow = 0;
    let fast = 0;
    while (fast + 1 < v.length) {
      steps++;
      slow += 1;
      fast += 2;
      rec.push(
        "visit",
        `slow is on ${v[slow]}, fast is on ${v[Math.min(fast, v.length - 1)]}. When fast runs out, slow is at the middle.`,
        [3],
        { slow: v[slow] ?? 0, fast: v[Math.min(fast, v.length - 1)] ?? 0 },
        snap("walking", [
          {
            label: "list",
            order: all,
            marks: { [slow]: "inspect", [Math.min(fast, v.length - 1)]: "compare" },
            pointers: { slow: ptr(slow), fast: ptr(Math.min(fast, v.length - 1)) },
          },
        ]),
      );
    }

    const firstHalf = all.slice(0, slow + 1);
    const secondHalf = all.slice(slow + 1);
    rec.push(
      "update",
      `The list splits after ${v[slow]}. The back half will be reversed.`,
      [4, 5],
      { split: v[slow] ?? 0 },
      snap("phase 2: split", [
        {
          label: "front half",
          order: firstHalf,
          marks: Object.fromEntries(firstHalf.map((i) => [i, "inspect" as CellState])),
        },
        {
          label: "back half",
          order: secondHalf,
          marks: Object.fromEntries(secondHalf.map((i) => [i, "compare" as CellState])),
        },
      ]),
    );

    const reversed = [...secondHalf].reverse();
    rec.push(
      "update",
      "Reverse the back half: the same three-pointer flip as Reverse Linked List.",
      [4],
      { back: reversed.map((i) => v[i]).join(" → ") },
      snap("back half reversed", [
        {
          label: "front half",
          order: firstHalf,
          marks: Object.fromEntries(firstHalf.map((i) => [i, "inspect" as CellState])),
        },
        {
          label: "back half (reversed)",
          order: reversed,
          marks: Object.fromEntries(reversed.map((i) => [i, "success" as CellState])),
        },
      ]),
    );

    const woven: number[] = [];
    let a = 0;
    let b = 0;
    while (a < firstHalf.length || b < reversed.length) {
      if (a < firstHalf.length) woven.push(firstHalf[a++]!);
      if (b < reversed.length) woven.push(reversed[b++]!);
      steps++;
      rec.push(
        "insert",
        `Weave: take one node from the front, then one from the reversed back. Result so far: ${woven.map((i) => v[i]).join(" → ")}.`,
        [7, 8, 9],
        { length: woven.length },
        snap("phase 3: weave", [
          {
            label: "result",
            order: woven,
            marks: Object.fromEntries(woven.map((i) => [i, "success" as CellState])),
          },
          { label: "front left", order: firstHalf.slice(a) },
          { label: "back left", order: reversed.slice(b) },
        ]),
      );
    }

    rec.push(
      "complete",
      `Reordered: ${woven.map((i) => v[i]).join(" → ")}.`,
      [11],
      { length: woven.length },
      {
        chains: [{ label: "reordered list", nodes: nodesOf(v, woven, {}, "done") }],
        counters: { steps },
        output: `list = ${woven.map((i) => v[i]).join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------- 4. Remove Nth Node From End of List */

const removeNthFromEnd: ProblemDefinition = {
  slug: "remove-nth-node-from-end-of-list",
  title: "Remove Nth Node From End of List",
  difficulty: "Medium",
  pattern: "Two pointers n apart",
  tagline:
    "Send one pointer n nodes ahead, then move both together. When the leader falls off the end, the follower is sitting just before the node to remove.",
  insight:
    "The gap between the pointers is the whole algorithm: it converts 'from the end' into 'from where I am' in a single pass. A dummy head handles removing the first node.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(1)", "One pass; no length count needed."),
  code: [
    "function removeNthFromEnd(head, n) {",
    "  const dummy = { next: head };",
    "  let lead = dummy, follow = dummy;",
    "  for (let i = 0; i < n; i++) lead = lead.next;",
    "  while (lead.next) { lead = lead.next; follow = follow.next; }",
    "  follow.next = follow.next.next;",
    "  return dummy.next;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "list",
      placeholder: "1 2 3 4 5",
      presets: [
        { label: "Classic", value: "1 2 3 4 5" },
        { label: "Single node", value: "9" },
      ],
    },
    { kind: "number", key: "n", label: "n (from the end)", min: 1, max: 8 },
  ],
  defaults: { values: "1 2 3 4 5", n: "2" },
  generate: ({ values: raw, n: nRaw }) => {
    const v = toNums(raw, 9);
    const n = Math.min(Math.max(1, toNum(nRaw, 2)), Math.max(1, v.length));
    const rec = createRecorder<S>();
    const all = v.map((_, i) => i);
    let steps = 0;

    const snap = (
      lead: number,
      follow: number,
      marks: Record<number, CellState>,
      note: string,
    ): S => ({
      chains: [
        {
          label: "list",
          nodes: nodesOf(v, all, marks),
          pointers: {
            lead: lead >= 0 && lead < v.length ? ptr(lead) : null,
            follow: follow >= 0 && follow < v.length ? ptr(follow) : null,
          },
        },
      ],
      counters: { steps, gap: n },
      notes: [note, `n = ${n}`],
    });

    rec.push(
      "highlight",
      `The two pointers will stay exactly ${n} node${n === 1 ? "" : "s"} apart. A dummy node in front makes removing the head no different from anything else.`,
      [2, 3],
      { n },
      snap(-1, -1, {}, "both start before the head"),
    );

    let lead = -1;
    for (let i = 0; i < n; i++) {
      lead++;
      steps++;
      rec.push(
        "visit",
        `Move the leader forward. Gap so far: ${i + 1}.`,
        [4],
        { lead: v[lead] ?? 0 },
        snap(lead, -1, { [Math.max(0, lead)]: "compare" }, `building the gap (${i + 1}/${n})`),
      );
    }

    let follow = -1;
    while (lead + 1 < v.length) {
      lead++;
      follow++;
      steps++;
      rec.push(
        "visit",
        `Both move one step. The leader is on ${v[lead]} and the follower on ${v[follow]}.`,
        [5],
        { lead: v[lead] ?? 0, follow: v[follow] ?? 0 },
        snap(lead, follow, { [lead]: "compare", [follow]: "inspect" }, "moving together"),
      );
    }

    const target = follow + 1;
    rec.push(
      "delete",
      `The leader is at the last node, so the follower's next node, ${v[target]}, is the ${n}th from the end. Skip over it.`,
      [6],
      { removed: v[target] ?? 0 },
      snap(lead, follow, { [target]: "error", [follow]: "inspect" }, "removing"),
    );

    const kept = all.filter((i) => i !== target);
    rec.push(
      "complete",
      `${v[target]} is removed. The list is now ${kept.map((i) => v[i]).join(" → ") || "empty"}.`,
      [7],
      { length: kept.length },
      {
        chains: [{ label: "result", nodes: nodesOf(v, kept, {}, "done") }],
        counters: { steps },
        output: `list = ${kept.map((i) => v[i]).join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------- 5. Copy List with Random Pointer */

const copyRandomList: ProblemDefinition = {
  slug: "copy-list-with-random-pointer",
  title: "Copy List with Random Pointer",
  difficulty: "Medium",
  pattern: "Old node → new node map, then a second pass for the links",
  tagline:
    "First pass: create a fresh node for every original and remember which is which. Second pass: translate every next and random pointer through that mapping.",
  insight:
    "Two passes beat one clever pass. The map turns 'the node this points at' into 'the copy of the node this points at', which is the only hard part of a deep copy.",
  language: "JavaScript",
  complexity: O(
    "O(n)",
    "O(n)",
    "O(n)",
    "O(n)",
    "Two passes plus a map from original nodes to their copies.",
  ),
  code: [
    "function copyRandomList(head) {",
    "  const map = new Map();",
    "  for (let cur = head; cur; cur = cur.next)",
    "    map.set(cur, { val: cur.val, next: null, random: null });",
    "  for (let cur = head; cur; cur = cur.next) {",
    "    const copy = map.get(cur);",
    "    copy.next = map.get(cur.next) ?? null;",
    "    copy.random = map.get(cur.random) ?? null;",
    "  }",
    "  return map.get(head) ?? null;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "list",
      placeholder: "7 13 11 10 1",
      presets: [
        { label: "Classic", value: "7 13 11 10 1" },
        { label: "Short", value: "1 2" },
      ],
    },
    {
      kind: "numbers",
      key: "randoms",
      label: "random target index per node (-1 = null)",
      placeholder: "-1 0 4 2 0",
      presets: [
        { label: "Classic", value: "-1 0 4 2 0" },
        { label: "All null", value: "-1 -1" },
      ],
    },
  ],
  defaults: { values: "7 13 11 10 1", randoms: "-1 0 4 2 0" },
  generate: ({ values: raw, randoms: rRaw }) => {
    const v = toNums(raw, 7);
    const randoms = v.map((_, i) => {
      const r = toNums(rRaw, 7)[i];
      return r !== undefined && r >= 0 && r < v.length ? r : -1;
    });
    const rec = createRecorder<S>();
    const all = v.map((_, i) => i);
    const copied: number[] = [];
    const linked = new Set<number>();
    let steps = 0;

    const links = (order: number[], prefix: string) =>
      order
        .filter((i) => randoms[i] !== -1)
        .map((i) => ({ from: `${prefix}${i}`, to: `${prefix}${randoms[i]}` }));

    const snap = (marks: Record<number, CellState>, note: string): S => ({
      chains: [
        {
          label: "original (dashed arrows are random pointers)",
          nodes: nodesOf(v, all, marks),
          extraLinks: links(all, "n"),
        },
        {
          label: "copy",
          nodes: copied.map((i) => ({
            id: `c${i}`,
            value: v[i] ?? 0,
            state: linked.has(i) ? ("done" as CellState) : ("inspect" as CellState),
          })),
          extraLinks: copied
            .filter((i) => linked.has(i) && randoms[i] !== -1)
            .map((i) => ({ from: `c${i}`, to: `c${randoms[i]}` })),
        },
      ],
      panels: [
        {
          label: "original → copy",
          entries: copied.map((i) => ({ key: String(v[i]), value: `copy of node ${i}` })),
          empty: "nothing copied yet",
        },
      ],
      counters: { steps, copies: copied.length },
      notes: [note],
    });

    rec.push(
      "highlight",
      "A deep copy cannot reuse any original node, so first every node needs a twin.",
      [2],
      { copies: 0 },
      snap({}, "pass 1: create the twins"),
    );

    for (let i = 0; i < v.length; i++) {
      copied.push(i);
      steps++;
      rec.push(
        "insert",
        `Create a copy of ${v[i]} and record the pairing, with its arrows still empty.`,
        [3, 4],
        { copied: v[i] ?? 0 },
        snap({ [i]: "compare" }, `copied ${v[i]}`),
      );
    }

    for (let i = 0; i < v.length; i++) {
      linked.add(i);
      steps++;
      const rnd = randoms[i]!;
      rec.push(
        "update",
        `Now wire the copy of ${v[i]}: next goes to the copy of ${v[i + 1] ?? "null"}, and random goes to the copy of ${rnd === -1 ? "null" : v[rnd]}.`,
        [5, 6, 7, 8],
        { node: v[i] ?? 0, random: rnd === -1 ? "null" : (v[rnd] ?? 0) },
        snap(
          { [i]: "success", ...(rnd >= 0 ? { [rnd]: "inspect" as CellState } : {}) },
          "pass 2: translate the pointers",
        ),
      );
    }

    rec.push(
      "complete",
      "Every copy has its own next and random arrows, all pointing inside the copied list.",
      [10],
      { copies: copied.length },
      {
        ...snap(
          Object.fromEntries(all.map((i) => [i, "visited" as CellState])),
          "deep copy complete",
        ),
        output: `copy = ${v.join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------- 6. Add Two Numbers */

const addTwoNumbers: ProblemDefinition = {
  slug: "add-two-numbers",
  title: "Add Two Numbers",
  difficulty: "Medium",
  pattern: "Digit-by-digit walk with a carry",
  tagline:
    "The digits are stored least significant first, which is exactly the order you add by hand. Walk both lists together, carrying whenever a column exceeds 9.",
  insight:
    "Keep looping while either list has digits or a carry remains. Treating a missing digit as 0 removes every length-mismatch branch.",
  language: "JavaScript",
  complexity: O(
    "O(max(n,m))",
    "O(max(n,m))",
    "O(max(n,m))",
    "O(max(n,m))",
    "One pass; the result is as long as the longer input plus a possible carry.",
  ),
  code: [
    "function addTwoNumbers(a, b) {",
    "  const dummy = { next: null }; let tail = dummy, carry = 0;",
    "  while (a || b || carry) {",
    "    const sum = (a?.val ?? 0) + (b?.val ?? 0) + carry;",
    "    carry = Math.floor(sum / 10);",
    "    tail.next = { val: sum % 10, next: null };",
    "    tail = tail.next; a = a?.next; b = b?.next;",
    "  }",
    "  return dummy.next;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "a",
      label: "l1 digits (least significant first)",
      placeholder: "2 4 3",
      presets: [
        { label: "342", value: "2 4 3" },
        { label: "9s", value: "9 9 9" },
      ],
    },
    {
      kind: "numbers",
      key: "b",
      label: "l2 digits (least significant first)",
      placeholder: "5 6 4",
      presets: [
        { label: "465", value: "5 6 4" },
        { label: "1", value: "1" },
      ],
    },
  ],
  defaults: { a: "2 4 3", b: "5 6 4" },
  generate: ({ a: aRaw, b: bRaw }) => {
    const A = toNums(aRaw, 8).map((n) => Math.abs(n) % 10);
    const B = toNums(bRaw, 8).map((n) => Math.abs(n) % 10);
    const rec = createRecorder<S>();
    const out: number[] = [];
    let carry = 0;
    let steps = 0;

    const snap = (i: number, note: string): S => ({
      chains: [
        {
          label: "l1",
          nodes: A.map((value, k) => ({
            id: `a${k}`,
            value,
            state: k < i ? "visited" : k === i ? "compare" : "default",
          })),
        },
        {
          label: "l2",
          nodes: B.map((value, k) => ({
            id: `b${k}`,
            value,
            state: k < i ? "visited" : k === i ? "compare" : "default",
          })),
        },
        {
          label: "result",
          nodes: out.map((value, k) => ({
            id: `r${k}`,
            value,
            state: k === out.length - 1 ? "success" : "done",
          })),
        },
      ],
      counters: { steps, carry },
      notes: [note, `carry = ${carry}`],
    });

    rec.push(
      "highlight",
      "Digits are stored backwards, so index 0 is the ones column: the same place you start adding by hand.",
      [2],
      { carry },
      snap(0, "starting at the ones column"),
    );

    let i = 0;
    while (i < A.length || i < B.length || carry) {
      const a = A[i] ?? 0;
      const b = B[i] ?? 0;
      const sum = a + b + carry;
      steps++;
      const before = carry;
      carry = Math.floor(sum / 10);
      out.push(sum % 10);
      rec.push(
        "update",
        `${a} + ${b}${before ? ` + carry ${before}` : ""} = ${sum}, so this column is ${sum % 10}${carry ? ` and 1 carries over` : ""}.`,
        [4, 5, 6, 7],
        { a, b, sum, digit: sum % 10, carry },
        snap(i, `column ${i}: ${sum}`),
      );
      i++;
    }

    const value = out.map(String).reverse().join("");
    rec.push(
      "complete",
      `The sum, read from the last digit back to the first, is ${value}.`,
      [9],
      { result: value },
      {
        chains: [
          {
            label: "result",
            nodes: out.map((v, k) => ({ id: `r${k}`, value: v, state: "done" as CellState })),
          },
        ],
        counters: { steps },
        output: `sum = ${value}`,
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------------ 7. Linked List Cycle */

export const linkedListCycle: ProblemDefinition = {
  slug: "linked-list-cycle",
  title: "Linked List Cycle",
  difficulty: "Easy",
  pattern: "Floyd's slow and fast pointers",
  tagline:
    "One pointer takes single steps, the other takes double steps. On a loop the fast one gains a node per step and must eventually land on the slow one.",
  insight:
    "This beats a visited set because it uses no extra memory. The argument to say out loud: inside a cycle the gap shrinks by exactly one each step, so it reaches zero.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(n)",
    "O(n)",
    "O(1)",
    "At most a linear number of steps before the pointers meet or the list ends.",
  ),
  code: [
    "function hasCycle(head) {",
    "  let slow = head, fast = head;",
    "  while (fast && fast.next) {",
    "    slow = slow.next;",
    "    fast = fast.next.next;",
    "    if (slow === fast) return true;",
    "  }",
    "  return false;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "list",
      placeholder: "3 2 0 -4",
      presets: [
        { label: "Classic", value: "3 2 0 -4" },
        { label: "Longer", value: "1 2 3 4 5 6" },
      ],
    },
    {
      kind: "number",
      key: "cycleAt",
      label: "last node points back to index (-1 = no cycle)",
      min: -1,
      max: 8,
    },
  ],
  defaults: { values: "3 2 0 -4", cycleAt: "1" },
  generate: ({ values: raw, cycleAt: cRaw }) => {
    const v = toNums(raw, 9);
    const cRaw2 = toNum(cRaw, 1);
    const cycleAt = cRaw2 >= 0 && cRaw2 < v.length ? cRaw2 : -1;
    const rec = createRecorder<S>();
    const all = v.map((_, i) => i);
    const next = (i: number) => (i + 1 < v.length ? i + 1 : cycleAt);
    let steps = 0;

    const snap = (
      slow: number,
      fast: number,
      marks: Record<number, CellState>,
      note: string,
    ): S => ({
      chains: [
        {
          label: cycleAt >= 0 ? `list (the last node loops back to ${v[cycleAt]})` : "list",
          nodes: nodesOf(v, all, marks),
          pointers: { slow: ptr(slow), fast: ptr(fast) },
          extraLinks: cycleAt >= 0 ? [{ from: `n${v.length - 1}`, to: `n${cycleAt}` }] : [],
        },
      ],
      counters: { steps },
      notes: [note],
    });

    if (v.length === 0) return rec.steps;
    let slow = 0;
    let fast = 0;
    rec.push(
      "highlight",
      "Both pointers start on the head. The fast one will move twice as quickly.",
      [2],
      { slow: v[0] ?? 0, fast: v[0] ?? 0 },
      snap(0, 0, { 0: "inspect" }, "both on the head"),
    );

    for (let guard = 0; guard < v.length * 3 + 5; guard++) {
      const f1 = next(fast);
      const f2 = f1 === -1 ? -1 : next(f1);
      if (f1 === -1 || f2 === -1) {
        rec.push(
          "complete",
          "The fast pointer ran off the end, so the list has no cycle.",
          [8],
          { result: "false" },
          {
            ...snap(
              slow,
              fast,
              Object.fromEntries(all.map((i) => [i, "eliminated" as CellState])),
              "reached the end",
            ),
            output: "hasCycle = false",
          },
        );
        return rec.steps;
      }
      slow = next(slow);
      fast = f2;
      steps++;
      if (slow === fast) {
        rec.push(
          "complete",
          `Both pointers are on ${v[slow]}. A faster pointer can only catch a slower one on a loop, so the list has a cycle.`,
          [6],
          { result: "true", meet: v[slow] ?? 0 },
          {
            ...snap(slow, fast, { [slow]: "success" }, "pointers met"),
            output: "hasCycle = true",
          },
        );
        return rec.steps;
      }
      rec.push(
        "visit",
        `slow is on ${v[slow]}, fast is on ${v[fast]}. The gap closes by one node each step.`,
        [4, 5],
        { slow: v[slow] ?? 0, fast: v[fast] ?? 0, steps },
        snap(slow, fast, { [slow]: "inspect", [fast]: "compare" }, "moving"),
      );
    }

    rec.push(
      "complete",
      "The walk was stopped early to keep the animation short.",
      [8],
      { result: "stopped" },
      snap(slow, fast, {}, "stopped"),
    );
    return rec.steps;
  },
};

/* -------------------------------------------- 8. Find the Duplicate Number */

const findDuplicate: ProblemDefinition = {
  slug: "find-the-duplicate-number",
  title: "Find the Duplicate Number",
  difficulty: "Medium",
  pattern: "Cycle detection on an implicit list",
  tagline:
    "Read each value as a pointer to another index. Because a value repeats, two indexes point to the same place, which creates a loop, and the loop's entrance is the duplicate.",
  insight:
    "The reframing is the whole answer: an array of values in range is a linked list you never had to build. Phase two restarts one pointer at the head to find where the loop begins.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(1)", "Two linear walks, no sorting and no extra array."),
  code: [
    "function findDuplicate(nums) {",
    "  let slow = 0, fast = 0;",
    "  do { slow = nums[slow]; fast = nums[nums[fast]]; }",
    "  while (slow !== fast);",
    "  slow = 0;",
    "  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }",
    "  return slow;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "nums",
      label: "nums (values 1..n, one repeats)",
      placeholder: "1 3 4 2 2",
      presets: [
        { label: "Classic", value: "1 3 4 2 2" },
        { label: "Repeat at the end", value: "3 1 3 4 2" },
        { label: "Longer", value: "2 5 9 6 9 3 8 9 7 1" },
      ],
    },
  ],
  defaults: { nums: "1 3 4 2 2" },
  generate: ({ nums: raw }) => {
    const nums = toNums(raw, 12).map((n) => Math.max(0, Math.min(n, 11)));
    const rec = createRecorder<S>();
    let steps = 0;

    const snap = (
      slow: number,
      fast: number,
      marks: Record<number, CellState>,
      note: string,
      phase: string,
    ): S => ({
      rows: [
        {
          label: "nums (each value is the index it points to)",
          values: nums,
          cells: nums.map((_, i) => marks[i] ?? "default"),
          pointers: { slow, fast },
        },
      ],
      counters: { steps },
      notes: [phase, note],
    });

    if (nums.length < 2) return rec.steps;
    let slow = 0;
    let fast = 0;
    rec.push(
      "highlight",
      "Treat index i as a node whose next node is nums[i]. A repeated value means two nodes share a successor, so there is a loop.",
      [2],
      { slow, fast },
      snap(0, 0, { 0: "inspect" }, "both start at index 0", "phase 1: find a meeting point"),
    );

    let guard = 0;
    do {
      slow = nums[slow] ?? 0;
      fast = nums[nums[fast] ?? 0] ?? 0;
      steps++;
      guard++;
      rec.push(
        "visit",
        `slow follows one link to index ${slow}, fast follows two to index ${fast}.`,
        [3],
        { slow, fast, steps },
        snap(
          slow,
          fast,
          { [slow]: "inspect", [fast]: "compare" },
          "walking the implicit list",
          "phase 1: find a meeting point",
        ),
      );
    } while (slow !== fast && guard < nums.length * 3 + 5);

    rec.push(
      "update",
      `They met at index ${slow}. That is somewhere inside the loop, but not necessarily its entrance.`,
      [4],
      { meet: slow },
      snap(slow, fast, { [slow]: "success" }, "met inside the loop", "phase 1 done"),
    );

    slow = 0;
    rec.push(
      "highlight",
      "Phase two: restart one pointer at index 0 and move both one step at a time. They meet exactly at the loop's entrance.",
      [5],
      { slow, fast },
      snap(slow, fast, { [fast]: "inspect" }, "restarted at 0", "phase 2: find the entrance"),
    );

    guard = 0;
    while (slow !== fast && guard < nums.length * 3 + 5) {
      slow = nums[slow] ?? 0;
      fast = nums[fast] ?? 0;
      steps++;
      guard++;
      rec.push(
        "visit",
        `Both take one step: slow to ${slow}, fast to ${fast}.`,
        [6],
        { slow, fast },
        snap(
          slow,
          fast,
          { [slow]: "inspect", [fast]: "compare" },
          "converging",
          "phase 2: find the entrance",
        ),
      );
    }

    rec.push(
      "complete",
      `They meet at index ${slow}, and the loop's entrance is the duplicated value: ${slow}.`,
      [7],
      { result: slow },
      {
        rows: [
          {
            label: "nums",
            values: nums,
            cells: nums.map((n) =>
              n === slow ? ("success" as CellState) : ("visited" as CellState),
            ),
          },
        ],
        counters: { steps },
        output: `findDuplicate = ${slow}`,
      },
    );
    return rec.steps;
  },
};

/* ----------------------------------------------------------- 9. LRU Cache */

const lruCache: ProblemDefinition = {
  slug: "lru-cache",
  title: "LRU Cache",
  difficulty: "Medium",
  pattern: "Hash map plus a recency list",
  tagline:
    "A map gives instant lookup; an ordered list of keys remembers who was used most recently. Every touch moves a key to the front, and eviction always takes the back.",
  insight:
    "Neither structure alone is enough: the map cannot order, the list cannot search. In real code the list is doubly linked so a node can be unlinked in constant time.",
  language: "JavaScript",
  complexity: O(
    "O(1)",
    "O(1)",
    "O(1)",
    "O(capacity)",
    "Map lookup plus constant-time unlink and relink at the ends of the list.",
  ),
  code: [
    "get(key) {",
    "  if (!this.map.has(key)) return -1;",
    "  this.touch(key);          // move to the front",
    "  return this.map.get(key);",
    "}",
    "put(key, value) {",
    "  this.map.set(key, value);",
    "  this.touch(key);",
    "  if (this.map.size > this.capacity) this.evictLeastRecent();",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "ops",
      label: "operations (put k:v / get k)",
      placeholder: "put 1:1 put 2:2 get 1 put 3:3 get 2",
      presets: [
        { label: "Classic eviction", value: "put 1:1 put 2:2 get 1 put 3:3 get 2" },
        { label: "Repeated reads", value: "put 1:10 put 2:20 get 1 get 1 put 3:30" },
      ],
    },
    { kind: "number", key: "capacity", label: "capacity", min: 1, max: 5 },
  ],
  defaults: { ops: "put 1:1 put 2:2 get 1 put 3:3 get 2", capacity: "2" },
  generate: ({ ops: raw, capacity: cRaw }) => {
    const tokens = toWords(raw, 24);
    const capacity = Math.max(1, toNum(cRaw, 2));
    const rec = createRecorder<S>();
    const map = new Map<string, string>();
    let recency: string[] = [];
    const log: string[] = [];
    let operations = 0;

    const snap = (note: string, hot?: string, dead?: string): S => ({
      panels: [
        {
          label: `cache (capacity ${capacity})`,
          entries: [...map.entries()].map(([key, value]) => ({
            key,
            value,
            state:
              key === dead
                ? ("error" as CellState)
                : key === hot
                  ? ("success" as CellState)
                  : undefined,
          })),
          empty: "empty",
        },
      ],
      stacks: [
        {
          label: "recency: most recent on the left",
          orientation: "horizontal",
          items: recency.map((k, i) => ({
            value: `key ${k}`,
            state:
              k === dead
                ? ("error" as CellState)
                : k === hot
                  ? ("success" as CellState)
                  : i === recency.length - 1
                    ? ("inspect" as CellState)
                    : ("default" as CellState),
          })),
        },
      ],
      counters: { operations, size: map.size },
      notes: [
        note,
        recency.length
          ? `least recently used = key ${recency[recency.length - 1]}`
          : "nothing cached",
      ],
      output: log.length ? log.join("   ") : undefined,
    });

    const touch = (k: string) => {
      recency = [k, ...recency.filter((x) => x !== k)];
    };

    rec.push(
      "highlight",
      `The cache holds at most ${capacity} entr${capacity === 1 ? "y" : "ies"}. Both structures are empty.`,
      [1],
      { capacity },
      snap("empty cache"),
    );

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]!.toLowerCase();
      if (t === "put") {
        const [k, val] = (tokens[++i] ?? "").split(":");
        if (!k) continue;
        operations++;
        const existed = map.has(k);
        map.set(k, val ?? "0");
        touch(k);
        rec.push(
          "insert",
          existed
            ? `put(${k}, ${val}) overwrites an existing key and makes it the most recently used.`
            : `put(${k}, ${val}) stores a new entry and puts it at the front of the recency list.`,
          [6, 7, 8],
          { key: k, value: val ?? "" },
          snap(`stored key ${k}`, k),
        );
        if (map.size > capacity) {
          const victim = recency[recency.length - 1]!;
          rec.push(
            "delete",
            `The cache is over capacity, so the least recently used key (${victim}) is evicted.`,
            [9],
            { evicted: victim },
            snap("over capacity", undefined, victim),
          );
          map.delete(victim);
          recency = recency.filter((x) => x !== victim);
          rec.push(
            "update",
            `Key ${victim} is gone and the cache is back within capacity.`,
            [9],
            { size: map.size },
            snap(`evicted key ${victim}`),
          );
        }
      } else if (t === "get") {
        const k = tokens[++i] ?? "";
        operations++;
        if (!map.has(k)) {
          log.push(`get(${k}) → -1`);
          rec.push(
            "compare",
            `get(${k}): that key is not cached, so return -1. Nothing changes.`,
            [2],
            { key: k, result: -1 },
            snap(`miss on key ${k}`, undefined, k),
          );
        } else {
          const value = map.get(k)!;
          log.push(`get(${k}) → ${value}`);
          touch(k);
          rec.push(
            "visit",
            `get(${k}) returns ${value}, and reading counts as a use, so key ${k} moves to the front.`,
            [3, 4],
            { key: k, result: value },
            snap(`hit on key ${k}`, k),
          );
        }
      }
    }

    rec.push(
      "complete",
      "Every operation touched only the map and the two ends of the recency list.",
      [10],
      { size: map.size },
      {
        ...snap("done"),
        output: log.join("   ") || "no reads requested",
      },
    );
    return rec.steps;
  },
};

/* ------------------------------------------------- 10. Merge K Sorted Lists */

const mergeKLists: ProblemDefinition = {
  slug: "merge-k-sorted-lists",
  title: "Merge K Sorted Lists",
  difficulty: "Hard",
  pattern: "Pairwise merging (divide and conquer)",
  tagline:
    "Merging one list into a growing result costs k passes over everything. Merging lists in pairs instead halves the number of lists each round, so every value moves only log k times.",
  insight:
    "Two accepted answers: pairwise merging, or a min-heap of the k current heads. Both reach O(n log k): say which you are doing and why before coding.",
  language: "JavaScript",
  complexity: O(
    "O(n log k)",
    "O(n log k)",
    "O(n log k)",
    "O(1)",
    "log k rounds, each touching every value once.",
  ),
  code: [
    "function mergeKLists(lists) {",
    "  if (!lists.length) return null;",
    "  while (lists.length > 1) {",
    "    const merged = [];",
    "    for (let i = 0; i < lists.length; i += 2)",
    "      merged.push(mergeTwo(lists[i], lists[i + 1] ?? null));",
    "    lists = merged;",
    "  }",
    "  return lists[0];",
    "}",
  ],
  fields: [
    {
      kind: "text",
      key: "lists",
      label: "lists (comma-separated groups)",
      placeholder: "1 4 5, 1 3 4, 2 6",
      presets: [
        { label: "Classic", value: "1 4 5, 1 3 4, 2 6" },
        { label: "Four lists", value: "1 9, 2 8, 3 7, 4 6" },
        { label: "One list", value: "5 6 7" },
      ],
    },
  ],
  defaults: { lists: "1 4 5, 1 3 4, 2 6" },
  generate: ({ lists: raw }) => {
    const rec = createRecorder<S>();
    let lists = (raw ?? "")
      .split(",")
      .map((part) => toNums(part, 6).sort((a, b) => a - b))
      .filter((l) => l.length > 0)
      .slice(0, 6);
    let comparisons = 0;
    let round = 0;

    const snap = (note: string, highlight: number[] = [], result?: number[]): S => ({
      chains: [
        ...lists.map((l, i) => ({
          label: `list ${i + 1}`,
          nodes: l.map((value, k) => ({
            id: `r${round}l${i}n${k}`,
            value,
            state: (highlight.includes(i) ? "compare" : "default") as CellState,
          })),
        })),
        ...(result
          ? [
              {
                label: "merged pair",
                nodes: result.map((value, k) => ({
                  id: `m${round}n${k}`,
                  value,
                  state: "success" as CellState,
                })),
              },
            ]
          : []),
      ],
      counters: { comparisons, lists: lists.length, round },
      notes: [note],
    });

    if (lists.length === 0) {
      rec.push(
        "complete",
        "There are no lists to merge.",
        [2],
        { result: "null" },
        { output: "merged = empty" },
      );
      return rec.steps;
    }

    rec.push(
      "highlight",
      `${lists.length} sorted list${lists.length === 1 ? "" : "s"} to combine. Merging them in pairs keeps the work at O(n log k).`,
      [3],
      { lists: lists.length },
      snap("starting lists"),
    );

    while (lists.length > 1) {
      round++;
      const merged: number[][] = [];
      for (let i = 0; i < lists.length; i += 2) {
        const a = lists[i]!;
        const b = lists[i + 1] ?? [];
        rec.push(
          "visit",
          b.length
            ? `Round ${round}: merge list ${i + 1} with list ${i + 2}.`
            : `Round ${round}: list ${i + 1} has no partner, so it carries over unchanged.`,
          [5, 6],
          { round, pair: `${i + 1}${b.length ? ` + ${i + 2}` : ""}` },
          snap(
            `pairing lists ${i + 1}${b.length ? ` and ${i + 2}` : ""}`,
            b.length ? [i, i + 1] : [i],
          ),
        );
        const out: number[] = [];
        let x = 0;
        let y = 0;
        while (x < a.length && y < b.length) {
          comparisons++;
          out.push(a[x]! <= b[y]! ? a[x++]! : b[y++]!);
        }
        while (x < a.length) out.push(a[x++]!);
        while (y < b.length) out.push(b[y++]!);
        merged.push(out);
        rec.push(
          "update",
          `Two sorted lists merge into one in a single pass: ${out.join(" → ")}.`,
          [6],
          { length: out.length, comparisons },
          snap("pair merged", b.length ? [i, i + 1] : [i], out),
        );
      }
      lists = merged;
      rec.push(
        "eliminate",
        `Round ${round} is done: ${lists.length} list${lists.length === 1 ? "" : "s"} left. Each round halves the count.`,
        [7],
        { lists: lists.length },
        snap(`${lists.length} list${lists.length === 1 ? "" : "s"} remaining`),
      );
    }

    const final = lists[0] ?? [];
    rec.push(
      "complete",
      `One sorted list remains: ${final.join(" → ")}.`,
      [9],
      { length: final.length },
      {
        chains: [
          {
            label: "merged list",
            nodes: final.map((value, k) => ({ id: `f${k}`, value, state: "done" as CellState })),
          },
        ],
        counters: { comparisons, round },
        output: `merged = ${final.join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

/* --------------------------------------- 11. Reverse Nodes in K-Group */

const reverseKGroup: ProblemDefinition = {
  slug: "reverse-nodes-in-k-group",
  title: "Reverse Nodes in K-Group",
  difficulty: "Hard",
  pattern: "Check the group exists, reverse it, reconnect",
  tagline:
    "Take k nodes at a time. If a full group of k is available, reverse just that stretch and stitch it back between what came before and what comes after. A short tail is left alone.",
  insight:
    "Count before you reverse. Reversing first and discovering the group was short leaves the list mangled, which is the failure interviewers watch for.",
  language: "JavaScript",
  complexity: O("O(n)", "O(n)", "O(n)", "O(1)", "Each node is counted once and reversed once."),
  code: [
    "function reverseKGroup(head, k) {",
    "  let node = head;",
    "  for (let i = 0; i < k; i++) {",
    "    if (!node) return head;   // fewer than k left",
    "    node = node.next;",
    "  }",
    "  const rest = reverseKGroup(node, k);",
    "  let prev = rest, cur = head;",
    "  for (let i = 0; i < k; i++) {",
    "    const next = cur.next; cur.next = prev; prev = cur; cur = next;",
    "  }",
    "  return prev;",
    "}",
  ],
  fields: [
    {
      kind: "numbers",
      key: "values",
      label: "list",
      placeholder: "1 2 3 4 5",
      presets: [
        { label: "Classic", value: "1 2 3 4 5" },
        { label: "Exact groups", value: "1 2 3 4 5 6" },
        { label: "Longer", value: "1 2 3 4 5 6 7 8" },
      ],
    },
    { kind: "number", key: "k", label: "k (group size)", min: 1, max: 5 },
  ],
  defaults: { values: "1 2 3 4 5", k: "2" },
  generate: ({ values: raw, k: kRaw }) => {
    const v = toNums(raw, 9);
    const k = Math.max(1, Math.min(toNum(kRaw, 2), Math.max(1, v.length)));
    const rec = createRecorder<S>();
    let result: number[] = [];
    let steps = 0;

    const snap = (start: number, marks: Record<number, CellState>, note: string): S => ({
      chains: [
        { label: "done so far", nodes: nodesOf(v, result, {}, "done") },
        {
          label: "still to process",
          nodes: nodesOf(
            v,
            v.map((_, i) => i).filter((i) => i >= start),
            marks,
          ),
        },
      ],
      counters: { steps, groupSize: k },
      notes: [note],
    });

    rec.push(
      "highlight",
      `Groups of ${k}. A group is only reversed if all ${k} nodes are there.`,
      [2, 3],
      { k },
      snap(0, {}, "nothing processed yet"),
    );

    let i = 0;
    while (i < v.length) {
      const group = v.map((_, idx) => idx).filter((idx) => idx >= i && idx < i + k);
      steps++;
      if (group.length < k) {
        rec.push(
          "eliminate",
          `Only ${group.length} node${group.length === 1 ? "" : "s"} left, fewer than ${k}, so this tail stays in its original order.`,
          [4],
          { remaining: group.length },
          snap(
            i,
            Object.fromEntries(group.map((g) => [g, "eliminated" as CellState])),
            "short tail left alone",
          ),
        );
        result = [...result, ...group];
        break;
      }
      rec.push(
        "compare",
        `Counted ${k} nodes ahead: ${group.map((g) => v[g]).join(", ")}. A full group, so it will be reversed.`,
        [3, 4, 5],
        { group: group.map((g) => v[g]).join(",") },
        snap(
          i,
          Object.fromEntries(group.map((g) => [g, "compare" as CellState])),
          "full group found",
        ),
      );
      const reversedGroup = [...group].reverse();
      result = [...result, ...reversedGroup];
      rec.push(
        "update",
        `Reversed to ${reversedGroup.map((g) => v[g]).join(", ")} and stitched onto what came before.`,
        [8, 9, 10],
        { done: result.length },
        snap(
          i + k,
          Object.fromEntries(group.map((g) => [g, "success" as CellState])),
          "group reversed",
        ),
      );
      i += k;
    }

    rec.push(
      "complete",
      `Final list: ${result.map((idx) => v[idx]).join(" → ")}.`,
      [12],
      { length: result.length },
      {
        chains: [{ label: "result", nodes: nodesOf(v, result, {}, "done") }],
        counters: { steps },
        output: `list = ${result.map((idx) => v[idx]).join(" → ")}`,
      },
    );
    return rec.steps;
  },
};

export const LINKED_LIST_PROBLEMS: ProblemDefinition[] = [
  reverseList,
  mergeTwoLists,
  reorderList,
  removeNthFromEnd,
  copyRandomList,
  addTwoNumbers,
  linkedListCycle,
  findDuplicate,
  lruCache,
  mergeKLists,
  reverseKGroup,
];
