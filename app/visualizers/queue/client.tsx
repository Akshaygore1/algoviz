import { VisualizerPage } from "@/components/app/VisualizerPage";
import { QueueVisualizer } from "@/components/viz/QueueVisualizer";

export default QueuePage;

function QueuePage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Queues"
      badges={["Data structure", "Beginner", "O(1) both ends"]}
      title="Queue, circular queue and deque"
      intro="A queue keeps arrival order: items join at the rear and leave at the front. The interesting part is how you implement it: move an index instead of shifting elements, wrap that index with modulo to reuse freed slots, and open both ends when you need a deque."
      interviewNote={{
        heading: "Where queues show up",
        body: "Every breadth-first search is a queue: process the nearest layer before the next one. Level-order tree traversal, shortest path in an unweighted graph, rotting oranges, word ladder: all the same queue skeleton. A deque powers sliding-window maximum, where you drop values from the back that can never win.",
        to: "/visualizers/queue",
        linkLabel: "Try the circular queue →",
      }}
    >
      <QueueVisualizer />
    </VisualizerPage>
  );
}
