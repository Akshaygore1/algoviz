export interface Pattern {
  id: string;
  name: string;
  summary: string;
  recognize: string[];
  template: string;
  mistakes: string[];
  complexity: string;
}

export const patterns = [
  {
    id: "hash-lookup",
    name: "Hash Lookup",
    summary:
      "Store the information you will need later, usually an index, complement or membership flag, so each lookup replaces a scan.",
    recognize: [
      "A brute-force solution compares each item with every earlier or later item",
      "You need to know whether a value, complement or key has appeared already",
      "Order does not matter, but fast membership or retrieval does",
    ],
    template:
      "const seen = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const need = target - nums[i];\n  if (seen.has(need)) return [seen.get(need), i];\n  seen.set(nums[i], i);\n}",
    mistakes: [
      "Storing a value when you need its index or other metadata later",
      "Adding the current item before checking, which can let it match itself",
    ],
    complexity: "O(n) time, O(n) space",
  },
  {
    id: "frequency-map",
    name: "Frequency Map",
    summary:
      "Count how often each value occurs, then use those counts to compare collections, find majorities or rank repeated items.",
    recognize: [
      "The question asks how often values occur or whether two collections contain the same multiset",
      "Sorting would work but adds unnecessary O(n log n) cost",
      "You need to count, spend or compare occurrences while scanning",
    ],
    template:
      "const count = new Map();\nfor (const item of items) {\n  count.set(item, (count.get(item) ?? 0) + 1);\n}\nfor (const item of other) {\n  if (!count.get(item)) return false;\n  count.set(item, count.get(item) - 1);\n}",
    mistakes: [
      "Checking only whether a key exists when its remaining count matters",
      "Leaving zero-count entries behind when later logic treats existence as availability",
    ],
    complexity: "O(n) time, O(k) space",
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    summary:
      "Walk two indexes through a sequence (from both ends, or at different speeds) instead of nesting two loops.",
    recognize: [
      "The array is sorted, or can be sorted cheaply",
      "You are looking for a pair, triplet or a symmetric property",
      "A brute-force answer would compare every pair, O(n²)",
    ],
    template: "let l = 0, r = n - 1;\nwhile (l < r) {\n  if (condition) l++;\n  else r--;\n}",
    mistakes: [
      "Forgetting the array must be sorted",
      "Moving both pointers when only one should move",
    ],
    complexity: "O(n) time, O(1) space",
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    summary:
      "Maintain a contiguous window and update the answer as it grows and shrinks, instead of recomputing every subarray.",
    recognize: [
      "Contiguous subarrays or substrings",
      "Maximum/minimum window, longest/shortest valid segment",
      "You need to maintain information while moving through the array",
    ],
    template:
      "let left = 0;\nfor (let right = 0; right < n; right++) {\n  add(arr[right]);\n  while (invalid()) remove(arr[left++]);\n  best = Math.max(best, right - left + 1);\n}",
    mistakes: [
      "Shrinking with an if instead of a while",
      "Updating the answer before restoring validity",
    ],
    complexity: "O(n) time, O(k) space",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    summary: "Halve a sorted (or monotonic) search space on every comparison.",
    recognize: [
      "Sorted input, or a monotonic yes/no property",
      "The problem asks for a boundary: first/last element that satisfies something",
      "Constraints hint at log n (n up to 10⁹)",
    ],
    template:
      "let lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n  const mid = lo + ((hi - lo) >> 1);\n  if (ok(mid)) hi = mid - 1;\n  else lo = mid + 1;\n}",
    mistakes: [
      "Overflow-prone (lo + hi) / 2 in fixed-width languages",
      "Off-by-one on the loop condition causing infinite loops",
    ],
    complexity: "O(log n) time, O(1) space",
  },
  {
    id: "fast-slow",
    name: "Fast & Slow Pointers",
    summary:
      "Advance one pointer twice as fast as the other to find cycles, middles and k-from-end positions in one pass.",
    recognize: ["Linked lists", "Cycle detection", "Finding the middle without knowing the length"],
    template:
      "let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n}",
    mistakes: [
      "Not null-checking fast.next",
      "Assuming slow lands on the exact middle for even lengths",
    ],
    complexity: "O(n) time, O(1) space",
  },
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    summary: "Precompute cumulative sums so any range sum becomes one subtraction.",
    recognize: [
      "Many range-sum queries",
      "Subarray sums equal to a target",
      "Repeated recomputation of overlapping sums",
    ],
    template:
      "prefix[0] = 0;\nfor (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];\n// sum(l..r) = prefix[r + 1] - prefix[l]",
    mistakes: [
      "Off-by-one between 0-indexed array and 1-indexed prefix",
      "Forgetting the empty-prefix entry when counting subarrays",
    ],
    complexity: "O(n) build, O(1) per query",
  },
  {
    id: "stack-matching",
    name: "Stack Matching",
    summary:
      "Push unfinished opening tokens onto a stack and resolve them only when their matching closer arrives.",
    recognize: [
      "Nested or paired delimiters such as brackets, tags or expressions",
      "The most recently opened item must close first",
      "A left-to-right scan needs to remember unresolved work",
    ],
    template:
      'const openFor = new Map([[")", "("], ["]", "["], ["}", "{"]]);\nconst stack = [];\nfor (const ch of text) {\n  if (!openFor.has(ch)) stack.push(ch);\n  else if (stack.pop() !== openFor.get(ch)) return false;\n}\nreturn stack.length === 0;',
    mistakes: [
      "Forgetting to reject leftover opening tokens after the scan",
      "Treating any closer as valid instead of checking the matching opener",
    ],
    complexity: "O(n) time, O(n) space",
  },
  {
    id: "auxiliary-stack",
    name: "Auxiliary Stack",
    summary:
      "Keep a second stack synchronized with the main stack so an aggregate such as the current minimum is always available.",
    recognize: [
      "A stack must answer min, max or similar summary queries in O(1)",
      "Recomputing the answer by scanning the stack would be too slow",
      "Each push and pop can update a small amount of derived state",
    ],
    template:
      "const values = [];\nconst mins = [];\nfunction push(x) {\n  values.push(x);\n  mins.push(Math.min(x, mins.at(-1) ?? x));\n}\nfunction pop() { mins.pop(); return values.pop(); }",
    mistakes: [
      "Updating the auxiliary stack on push but not pop",
      "Using one global minimum instead of preserving the minimum at every depth",
    ],
    complexity: "O(1) per operation, O(n) space",
  },
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    summary:
      "Keep a stack sorted in one direction to answer next-greater / previous-smaller questions in linear time.",
    recognize: [
      "Next greater or smaller element",
      "Largest rectangle / span problems",
      "Daily temperatures style questions",
    ],
    template:
      "for (let i = 0; i < n; i++) {\n  while (stack.length && arr[stack.at(-1)] < arr[i]) resolve(stack.pop(), i);\n  stack.push(i);\n}",
    mistakes: [
      "Storing values instead of indexes when distance matters",
      "Wrong comparison direction for the required order",
    ],
    complexity: "O(n) time, O(n) space",
  },
  {
    id: "pointer-rewiring",
    name: "Pointer Rewiring",
    summary:
      "Change linked-list links one node at a time while preserving the next node before overwriting its pointer.",
    recognize: [
      "A linked list must be reversed, reordered, deleted from or spliced in place",
      "The output can reuse the existing nodes instead of allocating a new list",
      "Each operation depends on not losing the remainder of the chain",
    ],
    template:
      "let prev = null;\nlet current = head;\nwhile (current) {\n  const next = current.next;\n  current.next = prev;\n  prev = current;\n  current = next;\n}\nreturn prev;",
    mistakes: [
      "Overwriting current.next before saving the remainder of the list",
      "Returning the old head instead of the new head after rewiring",
    ],
    complexity: "O(n) time, O(1) space",
  },
  {
    id: "merge",
    name: "Merge",
    summary:
      "Walk two ordered inputs together, always taking the smaller next item and attaching it to a growing result.",
    recognize: [
      "Two sorted arrays or lists must become one sorted result",
      "You need to compare the next candidate from two sources",
      "A dummy head or output pointer removes special cases at the start",
    ],
    template:
      "const dummy = { next: null };\nlet tail = dummy;\nwhile (a && b) {\n  if (a.val <= b.val) [tail.next, a] = [a, a.next];\n  else [tail.next, b] = [b, b.next];\n  tail = tail.next;\n}\ntail.next = a ?? b;\nreturn dummy.next;",
    mistakes: [
      "Forgetting to append the non-empty remainder after one input ends",
      "Skipping a dummy head and creating avoidable first-node edge cases",
    ],
    complexity: "O(n + m) time, O(1) extra space",
  },
  {
    id: "bfs",
    name: "BFS",
    summary:
      "Explore level by level with a queue: the default for shortest paths on unweighted graphs.",
    recognize: [
      "Shortest path with equal edge weights",
      "Level-order traversal",
      "Minimum number of steps",
    ],
    template:
      "const q = [start]; seen.add(start);\nwhile (q.length) {\n  const node = q.shift();\n  for (const nb of adj[node]) if (!seen.has(nb)) { seen.add(nb); q.push(nb); }\n}",
    mistakes: [
      "Marking visited on dequeue instead of enqueue",
      "Using BFS on weighted graphs where Dijkstra is needed",
    ],
    complexity: "O(V + E) time, O(V) space",
  },
  {
    id: "topological-sort",
    name: "Topological Sort",
    summary:
      "Process a directed acyclic graph in dependency order by repeatedly taking nodes whose prerequisites are already satisfied.",
    recognize: [
      "Dependencies, prerequisites, build order or course scheduling",
      "The graph is directed and the requested answer is a valid ordering",
      "You also need to detect whether a dependency cycle makes an order impossible",
    ],
    template:
      "const q = nodes.filter((node) => indegree[node] === 0);\nconst order = [];\nwhile (q.length) {\n  const node = q.shift();\n  order.push(node);\n  for (const next of graph[node]) {\n    if (--indegree[next] === 0) q.push(next);\n  }\n}\nreturn order.length === nodes.length ? order : [];",
    mistakes: [
      "Adding a node to the queue before all of its prerequisites are removed",
      "Returning a partial order without checking for a cycle",
    ],
    complexity: "O(V + E) time, O(V) space",
  },
  {
    id: "dfs",
    name: "DFS",
    summary: "Follow one path as deep as possible, then backtrack: recursion or an explicit stack.",
    recognize: [
      "Connectivity and components",
      "Path existence",
      "Tree traversals and cycle detection",
    ],
    template:
      "function dfs(node) {\n  seen.add(node);\n  for (const nb of adj[node]) if (!seen.has(nb)) dfs(nb);\n}",
    mistakes: [
      "Missing visited set causing infinite recursion",
      "Stack overflow on deep graphs where iteration is safer",
    ],
    complexity: "O(V + E) time, O(V) space",
  },
  {
    id: "top-k",
    name: "Heap / Top K",
    summary: "Keep a heap of size k so you never sort the entire input.",
    recognize: ["K largest / smallest / most frequent", "Streaming data", "Merging k sorted lists"],
    template: "for (const x of items) {\n  heap.push(x);\n  if (heap.size > k) heap.pop();\n}",
    mistakes: [
      "Using a max-heap when a min-heap of size k is required",
      "Sorting everything for O(n log n) when O(n log k) exists",
    ],
    complexity: "O(n log k) time, O(k) space",
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    summary:
      "Identify overlapping subproblems, then cache them: memoization top-down or a table bottom-up.",
    recognize: [
      "Count the ways / min cost / max value",
      "The brute-force recursion repeats identical calls",
      "Choices at each step with optimal substructure",
    ],
    template: "dp[0] = base;\nfor (let i = 1; i <= n; i++) dp[i] = combine(dp[i - 1], dp[i - 2]);",
    mistakes: [
      "Wrong base cases",
      "Iterating in an order where a needed subproblem is not ready yet",
    ],
    complexity: "Usually O(n·states) time and space, often reducible",
  },
] satisfies Pattern[];

export type PatternId = (typeof patterns)[number]["id"];

export function getPattern(id: string) {
  return patterns.find((p) => p.id === id);
}

export function getPatternNames(ids: readonly PatternId[]) {
  return ids.flatMap((id) => {
    const pattern = getPattern(id);
    return pattern ? [pattern.name] : [];
  });
}
