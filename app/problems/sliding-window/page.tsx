import Content from "./client";

const TITLE = "Sliding Window Visualized: 6 Interview Problems Step by Step";
const DESCRIPTION =
  "Watch the window grow and shrink through Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters, Character Replacement, Permutation in String, Minimum Window Substring and Sliding Window Maximum.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
