import Content from "./client";

const TITLE = "Backtracking Visualizer: Choose, Explore, Un-choose";
const DESCRIPTION =
  "Step through subsets, permutations, combination sum, n-queens, rat in a maze and word search with the call stack, the decision tree and every backtrack shown.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
