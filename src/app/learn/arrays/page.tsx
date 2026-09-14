import Content from "./_components/page-content";

const TITLE = "Arrays: Intuition, Operations and Interview Patterns";
const DESCRIPTION =
  "Understand arrays from contiguous memory up: why indexing is O(1), why middle insertion is O(n), the patterns that remove nested loops, and the interview questions that use them.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
