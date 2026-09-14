import Content from "./client";

const TITLE = "Binary Search Visualizer: Watch the Search Space Halve";
const DESCRIPTION =
  "Step through binary search with left, mid and right pointers and the eliminated half shaded out after every comparison. Synced code, live variables and O(log n) explained.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
