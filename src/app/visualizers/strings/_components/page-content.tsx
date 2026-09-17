import { VisualizerPage } from "@/components/content/VisualizerPage";
import { StringVisualizer } from "@/components/viz/StringVisualizer";

export default function StringsPage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Strings"
      title="String algorithms"
      intro="A string is an array of characters. Count with a map, walk inward with two pointers, or grow and shrink a window to solve most string questions."
      note={{
        title: "Three useful tools",
        body: "Counting handles frequency, two pointers handle mirrored comparisons, and sliding windows avoid rescanning every substring.",
      }}
    >
      <StringVisualizer />
    </VisualizerPage>
  );
}
