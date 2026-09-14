export interface RoadmapTopic {
  id: string;
  title: string;
  /** Route if a visualizer or concept page exists yet. */
  href?: string;
  status: "ready" | "planned";
}

export interface RoadmapTrack {
  id: string;
  title: string;
  description: string;
  topics: RoadmapTopic[];
}

export const roadmap: RoadmapTrack[] = [
  {
    id: "beginner",
    title: "Beginner",
    description:
      "Build the foundations: linear data structures, hashing and the two search tools every interview assumes you know.",
    topics: [
      { id: "arrays", title: "Arrays", href: "/learn/arrays", status: "ready" },
      {
        id: "sorting",
        title: "Sorting: Bubble Sort",
        href: "/visualizers/bubble-sort",
        status: "ready",
      },
      {
        id: "binary-search",
        title: "Binary Search",
        href: "/learn/binary-search",
        status: "ready",
      },
      { id: "strings", title: "Strings", status: "planned" },
      { id: "hashing", title: "Hashing", status: "planned" },
      { id: "linked-lists", title: "Linked Lists", status: "planned" },
      { id: "stacks", title: "Stacks", status: "planned" },
      { id: "queues", title: "Queues", status: "planned" },
    ],
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description:
      "Non-linear structures and the recursive thinking that unlocks trees, graphs and backtracking.",
    topics: [
      { id: "trees", title: "Trees & BST", status: "planned" },
      { id: "heaps", title: "Heaps", status: "planned" },
      { id: "graphs", title: "Graphs: BFS & DFS", status: "planned" },
      { id: "recursion", title: "Recursion", href: "/visualizers/recursion", status: "ready" },
      {
        id: "backtracking",
        title: "Backtracking",
        href: "/visualizers/backtracking",
        status: "ready",
      },
      { id: "greedy", title: "Greedy", status: "planned" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    description:
      "The topics that separate a pass from a strong hire in product-company interviews.",
    topics: [
      {
        id: "dp",
        title: "Dynamic Programming",
        href: "/visualizers/dynamic-programming",
        status: "ready",
      },
      { id: "tries", title: "Tries", status: "planned" },
      { id: "union-find", title: "Union Find", status: "planned" },
      { id: "advanced-graphs", title: "Advanced Graph Algorithms", status: "planned" },
    ],
  },
];

export const allRoadmapTopics = roadmap.flatMap((t) => t.topics);
