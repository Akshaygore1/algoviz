import type { ComplexityInfo } from "@/lib/viz/types";
import type { PatternId } from "@/data/patterns";

export interface QuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Operation {
  name: string;
  complexity: string;
  note: string;
}

export interface Concept {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  intuition: string;
  explanation: string[];
  operations: Operation[];
  complexity: ComplexityInfo;
  mistakes: string[];
  patternId: PatternId;
  interviewTips: string[];
  relatedProblemIds: string[];
  quiz: QuizItem[];
  summary: string[];
}

export const concepts: Concept[] = [
  {
    id: "arrays",
    title: "Arrays",
    slug: "arrays",
    category: "Data structures",
    difficulty: "Beginner",
    intuition:
      "An array is a row of numbered boxes sitting next to each other in memory. Because the boxes are the same size and adjacent, the computer can jump straight to box number 7 with one multiplication; it never has to walk through boxes 0 to 6. Everything that feels fast or slow about arrays follows from that single fact.",
    explanation: [
      "Reading or writing by index is instant, because the address of index i is simply start + i × size.",
      "Inserting or deleting in the middle is expensive, because every element after the position has to shift by one to keep the row contiguous.",
      "Sorting unlocks better tools: once values are ordered, you can use binary search and two pointers instead of scanning.",
      "Most array interview questions are really about avoiding a second nested loop: with a hash map, a prefix sum, two pointers, or a sliding window.",
    ],
    operations: [
      { name: "Access by index", complexity: "O(1)", note: "Address arithmetic, no scanning." },
      {
        name: "Search (unsorted)",
        complexity: "O(n)",
        note: "You may have to look at every element.",
      },
      {
        name: "Search (sorted)",
        complexity: "O(log n)",
        note: "Binary search halves the space each step.",
      },
      {
        name: "Insert at end",
        complexity: "O(1) amortised",
        note: "Occasionally the backing store is resized.",
      },
      {
        name: "Insert at position",
        complexity: "O(n)",
        note: "Everything to the right shifts one slot.",
      },
      { name: "Delete at position", complexity: "O(n)", note: "The gap has to be closed." },
      { name: "Traverse", complexity: "O(n)", note: "The base cost of touching every value once." },
    ],
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      space: "O(n)",
      plainEnglish:
        "Index access costs the same no matter how large the array gets. Anything that must visit every element costs O(n): it doubles when the array doubles. The array itself stores n values, so its memory is O(n).",
    },
    mistakes: [
      "Reaching for a nested loop before asking whether a hash map removes the inner one.",
      "Off-by-one errors at the boundaries: arr[n] is out of range, the last index is n − 1.",
      "Mutating an array while iterating over it, which skips elements.",
      "Sorting when the question doesn't need order: that adds an unnecessary O(n log n).",
    ],
    patternId: "two-pointers",
    interviewTips: [
      "State the brute force and its complexity out loud, then optimise. Interviewers score the reasoning, not the first answer.",
      "Ask whether the input is sorted. That one question decides between hashing, two pointers and binary search.",
      "Clarify whether duplicates are allowed and whether you may modify the input in place.",
    ],
    relatedProblemIds: [
      "two-sum",
      "contains-duplicate",
      "product-except-self",
      "container-with-most-water",
      "best-time-to-buy-sell-stock",
    ],
    quiz: [
      {
        question: "Why is reading arr[500] as fast as reading arr[0]?",
        options: [
          "Because the array is sorted",
          "Because the address is computed directly from the index",
          "Because the CPU caches the whole array",
          "It isn't: later indexes are slower",
        ],
        answerIndex: 1,
        explanation:
          "Elements are the same size and stored contiguously, so the address is start + i × size. One calculation, no scanning.",
      },
      {
        question: "What makes inserting into the middle of an array O(n)?",
        options: [
          "The array must be re-sorted",
          "Every element after the insert point shifts one slot",
          "Memory must be reallocated every time",
          "The index has to be searched for first",
        ],
        answerIndex: 1,
        explanation:
          "Arrays must stay contiguous, so making room means moving up to n elements one position to the right.",
      },
    ],
    summary: [
      "Contiguous memory buys O(1) indexing and costs O(n) insertion in the middle.",
      "Sorted arrays open the door to binary search and two pointers.",
      "Most array interview questions are about eliminating a nested loop.",
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    slug: "binary-search",
    category: "Algorithms",
    difficulty: "Beginner",
    intuition:
      "Think of looking up a word in a physical dictionary. You don't start at page one: you open the middle, see whether your word comes before or after, and throw away half the book. Then you do it again. Binary search is that move, applied to a sorted array: one comparison removes half of everything that's left.",
    explanation: [
      "Keep two boundaries, left and right, describing the part of the array that could still contain the answer.",
      "Look at the middle element. If it equals the target you're done.",
      "If it is too small, the target cannot be at or before the middle, so left moves past mid.",
      "If it is too large, the target cannot be at or after the middle, so right moves before mid.",
      "The loop ends when left passes right, which means the search space is empty and the value isn't there.",
      "The same shape solves boundary questions: lower bound, upper bound, and 'binary search on the answer' where the array is replaced by a monotonic yes/no test.",
    ],
    operations: [
      {
        name: "Search a sorted array",
        complexity: "O(log n)",
        note: "Roughly log₂(n) comparisons.",
      },
      { name: "Lower bound", complexity: "O(log n)", note: "First index whose value is ≥ target." },
      { name: "Upper bound", complexity: "O(log n)", note: "First index whose value is > target." },
      {
        name: "Sort first, then search",
        complexity: "O(n log n)",
        note: "Only worth it for many queries.",
      },
    ],
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(log n)",
      timeWorst: "O(log n)",
      space: "O(1)",
      plainEnglish:
        "O(log n) means the search space becomes about half as large after every step. 1,000 values take about 10 comparisons and 1,000,000 take about 20; doubling the input adds a single step. Iteratively it needs only a few variables, so space is O(1).",
    },
    mistakes: [
      "Running binary search on unsorted data: the eliminated half might contain the answer.",
      "Writing (left + right) / 2 in a fixed-width language, which can overflow. Use left + (right − left) / 2.",
      "Using while (left < right) with mid = (left + right) / 2 and no movement, which loops forever.",
      "Returning the wrong boundary in lower/upper bound variants because the answer wasn't tracked before shrinking.",
    ],
    patternId: "binary-search",
    interviewTips: [
      "When constraints allow n up to 10⁹, the intended solution is almost always logarithmic.",
      "Say the invariant out loud: 'the answer, if it exists, is always inside [left, right]'. It prevents off-by-one bugs.",
      "For 'minimum value that works' questions, search over the answer range rather than the array.",
    ],
    relatedProblemIds: ["binary-search", "search-rotated", "two-sum-ii"],
    quiz: [
      {
        question: "Why must the array be sorted?",
        options: [
          "So the middle element is the median",
          "So a comparison tells you which half can be discarded",
          "So no duplicates exist",
          "So the array fits in memory",
        ],
        answerIndex: 1,
        explanation:
          "Sortedness is what makes the discarded half provably wrong. Without it, one comparison tells you nothing about the rest.",
      },
      {
        question: "About how many comparisons does binary search need for 1,000,000 sorted values?",
        options: ["20", "1000", "500000", "1000000"],
        answerIndex: 0,
        explanation: "log₂(1,000,000) ≈ 20: each comparison halves what's left.",
      },
    ],
    summary: [
      "One comparison removes half of the remaining candidates.",
      "It needs sorted input or a monotonic property.",
      "Keep the invariant [left, right] in mind and off-by-one bugs disappear.",
    ],
  },
];

export function getConcept(slug: string) {
  return concepts.find((c) => c.slug === slug);
}
