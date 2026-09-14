import { VisualizerPage } from "@/components/content/VisualizerPage";
import { TreeVisualizer } from "@/components/viz/TreeVisualizer";

export default TreePage;

function TreePage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Trees"
      badges={["Data structure", "Intermediate", "O(log n) balanced · O(n) worst"]}
      title="Binary search tree"
      intro="A binary search tree keeps one promise: everything in a node's left subtree is smaller, everything in its right subtree is larger. That single rule turns searching into a series of decisions where each comparison throws away an entire subtree. Try the sorted preset to see the promise kept but the benefit lost: the tree degenerates into a linked list, which is exactly the case interviewers probe."
      interviewNote={{
        heading: "Recognising a tree question",
        body: "Almost every tree question is a traversal in disguise: decide whether you need information from the children before acting (postorder), from the parent on the way down (preorder), in sorted order (inorder on a BST), or level by level (BFS with a queue). Say which one you need out loud before you write code; that single sentence is what separates a confident answer from guessing.",
        to: "/patterns",
        linkLabel: "See tree traversal patterns →",
      }}
    >
      <TreeVisualizer />
    </VisualizerPage>
  );
}
