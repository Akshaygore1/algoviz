import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Heap Visualizer: Heapify, Insert, Extract, Priority Queue";
const DESCRIPTION =
  "See a min-heap and max-heap as a tree and as an array at the same time: sift up on insert, sift down on extract, and O(n) heapify, step by step with synced code.";

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
