import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "String Algorithm Visualizer: Frequency, Palindrome, Sliding Window";
const DESCRIPTION =
  "Step through character-level string algorithms: frequency maps, two-pointer palindrome checks, the longest substring without repeats, and in-place reversal.";

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
