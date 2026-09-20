import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Two Pointers Visualized: 5 Interview Problems Step by Step";
const DESCRIPTION =
  "Watch Valid Palindrome, Two Sum II, 3Sum, Container With Most Water and Trapping Rain Water run one step at a time, with both pointers, the highlighted code line and a reason for every move.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function Page() {
  return (
    <ClientOnly>
      <Content />
    </ClientOnly>
  );
}
