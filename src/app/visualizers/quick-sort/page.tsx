import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Quick Sort Visualizer: Partition Around a Pivot, Step by Step";
const DESCRIPTION =
  "Watch quick sort partition an array: the pivot, the moving boundary, and each pivot dropping into its final position. See why a bad pivot degrades to O(n²).";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return (
    <ClientOnly>
      <Content />
    </ClientOnly>
  );
}
