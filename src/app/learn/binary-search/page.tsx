import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Binary Search: Why Halving Beats Scanning";
const DESCRIPTION =
  "Learn binary search visually: the [left, right] invariant, why sortedness matters, lower and upper bound variants, common off-by-one mistakes and the interview questions built on it.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return (
    <ClientOnly>
      <Content />
    </ClientOnly>
  );
}
