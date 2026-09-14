import Content from "./client";

const TITLE = "Dynamic Programming Visualizer: Brute Force to Space Optimised";
const DESCRIPTION =
  "Watch eight DP problems solved five ways: brute-force recursion, the repeated work exposed, memoization, tabulation and the space-optimised version, step by step.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
