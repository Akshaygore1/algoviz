import { VisualizerPage } from "@/components/content/VisualizerPage";
import { HeapVisualizer } from "@/components/viz/HeapVisualizer";

export default function HeapPage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Heaps"
      title="Heap and priority queue"
      intro="A heap keeps the best item at the top without fully sorting everything else. The tree and array below are the same data, shown in the two views you need to reason about it."
    >
      <HeapVisualizer />
    </VisualizerPage>
  );
}
