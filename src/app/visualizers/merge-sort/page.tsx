import Content from "./_components/page-content";

const TITLE = "Merge Sort Visualizer: Split, Merge and Watch the Buffer Fill";
const DESCRIPTION =
  "Step through merge sort: halves split down to single values, two read pointers merge into a working buffer, and the sorted block copies back. O(n log n) every time.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
