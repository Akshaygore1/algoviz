import Content from "./_components/page-content";

const TITLE = "Binary Search Interview Problems Visualized: 7 Problems";
const DESCRIPTION =
  "Watch the search range shrink through Binary Search, Search a 2D Matrix, Koko Eating Bananas, rotated array problems, a time-based key-value store and Median of Two Sorted Arrays.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
