import { VisualizerPage } from "@/components/app/VisualizerPage";
import { HeapVisualizer } from "@/components/viz/HeapVisualizer";

export default HeapPage;

function HeapPage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Heaps"
      badges={["Data structure", "Intermediate", "O(1) peek · O(log n) insert"]}
      title="Heap and priority queue"
      intro="A heap is a complete binary tree that is only half-sorted: every parent beats its children, but siblings are in no particular order. That weaker promise is cheaper to maintain than full sorting, and it is enough whenever you only ever need the best item next. Both views below are the same data: the tree is how you reason about it, the array is how it is actually stored."
      interviewNote={{
        heading: "Recognising a heap question",
        body: "The phrases 'top k', 'k-th largest', 'merge k sorted', 'median so far' and 'schedule the next task' all mean heap. The trick most candidates miss: for the k largest items you use a min-heap of size k, not a max-heap: the root is then the weakest survivor, so you can evict it in O(log k).",
        to: "/patterns",
        linkLabel: "See the top-k / heap pattern →",
      }}
    >
      <HeapVisualizer />
    </VisualizerPage>
  );
}
