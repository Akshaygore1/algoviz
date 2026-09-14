"use client";

import { ProblemCategoryPage } from "@/components/content/ProblemCategoryPage";
import { SLIDING_WINDOW_PROBLEMS } from "@/lib/viz/problems/slidingWindow";

export default SlidingWindowPage;

function SlidingWindowPage() {
  return (
    <ProblemCategoryPage
      breadcrumb="Interview prep / Problems / Sliding Window"
      title="Sliding Window"
      intro="Six problems that all reuse one idea: instead of re-examining every substring or subarray, keep a single stretch of the input and adjust its edges. Because both edges only ever move forward, a quadratic scan collapses into one pass."
      recognise="Look for 'contiguous subarray or substring' plus a best, longest, shortest or fixed-size requirement. Then ask three questions: what makes a window valid, what does growing change, and what does shrinking restore?"
      mistakes={[
        "Recomputing the window's contents from scratch after each move, which quietly puts you back at O(n·k).",
        "Moving the left edge with an if instead of a while: one drop is often not enough to make the window valid again.",
        "Forgetting to update the best answer at the right moment: after shrinking for 'longest', before shrinking for 'shortest'.",
        "In fixed-size windows, taking a value in without dropping the one that fell out.",
        "In Sliding Window Maximum, rescanning the window for its maximum instead of keeping a monotonic deque.",
      ]}
      problems={SLIDING_WINDOW_PROBLEMS}
    />
  );
}
