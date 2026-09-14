import { createRecorder } from "../recorder";
import type { HashVizState } from "../state";
import type { AlgorithmDefinition, CellState } from "../types";

export interface HashInput {
  keys: string[];
  buckets?: number;
  lookup?: string;
  values?: number[];
  target?: number;
}

type Def = AlgorithmDefinition<HashVizState, HashInput>;
type Bucket = { entries: { key: string; value: number; state: CellState }[]; state: CellState };

function emptyBuckets(n: number): Bucket[] {
  return Array.from({ length: n }, () => ({ entries: [], state: "default" as CellState }));
}

/** Simple, explainable hash: sum of character codes modulo the bucket count. */
function hash(key: string, n: number) {
  let sum = 0;
  for (const ch of key) sum += ch.charCodeAt(0);
  return sum % n;
}

const clean = (b: Bucket[]): Bucket[] =>
  b.map((bucket) => ({
    state: "default",
    entries: bucket.entries.map((e) => ({ ...e, state: "default" as CellState })),
  }));

/* ------------------------------------------------------------------ insert */

export const hashInsert: Def = {
  slug: "hash-insert",
  title: "Insert and collisions",
  tagline:
    "A hash function turns a key into a bucket index. Two keys can land in the same bucket: that is a collision, and chaining just puts both in a small list there.",
  language: "JavaScript",
  code: [
    "function hash(key, n) {",
    "  let sum = 0;",
    "  for (const ch of key) sum += ch.charCodeAt(0);",
    "  return sum % n;",
    "}",
    "",
    "function set(table, key, value) {",
    "  const i = hash(key, table.length);",
    "  const bucket = table[i];",
    "  const found = bucket.find(e => e.key === key);",
    "  if (found) found.value = value;",
    "  else bucket.push({ key, value });",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(1)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "Computing the bucket is constant work, so inserts are O(1) on average. The O(n) worst case is when every key collides into one bucket: a good hash function and resizing keep that from happening.",
  },
  generate: ({ keys, buckets = 5 }) => {
    const r = createRecorder<HashVizState>();
    const n = Math.max(3, Math.min(buckets, 8));
    let table = emptyBuckets(n);
    let collisions = 0;

    r.push(
      "highlight",
      `An empty table with ${n} buckets. Keys will be placed by hash(key) % ${n}.`,
      [1],
      { buckets: n, size: 0 },
      {
        buckets: table,
        counters: { buckets: n, keys: 0, collisions: 0 },
      },
    );

    keys.slice(0, 8).forEach((key, k) => {
      const i = hash(key, n);
      const sum = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      table = clean(table).map((b, j) => (j === i ? { ...b, state: "inspect" } : b));
      r.push(
        "highlight",
        `hash("${key}") adds the character codes (${sum}) and takes % ${n}, giving bucket ${i}. Notice we never search: the key computes its own address.`,
        [2, 3, 4],
        { key, sum, bucket: i },
        { buckets: table, probe: { key, hash: i }, counters: { buckets: n, keys: k, collisions } },
      );

      const occupied = table[i]!.entries.length > 0;
      if (occupied) collisions += 1;
      table = table.map((b, j) =>
        j === i
          ? {
              state: (occupied ? "compare" : "success") as CellState,
              entries: [
                ...b.entries.map((e) => ({ ...e, state: "done" as CellState })),
                { key, value: k + 1, state: "success" as CellState },
              ],
            }
          : b,
      );
      r.push(
        occupied ? "insert" : "insert",
        occupied
          ? `Bucket ${i} already holds ${table[i]!.entries.length - 1} entry(ies) (a collision). Chaining appends "${key}" to that bucket's small list, so nothing is lost; lookups in this bucket just compare a couple of keys.`
          : `Bucket ${i} was empty, so "${key}" is stored directly. This is the O(1) case.`,
        [8, 9, 12],
        { key, bucket: i, collisions },
        {
          buckets: table,
          probe: { key, hash: i },
          counters: { buckets: n, keys: k + 1, collisions },
        },
      );
    });

    r.push(
      "complete",
      `${Math.min(keys.length, 8)} keys stored with ${collisions} collision(s). Average lookup stays close to O(1) as long as the buckets are spread evenly; real maps resize once the load factor grows past about 0.75.`,
      [7, 13],
      { keys: Math.min(keys.length, 8), collisions },
      {
        buckets: clean(table),
        counters: { buckets: n, keys: Math.min(keys.length, 8), collisions },
      },
    );
    return r.steps;
  },
};

/* ------------------------------------------------------------------ lookup */

export const hashLookup: Def = {
  slug: "hash-lookup",
  title: "Lookup",
  tagline:
    "Hash the key, go straight to the bucket, compare the few keys living there. No scanning of the other buckets: that is the whole reason hash maps exist.",
  language: "JavaScript",
  code: [
    "function get(table, key) {",
    "  const i = hash(key, table.length);",
    "  for (const entry of table[i]) {",
    "    if (entry.key === key) return entry.value;",
    "  }",
    "  return undefined;",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(1)",
    timeWorst: "O(n)",
    space: "O(1)",
    plainEnglish:
      "We only ever look inside one bucket. The average bucket holds a constant number of entries, so lookup is constant time; only a pathological hash makes it linear.",
  },
  generate: ({ keys, buckets = 5, lookup = "" }) => {
    const r = createRecorder<HashVizState>();
    const n = Math.max(3, Math.min(buckets, 8));
    let table = emptyBuckets(n);
    keys.slice(0, 8).forEach((key, k) => {
      const i = hash(key, n);
      table[i]!.entries.push({ key, value: k + 1, state: "default" });
    });
    const target = lookup || keys[0] || "a";
    const i = hash(target, n);

    r.push(
      "highlight",
      `The table already holds ${keys.length} keys. We want the value for "${target}".`,
      [1],
      { key: target },
      {
        buckets: clean(table),
        counters: { buckets: n },
      },
    );
    r.push(
      "highlight",
      `hash("${target}") = ${i}, so only bucket ${i} can contain it. Every other bucket is irrelevant: no scanning.`,
      [2],
      { key: target, bucket: i },
      {
        buckets: clean(table).map((b, j) => ({
          ...b,
          state: j === i ? "inspect" : "eliminated",
        })),
        probe: { key: target, hash: i },
        counters: { buckets: n },
      },
    );

    const entries = table[i]!.entries;
    let found = false;
    for (let k = 0; k < entries.length; k++) {
      const hit = entries[k]!.key === target;
      r.push(
        hit ? "highlight" : "compare",
        hit
          ? `"${target}" matches, so we return ${entries[k]!.value}. Total work: one hash plus ${k + 1} key comparison(s).`
          : `"${entries[k]!.key}" is not "${target}": same bucket, different key. This is what a collision costs at read time.`,
        [3, 4],
        { key: target, comparisons: k + 1, found: hit },
        {
          buckets: clean(table).map((b, j) =>
            j === i
              ? {
                  state: "inspect",
                  entries: b.entries.map((e, m) => ({
                    ...e,
                    state: (m === k ? (hit ? "success" : "error") : "default") as CellState,
                  })),
                }
              : { ...b, state: "eliminated" },
          ),
          probe: { key: target, hash: i },
          counters: { buckets: n, comparisons: k + 1 },
        },
      );
      if (hit) {
        found = true;
        break;
      }
    }

    if (!found) {
      r.push(
        "complete",
        `Bucket ${i} does not contain "${target}", so the answer is undefined. A miss is just as cheap as a hit: we still only looked in one bucket.`,
        [6],
        { key: target, found: false },
        {
          buckets: clean(table).map((b, j) => ({ ...b, state: j === i ? "error" : "eliminated" })),
          probe: { key: target, hash: i },
          counters: { buckets: n },
        },
      );
    }
    return r.steps;
  },
};

/* ------------------------------------------------------------- two sum map */

export const twoSumHash: Def = {
  slug: "two-sum-hash",
  title: "Two Sum with a hash map",
  tagline:
    "The question that teaches hashing. Instead of trying every pair, remember what you have seen and ask the map for the missing partner: O(n²) becomes O(n).",
  language: "JavaScript",
  code: [
    "function twoSum(nums, target) {",
    "  const seen = new Map();",
    "  for (let i = 0; i < nums.length; i++) {",
    "    const need = target - nums[i];",
    "    if (seen.has(need)) return [seen.get(need), i];",
    "    seen.set(nums[i], i);",
    "  }",
    "  return [];",
    "}",
  ],
  complexity: {
    timeBest: "O(1)",
    timeAverage: "O(n)",
    timeWorst: "O(n)",
    space: "O(n)",
    plainEnglish:
      "One pass with constant-time lookups. We trade O(n) memory for dropping a whole nested loop: the single most common trade in interviews.",
  },
  generate: ({ values = [], target = 0, buckets = 5 }) => {
    const r = createRecorder<HashVizState>();
    const n = Math.max(3, Math.min(buckets, 8));
    let table = emptyBuckets(n);

    r.push(
      "highlight",
      `Looking for two values that add to ${target} in [${values.join(", ")}]. The map will remember every value we have already passed.`,
      [2],
      { target },
      { buckets: table, counters: { target, seen: 0 } },
    );

    for (let i = 0; i < values.length; i++) {
      const v = values[i]!;
      const need = target - v;
      const bucketIndex = hash(String(need), n);
      const hit = table[bucketIndex]!.entries.find((e) => e.key === String(need));

      r.push(
        "compare",
        `At ${v} we need ${need} to reach ${target}. Ask the map for ${need}: one constant-time question instead of scanning the rest of the array.`,
        [4, 5],
        { i, value: v, need, found: !!hit },
        {
          buckets: clean(table).map((b, j) => ({
            ...b,
            state: j === bucketIndex ? "inspect" : "default",
          })),
          probe: { key: String(need), hash: bucketIndex },
          counters: { target, seen: i },
        },
      );

      if (hit) {
        r.push(
          "complete",
          `${need} is in the map at index ${hit.value}, so the answer is [${hit.value}, ${i}]. We found it in one pass: no pair was ever tried twice.`,
          [5],
          { answer: `[${hit.value}, ${i}]`, comparisons: i + 1 },
          {
            buckets: clean(table).map((b, j) =>
              j === bucketIndex
                ? {
                    state: "success",
                    entries: b.entries.map((e) => ({
                      ...e,
                      state: (e.key === String(need) ? "success" : "default") as CellState,
                    })),
                  }
                : b,
            ),
            probe: { key: String(need), hash: bucketIndex },
            counters: { target, seen: i },
          },
        );
        return r.steps;
      }

      const ownBucket = hash(String(v), n);
      table = clean(table).map((b, j) =>
        j === ownBucket
          ? {
              state: "success",
              entries: [...b.entries, { key: String(v), value: i, state: "success" as CellState }],
            }
          : b,
      );
      r.push(
        "insert",
        `${need} was not there yet, so store ${v} → index ${i}. A later value can now find ${v} instantly.`,
        [6],
        { stored: v, index: i },
        { buckets: table, counters: { target, seen: i + 1 } },
      );
    }

    r.push(
      "complete",
      `No pair adds to ${target}. We still only walked the array once: a miss costs the same O(n).`,
      [8],
      { answer: "[]" },
      { buckets: clean(table), counters: { target, seen: values.length } },
    );
    return r.steps;
  },
};

export const HASH_OPS: Def[] = [hashInsert, hashLookup, twoSumHash];
