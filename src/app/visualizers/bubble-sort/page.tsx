import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Bubble Sort Visualizer: Step Through Every Comparison";
const DESCRIPTION =
  "Watch bubble sort compare and swap neighbouring values step by step, with synced code, live variables, comparison and swap counters, and complexity analysis.";

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
