import { VisualizerPage } from "@/components/content/VisualizerPage";
import { TreeVisualizer } from "@/components/viz/TreeVisualizer";

export default function TreePage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Trees"
      title="Binary search tree"
      intro="A binary search tree puts smaller values left and larger values right. Try sorted input to see how that promise can still degrade into a linked list."
      note={{
        title: "Key idea",
        body: "Choose the traversal from the information flow: preorder carries state down, postorder combines children, inorder visits a BST in order.",
      }}
    >
      <TreeVisualizer />
    </VisualizerPage>
  );
}
