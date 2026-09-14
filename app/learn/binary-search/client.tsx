import { ConceptPage } from "@/components/app/ConceptPage";
import { BinarySearchVisualizer } from "@/components/viz/BinarySearchVisualizer";
import { getConcept } from "@/data/concepts";

export default BinarySearchConcept;

function BinarySearchConcept() {
  const concept = getConcept("binary-search")!;
  return <ConceptPage concept={concept} visualizer={<BinarySearchVisualizer />} />;
}
