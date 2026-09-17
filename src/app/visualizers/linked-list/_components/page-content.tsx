import { VisualizerPage } from "@/components/content/VisualizerPage";
import { LinkedListVisualizer } from "@/components/viz/LinkedListVisualizer";

export default function LinkedListPage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Linked Lists"
      title="Linked list operations"
      intro="A linked list trades random access for cheap insertion. Pick an operation and watch exactly which pointers change."
    >
      <LinkedListVisualizer />
    </VisualizerPage>
  );
}
