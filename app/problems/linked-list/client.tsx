"use client";

import { ProblemCategoryPage } from "@/components/app/ProblemCategoryPage";
import { LINKED_LIST_PROBLEMS } from "@/lib/viz/problems/linkedList";

export default LinkedListProblemsPage;

function LinkedListProblemsPage() {
  return (
    <ProblemCategoryPage
      breadcrumb="Interview prep / Problems / Linked List"
      title="Linked List"
      intro="Eleven problems about arrows. There is no random access, so everything is done with a handful of cursors: one behind, one ahead, one moving twice as fast. Watch the arrows change and the tricks stop feeling like tricks."
      recognise="Two pointers a fixed distance apart turn 'from the end' into one pass. Slow and fast pointers find middles and loops. A dummy head removes every special case about the first node. And when order plus lookup are both needed, pair a map with a list."
      mistakes={[
        "Overwriting a next pointer before saving the node it pointed at, which loses the rest of the list.",
        "Handling the head as a special case instead of adding a dummy node in front.",
        "Reversing a group in Reverse Nodes in K-Group before checking that a full group exists.",
        "Copying only the next pointers in a deep copy, leaving random pointers aimed at the original nodes.",
        "Using a visited set for cycle detection when the interviewer asked for constant space.",
        "In LRU Cache, forgetting that a read also counts as a use and must update recency.",
      ]}
      problems={LINKED_LIST_PROBLEMS}
    />
  );
}
