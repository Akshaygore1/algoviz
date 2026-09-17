import { MainPage, type MainPageCard } from "@/components/content/MainPage";

const TITLE = "Data Structures: DSA Visualizer";
const DESCRIPTION =
  "Explore core data structures through interactive visualizations, from arrays and linked lists to hash maps, trees, and heaps.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const dataStructures: MainPageCard[] = [
  { title: "Arrays", href: "/learn/arrays" },
  { title: "Strings", href: "/visualizers/strings" },
  { title: "Linked Lists", href: "/visualizers/linked-list" },
  { title: "Stacks", href: "/visualizers/stack" },
  { title: "Queues", href: "/visualizers/queue" },
  { title: "Hash Maps", href: "/visualizers/hashing" },
  { title: "Trees", href: "/visualizers/tree" },
  { title: "Heaps", href: "/visualizers/heap" },
];

export default function DataStructuresPage() {
  return (
    <MainPage breadcrumb="Data Structures" title="Choose a data structure" cards={dataStructures} />
  );
}
