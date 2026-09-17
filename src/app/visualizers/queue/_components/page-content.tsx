import { VisualizerPage } from "@/components/content/VisualizerPage";
import { QueueVisualizer } from "@/components/viz/QueueVisualizer";

export default function QueuePage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Queues"
      title="Queue, circular queue and deque"
      intro="A queue preserves arrival order: items join at the rear and leave at the front. Compare that simple rule with a circular queue and a deque."
    >
      <QueueVisualizer />
    </VisualizerPage>
  );
}
