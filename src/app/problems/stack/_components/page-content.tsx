"use client";

import { ProblemCategoryPage } from "@/components/content/ProblemCategoryPage";
import { STACK_PROBLEMS } from "@/lib/viz/problems/stack";

export default StackProblemsPage;

function StackProblemsPage() {
  return (
    <ProblemCategoryPage
      breadcrumb="Interview prep / Problems / Stack"
      title="Stack"
      intro="Six problems where the answer depends on the most recent thing you have not finished with yet. Sometimes that is an unclosed bracket, sometimes a pending operand, and sometimes a bar still waiting to find out how far it can stretch."
      recognise="Reach for a stack when the problem involves nesting, matching pairs, undo-style history, or 'the next greater or smaller element'. A monotonic stack is the giveaway when every item is waiting for the first value that beats it."
      mistakes={[
        "Popping without checking the stack is empty first, and reading undefined as if it were a real value.",
        "In Evaluate Reverse Polish Notation, swapping the operands: the first value popped is the right-hand one.",
        "Forgetting to check the stack is empty at the end of Valid Parentheses, so unclosed brackets pass.",
        "Recomputing the minimum on every getMin instead of storing it alongside each push.",
        "In Largest Rectangle, not flushing the stack after the last bar, which loses the widest rectangle.",
        "Storing values rather than indexes in a monotonic stack, which loses the width you need.",
      ]}
      problems={STACK_PROBLEMS}
    />
  );
}
