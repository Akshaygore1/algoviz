"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { QueueVisualizer } from "@/components/viz/QueueVisualizer";

export default function QueuePage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Queues"
      title="Queue, circular queue and deque"
      intro="A queue preserves arrival order: items join at the rear and leave at the front. Compare that simple rule with a circular queue and a deque."
      note={{
        title: "When to use it",
        body: "Breadth-first search processes one distance layer at a time by putting newly discovered work at the rear of a queue.",
      }}
    >
      <QueueVisualizer />
    </VisualizerPage>
  );
}
