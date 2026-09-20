import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Recursion Visualizer: Call Stack and Recursion Tree, Step by Step";
const DESCRIPTION =
  "See recursion run: frames pushed and popped on the call stack, a growing recursion tree, repeated work in naive Fibonacci and the memo that removes it.";

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
