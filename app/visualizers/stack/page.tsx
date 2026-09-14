import Content from "./client";

const TITLE = "Stack Visualizer: Push, Pop, Valid Parentheses, Monotonic Stack";
const DESCRIPTION =
  "See a stack in action: push and pop step by step, validate brackets, and build a monotonic stack for next greater element, with synced code and live variables.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
