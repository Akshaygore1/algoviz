import { createRecorder } from "../recorder";
import type { QueueVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface QueueInput {
  values: number[];
  capacity?: number;
}

type Def = AlgorithmDefinition<QueueVizState, QueueInput>;
type Slot = { value: string | number; state: CellState } | null;

/* ------------------------------------------------------ simple queue (FIFO) */

export const queueBasics: Def = {
  slug: "queue-enqueue-dequeue",
  title: "Enqueue and dequeue",
  tagline:
    "First in, first out. Items join at the rear and leave at the front, so the order is preserved: the behaviour behind task schedulers and BFS.",
  language: "JavaScript",
  code: [
    "class Queue {",
    "  constructor() { this.items = []; this.front = 0; }",
    "  enqueue(x) { this.items.push(x); }",
    "  dequeue() { return this.items[this.front++]; }",
    "  peek() { return this.items[this.front]; }",
    "  isEmpty() { return this.front >= this.items.length; }",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(1)",
    timeWorst: "O(1)",
    space: "O(n)",
    plainEnglish:
      "Both ends are tracked by an index, so nothing shifts. Using array.shift() instead would make dequeue O(n), a very common mistake.",
  },
  generate: ({ values }) => {
    const r = createRecorder<QueueVizState>();
    let slots: Slot[] = [];
    let front = 0;
    const out: (string | number)[] = [];

    r.push(
      "highlight",
      "The queue is empty: front and rear have nothing to point at.",
      [2, 6],
      { size: 0 },
      {
        slots: [],
        front: null,
        rear: null,
        counters: { size: 0 },
      },
    );

    values.forEach((v, i) => {
      slots = [
        ...slots.map((s) => (s ? { ...s, state: "done" as CellState } : s)),
        { value: v, state: "success" },
      ];
      r.push(
        "insert",
        `enqueue(${v}) adds ${v} at the rear. The front is still ${values[0]}: arriving later never lets you jump the queue.`,
        [3],
        { enqueued: v, front: values[front] ?? null, size: i + 1 },
        { slots, front, rear: slots.length - 1, counters: { size: slots.length - front } },
      );
    });

    for (let k = 0; k < Math.min(2, values.length); k++) {
      const value = slots[front]!.value;
      r.push(
        "highlight",
        `dequeue() takes ${value}, the item that has waited longest. We move the front index instead of shifting every element left.`,
        [4],
        { dequeuing: value, size: slots.length - front },
        {
          slots: slots.map((s, i) =>
            s ? { ...s, state: i === front ? "error" : i < front ? "eliminated" : "done" } : s,
          ),
          front,
          rear: slots.length - 1,
          counters: { size: slots.length - front },
          output: out.join(" "),
        },
      );
      out.push(value);
      front += 1;
      r.push(
        "delete",
        `${value} has left. front now points at ${slots[front]?.value ?? "nothing"} and the removal cost O(1): no element moved.`,
        [4],
        { dequeued: value, front: slots[front]?.value ?? null, size: slots.length - front },
        {
          slots: slots.map((s, i) => (s ? { ...s, state: i < front ? "eliminated" : "done" } : s)),
          front: front < slots.length ? front : null,
          rear: slots.length - 1,
          counters: { size: slots.length - front },
          output: out.join(" "),
        },
      );
    }

    r.push(
      "complete",
      `Order out (${out.join(", ")}) matches order in: that is the whole promise of a queue. The greyed slots are wasted space, which is exactly the problem a circular queue solves.`,
      [1, 7],
      { removed: out.join(","), remaining: slots.length - front },
      {
        slots: slots.map((s, i) => (s ? { ...s, state: i < front ? "eliminated" : "done" } : s)),
        front: front < slots.length ? front : null,
        rear: slots.length - 1,
        counters: { size: slots.length - front },
        output: out.join(" "),
      },
    );
    return r.steps;
  },
};

/* --------------------------------------------------------- circular queue */

export const circularQueue: Def = {
  slug: "circular-queue",
  title: "Circular queue",
  tagline:
    "A fixed array where indexes wrap with % capacity, so dequeued slots get reused. No shifting, no wasted space, constant time both ends.",
  language: "JavaScript",
  code: [
    "class CircularQueue {",
    "  constructor(k) { this.a = new Array(k); this.n = k; this.front = 0; this.size = 0; }",
    "  enqueue(x) {",
    "    if (this.size === this.n) return false;",
    "    this.a[(this.front + this.size) % this.n] = x;",
    "    this.size++;",
    "  }",
    "  dequeue() {",
    "    if (this.size === 0) return null;",
    "    const x = this.a[this.front];",
    "    this.front = (this.front + 1) % this.n;",
    "    this.size--;",
    "    return x;",
    "  }",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(1)",
    timeWorst: "O(1)",
    space: "O(k)",
    plainEnglish:
      "Both operations are pure index arithmetic. Memory is fixed at the capacity you choose: full means full, which is the trade-off for never shifting.",
  },
  generate: ({ values, capacity = 5 }) => {
    const r = createRecorder<QueueVizState>();
    const n = Math.max(3, Math.min(capacity, 8));
    let slots: Slot[] = Array.from({ length: n }, () => null);
    let front = 0;
    let size = 0;
    const out: (string | number)[] = [];

    r.push(
      "highlight",
      `A circular queue of capacity ${n}. front stays put until we remove something; the rear position is computed as (front + size) % ${n}.`,
      [2],
      { capacity: n, size: 0 },
      { slots, front: null, rear: null, circular: true, counters: { size: 0, capacity: n } },
    );

    const enqueue = (v: number) => {
      if (size === n) {
        r.push(
          "highlight",
          `The queue is full (size ${size} = capacity ${n}), so enqueue(${v}) is rejected. A circular queue never grows: that is the deal.`,
          [4],
          { rejected: v, size },
          {
            slots,
            front,
            rear: (front + size - 1) % n,
            circular: true,
            counters: { size, capacity: n },
          },
        );
        return;
      }
      const at = (front + size) % n;
      slots = slots.map((s, i) =>
        i === at
          ? { value: v, state: "success" as CellState }
          : s
            ? { ...s, state: "done" as CellState }
            : s,
      );
      size += 1;
      r.push(
        "insert",
        `enqueue(${v}) writes to index (${front} + ${size - 1}) % ${n} = ${at}.${at < front ? " Notice the index wrapped around to the start: the reused slot is the whole point." : ""}`,
        [5, 6],
        { enqueued: v, index: at, size },
        { slots, front, rear: at, circular: true, counters: { size, capacity: n } },
      );
    };

    const dequeue = () => {
      if (size === 0) return;
      const value = slots[front]!.value;
      out.push(value);
      slots = slots.map((s, i) => (i === front ? null : s));
      front = (front + 1) % n;
      size -= 1;
      r.push(
        "delete",
        `dequeue() removes ${value} and moves front to ${front} with % ${n}. The freed slot stays available for a future enqueue.`,
        [9, 10, 11],
        { dequeued: value, front, size },
        {
          slots,
          front: size ? front : null,
          rear: size ? (front + size - 1) % n : null,
          circular: true,
          counters: { size, capacity: n },
          output: out.join(" "),
        },
      );
    };

    values.slice(0, n).forEach(enqueue);
    dequeue();
    dequeue();
    const extra = values.slice(n, n + 2);
    (extra.length ? extra : [99]).forEach(enqueue);

    r.push(
      "complete",
      `Every operation was index arithmetic: no element ever moved and no slot was wasted. Removed so far: ${out.join(", ")}.`,
      [1, 14],
      { size, capacity: n },
      {
        slots,
        front: size ? front : null,
        rear: size ? (front + size - 1) % n : null,
        circular: true,
        counters: { size, capacity: n },
        output: out.join(" "),
      },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------------- deque */

export const dequeOps: Def = {
  slug: "deque",
  title: "Deque (double-ended queue)",
  tagline:
    "Insert and remove at both ends in O(1). This is the structure behind sliding-window maximum, where you drop useless values from the back.",
  language: "JavaScript",
  code: [
    "class Deque {",
    "  pushFront(x) { this.items.unshift(x); }",
    "  pushBack(x) { this.items.push(x); }",
    "  popFront() { return this.items.shift(); }",
    "  popBack() { return this.items.pop(); }",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(1)",
    timeWorst: "O(1)",
    space: "O(n)",
    plainEnglish:
      "A real deque is backed by a doubly linked list or a ring buffer, so all four operations are constant time. (JavaScript's unshift/shift on a plain array are O(n), a detail worth mentioning in an interview.)",
  },
  generate: ({ values }) => {
    const r = createRecorder<QueueVizState>();
    let slots: Slot[] = [];
    const done = (s: Slot): Slot => (s ? { ...s, state: "done" } : s);

    r.push(
      "highlight",
      "A deque is open at both ends. Four operations, all constant time.",
      [1],
      { size: 0 },
      {
        slots: [],
        front: null,
        rear: null,
        counters: { size: 0 },
      },
    );

    const [a = 1, b = 2, c = 3, d = 4] = values;

    slots = [...slots.map(done), { value: b, state: "success" }];
    r.push(
      "insert",
      `pushBack(${b}) adds at the rear, like a normal queue.`,
      [3],
      { size: slots.length },
      { slots, front: 0, rear: slots.length - 1, counters: { size: slots.length } },
    );

    slots = [{ value: a, state: "success" }, ...slots.map(done)];
    r.push(
      "insert",
      `pushFront(${a}) adds at the front, something a plain queue cannot do. ${a} is now first in line.`,
      [2],
      { size: slots.length },
      { slots, front: 0, rear: slots.length - 1, counters: { size: slots.length } },
    );

    slots = [...slots.map(done), { value: c, state: "success" }];
    r.push(
      "insert",
      `pushBack(${c}) at the rear again.`,
      [3],
      { size: slots.length },
      { slots, front: 0, rear: slots.length - 1, counters: { size: slots.length } },
    );

    const back = slots[slots.length - 1]!;
    slots = slots.slice(0, -1).map(done);
    r.push(
      "delete",
      `popBack() removes ${back.value}. Being able to discard from the back is exactly what sliding-window maximum needs: values that can never be the answer are thrown away.`,
      [5],
      { removed: Number(back.value), size: slots.length },
      { slots, front: 0, rear: slots.length - 1, counters: { size: slots.length } },
    );

    const frontItem = slots[0]!;
    slots = slots.slice(1).map(done);
    r.push(
      "delete",
      `popFront() removes ${frontItem.value}, the queue-like end.`,
      [4],
      { removed: Number(frontItem.value), size: slots.length },
      {
        slots,
        front: slots.length ? 0 : null,
        rear: slots.length ? slots.length - 1 : null,
        counters: { size: slots.length },
      },
    );

    slots = [...slots.map(done), { value: d, state: "success" }];
    r.push(
      "complete",
      `A deque behaves as a stack when you use one end and as a queue when you use both: one structure, two behaviours, all O(1).`,
      [1, 6],
      { size: slots.length },
      { slots, front: 0, rear: slots.length - 1, counters: { size: slots.length } },
    );
    return r.steps;
  },
};

export const QUEUE_OPS: Def[] = [queueBasics, circularQueue, dequeOps];
