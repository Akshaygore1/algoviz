import { VisualizerPage } from "@/components/content/VisualizerPage";
import { StackVisualizer } from "@/components/viz/StackVisualizer";

export default StackPage;

function StackPage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Stacks"
      badges={["Data structure", "Beginner", "O(1) push · O(1) pop"]}
      title="Stack operations"
      intro="A stack is an array with one rule: you may only touch the top. That single restriction is what makes it useful: the top always holds the most recent unfinished thing, which is exactly what bracket matching, undo history, recursion and monotonic-stack problems need."
      interviewNote={{
        heading: "Recognising a stack question",
        body: "Reach for a stack when the problem involves matching pairs, undoing the most recent action, or comparing each element with the nearest larger/smaller one to its side. The giveaway phrase is 'most recent' or 'nearest'. If you catch yourself writing a nested loop that scans backwards, a stack usually turns it from O(n²) into O(n).",
        to: "/patterns",
        linkLabel: "See the monotonic stack pattern →",
      }}
    >
      <StackVisualizer />
    </VisualizerPage>
  );
}
