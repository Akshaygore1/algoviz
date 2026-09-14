import {
  Binary,
  Braces,
  ChartNoAxesColumnIncreasing,
  GitBranch,
  Parentheses,
  Search,
  Split,
  Undo2,
  Waves,
} from "lucide-react";
import { MainPage, type MainPageCard } from "@/components/content/MainPage";

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
    icon: Waves,
  },
  {
    href: "/visualizers/selection-sort",
    title: "Selection Sort",
    icon: Search,
  },
  {
    href: "/visualizers/insertion-sort",
    title: "Insertion Sort",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    href: "/visualizers/merge-sort",
    title: "Merge Sort",
    icon: Split,
  },
  {
    href: "/visualizers/quick-sort",
    title: "Quick Sort",
    icon: GitBranch,
  },
  {
    href: "/visualizers/binary-search",
    title: "Binary Search",
    icon: Binary,
  },
  {
    href: "/visualizers/recursion",
    title: "Recursion",
    icon: Undo2,
  },
  {
    href: "/visualizers/dynamic-programming",
    title: "Dynamic Programming",
    icon: Braces,
  },
  {
    href: "/visualizers/backtracking",
    title: "Backtracking",
    icon: Parentheses,
  },
];

export default function AlgorithmsPage() {
  return <MainPage breadcrumb="Algorithms" title="Choose an algorithm" cards={algorithms} />;
}
