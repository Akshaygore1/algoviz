"use client";

import { ProblemCategoryPage } from "@/components/content/ProblemCategoryPage";
import { TWO_POINTERS_PROBLEMS } from "@/lib/viz/problems/twoPointers";

export default TwoPointersPage;

function TwoPointersPage() {
  return (
    <ProblemCategoryPage
      breadcrumb="Interview prep / Problems / Two Pointers"
      title="Two Pointers"
      intro="Five problems built on one move: instead of trying every pair, place a cursor at each end and let the comparison decide which one to retire. Every step throws away a whole group of candidates, which is how an O(n²) scan becomes a single pass."
      recognise="Reach for two pointers when the input is sorted, when the answer is a pair or a triplet, when you compare something to its mirror, or when the brute force is 'try every pair'. The key question is always: after this comparison, which side can I safely discard and why?"
      mistakes={[
        "Moving the taller wall in Container With Most Water: the shorter wall caps the height, so that move can only lose area.",
        "Forgetting to skip duplicate values in 3Sum, which produces the same triplet more than once.",
        "Cleaning the string into a new array in Valid Palindrome and then claiming O(1) space.",
        "Using two pointers on unsorted input in Two Sum II style problems: without order, a comparison tells you nothing about which side to move.",
        "In Trapping Rain Water, processing the taller side first: its running maximum is not yet a guaranteed limit.",
      ]}
      problems={TWO_POINTERS_PROBLEMS}
    />
  );
}
