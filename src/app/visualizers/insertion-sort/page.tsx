import Content from "./_components/page-content";

const TITLE = "Insertion Sort Visualizer: Build a Sorted Prefix Step by Step";
const DESCRIPTION =
  "Watch insertion sort lift a key, shift larger values right and drop the key into place, with synced code, live variables and its O(n) best case.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
