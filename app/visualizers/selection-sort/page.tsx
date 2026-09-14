import Content from "./client";

const TITLE = "Selection Sort Visualizer: Find the Minimum, Swap It Forward";
const DESCRIPTION =
  "Step through selection sort: watch the scan for the smallest remaining value, the single swap per pass, and why it always costs the same number of comparisons.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
