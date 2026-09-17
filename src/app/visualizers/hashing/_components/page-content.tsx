import { VisualizerPage } from "@/components/content/VisualizerPage";
import { HashVisualizer } from "@/components/viz/HashVisualizer";

export default function HashingPage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Hash Maps"
      title="Hash maps and hash sets"
      intro="A hash map does not search. The key computes its bucket, then lookup checks only that small location. Watch how the same idea removes the inner loop from a brute-force scan."
      note={{
        title: "Key idea",
        body: "Store exactly the information a later lookup needs: a set for membership, a map for counts or indexes.",
      }}
    >
      <HashVisualizer />
    </VisualizerPage>
  );
}
