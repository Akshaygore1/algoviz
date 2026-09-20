import Content from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Hash Table Visualizer: Hashing, Collisions, Two Sum";
const DESCRIPTION =
  "See how a hash function picks a bucket, what a collision actually looks like with chaining, and how a hash map turns Two Sum from O(n²) into O(n).";

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
