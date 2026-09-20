import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "DSA Visualizer: See how algorithms actually work";
const DESCRIPTION =
  "Learn data structures and algorithms through step-by-step interactive visualizations and the patterns behind coding interviews.";

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
