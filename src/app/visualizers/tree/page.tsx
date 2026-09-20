import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Binary Search Tree Visualizer: Insert, Search, Delete, Traversals";
const DESCRIPTION =
  "Watch a BST build itself, then step through insert, search, delete and all four traversals (inorder, preorder, postorder and level order) with synced code and live variables.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function Page() {
  return (
    <ClientOnly>
      <Content />
    </ClientOnly>
  );
}
