import { ConceptPage } from "@/components/content/ConceptPage";
import { BubbleSortVisualizer } from "@/components/viz/BubbleSortVisualizer";
import { getConcept } from "@/data/concepts";

export default ArraysConcept;

function ArraysConcept() {
  const concept = getConcept("arrays")!;
  return (
    <ConceptPage
      concept={concept}
      visualizer={<BubbleSortVisualizer initial={[8, 3, 5, 1, 9, 6, 2]} />}
    />
  );
}
