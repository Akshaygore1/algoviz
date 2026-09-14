"use client";

import { ProblemCategoryPage } from "@/components/content/ProblemCategoryPage";
import { BINARY_SEARCH_PROBLEMS } from "@/lib/viz/problems/binarySearchProblems";

export default BinarySearchProblemsPage;

function BinarySearchProblemsPage() {
  return (
    <ProblemCategoryPage
      breadcrumb="Interview prep / Problems / Binary Search"
      title="Binary Search"
      intro="Seven problems that all halve something. Sometimes the sorted thing is the input, sometimes it is a flattened grid, and sometimes it is the range of possible answers, but the move is always the same: one test, half the candidates gone."
      recognise="Binary search applies whenever a yes/no test flips exactly once as the candidate grows. If the input is sorted, search the input. If the answer has a 'does this value work?' test that only gets easier as the value grows, search the answer."
      mistakes={[
        "A branch that does not shrink the range, which loops forever: every path must move lo or hi.",
        "Writing (lo + hi) / 2 in a language where that can overflow, instead of lo + ((hi - lo) >> 1).",
        "Mixing up inclusive and exclusive bounds halfway through the loop.",
        "In rotated arrays, comparing the middle with a neighbour instead of with a fixed end value.",
        "In 'largest value at or below t', returning as soon as a match is found instead of remembering it and continuing right.",
        "Assuming the answer range starts at 0 when a speed or capacity must be at least 1.",
      ]}
      problems={BINARY_SEARCH_PROBLEMS}
    />
  );
}
