import type { PatternId } from "@/data/patterns";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  patternIds: PatternId[];
  companies: string[];
}

/** Seed interview set. Shaped for a future database table. */
export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "HashMap"],
    patternIds: ["hash-lookup"],
    companies: ["Amazon", "Google", "Microsoft"],
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    topics: ["Array", "HashSet"],
    patternIds: ["hash-lookup"],
    companies: ["Amazon", "Apple"],
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    topics: ["String", "HashMap"],
    patternIds: ["frequency-map"],
    companies: ["Meta", "Bloomberg"],
  },
  {
    id: "product-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topics: ["Array"],
    patternIds: ["prefix-sum"],
    companies: ["Amazon", "Meta"],
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    topics: ["String"],
    patternIds: ["two-pointers"],
    companies: ["Microsoft", "Google"],
  },
  {
    id: "two-sum-ii",
    title: "Two Sum II",
    difficulty: "Medium",
    topics: ["Array"],
    patternIds: ["two-pointers"],
    companies: ["Amazon"],
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    topics: ["Array"],
    patternIds: ["two-pointers"],
    companies: ["Amazon", "Adobe"],
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Array"],
    patternIds: ["sliding-window"],
    companies: ["Amazon", "Google"],
  },
  {
    id: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["String", "HashSet"],
    patternIds: ["sliding-window"],
    companies: ["Amazon", "Meta", "Microsoft"],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    patternIds: ["stack-matching"],
    companies: ["Google", "Amazon"],
  },
  {
    id: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    topics: ["Stack"],
    patternIds: ["auxiliary-stack"],
    companies: ["Amazon", "Bloomberg"],
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    topics: ["Stack", "Array"],
    patternIds: ["monotonic-stack"],
    companies: ["Meta", "Uber"],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topics: ["Array"],
    patternIds: ["binary-search"],
    companies: ["Microsoft", "Google"],
  },
  {
    id: "search-rotated",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topics: ["Array"],
    patternIds: ["binary-search"],
    companies: ["Amazon", "Meta"],
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    topics: ["Linked List"],
    patternIds: ["pointer-rewiring"],
    companies: ["Microsoft", "Amazon"],
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    topics: ["Linked List"],
    patternIds: ["fast-slow"],
    companies: ["Amazon", "Google"],
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topics: ["Linked List"],
    patternIds: ["merge"],
    companies: ["Apple", "Amazon"],
  },
  {
    id: "max-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topics: ["Tree"],
    patternIds: ["dfs"],
    companies: ["Google", "LinkedIn"],
  },
  {
    id: "same-tree",
    title: "Same Tree",
    difficulty: "Easy",
    topics: ["Tree"],
    patternIds: ["dfs"],
    companies: ["Amazon"],
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topics: ["Tree"],
    patternIds: ["dfs"],
    companies: ["Google"],
  },
  {
    id: "level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "Queue"],
    patternIds: ["bfs"],
    companies: ["Amazon", "Microsoft"],
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    topics: ["Graph", "Matrix"],
    patternIds: ["bfs", "dfs"],
    companies: ["Amazon", "Meta", "Google"],
  },
  {
    id: "clone-graph",
    title: "Clone Graph",
    difficulty: "Medium",
    topics: ["Graph", "HashMap"],
    patternIds: ["dfs"],
    companies: ["Meta", "Amazon"],
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    topics: ["Graph"],
    patternIds: ["topological-sort"],
    companies: ["Amazon", "Google"],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    topics: ["DP"],
    patternIds: ["dp"],
    companies: ["Amazon", "Adobe"],
  },
  {
    id: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    topics: ["DP"],
    patternIds: ["dp"],
    companies: ["Amazon", "Google"],
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    topics: ["DP"],
    patternIds: ["dp"],
    companies: ["Amazon", "Meta"],
  },
  {
    id: "lcs",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    topics: ["DP", "String"],
    patternIds: ["dp"],
    companies: ["Google", "Microsoft"],
  },
];

export function problemsByPattern(patternId: PatternId) {
  return problems.filter((p) => p.patternIds.includes(patternId));
}

export function problemsByTopic(topic: string) {
  return problems.filter((p) => p.topics.some((t) => t.toLowerCase() === topic.toLowerCase()));
}
