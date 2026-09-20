import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Algorithm Visualizers: DSA Visualizer";
const DESCRIPTION =
  "Step-by-step interactive visualizers for sorting, searching and core data structures, with synced code, live variables and complexity analysis.";

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
