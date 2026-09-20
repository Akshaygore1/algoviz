import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Stack Interview Problems Visualized: 6 Problems Step by Step";
const DESCRIPTION =
  "Step through Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation, Daily Temperatures, Car Fleet and Largest Rectangle in Histogram with the stack drawn as it changes.";

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
