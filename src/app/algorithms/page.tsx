import { MainPage, type MainPageCard } from "@/components/content/MainPage";
import { ClientOnly } from "@/components/ClientOnly";

const TITLE = "Algorithms: DSA Visualizer";
const DESCRIPTION =
  "Choose a core algorithm and explore it through an interactive, step-by-step visualization.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const algorithms: MainPageCard[] = [
  {
    href: "/visualizers/bubble-sort",
    title: "Bubble Sort",
  },
  {
    href: "/visualizers/selection-sort",
    title: "Selection Sort",
  },
  {
    href: "/visualizers/insertion-sort",
    title: "Insertion Sort",
  },
  {
    href: "/visualizers/merge-sort",
    title: "Merge Sort",
  },
  {
    href: "/visualizers/quick-sort",
    title: "Quick Sort",
  },
  {
    href: "/visualizers/binary-search",
    title: "Binary Search",
  },
  {
    href: "/visualizers/recursion",
    title: "Recursion",
  },
  {
    href: "/visualizers/dynamic-programming",
    title: "Dynamic Programming",
  },
  {
    href: "/visualizers/backtracking",
    title: "Backtracking",
  },
];

export default function AlgorithmsPage() {
  return (
    <ClientOnly>
      <MainPage breadcrumb="Algorithms" title="Choose an algorithm" cards={algorithms} />
    </ClientOnly>
  );
}
