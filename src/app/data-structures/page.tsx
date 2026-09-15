import {
  Binary,
  Braces,
  ChartNoAxesColumnIncreasing,
  GitBranch,
  Layers,
  Network,
  Type,
  Waypoints,
} from "lucide-react";
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
  { title: "Arrays", href: "/learn/arrays", icon: Braces },
  { title: "Strings", href: "/visualizers/strings", icon: Type },
  { title: "Linked Lists", href: "/visualizers/linked-list", icon: GitBranch },
  { title: "Stacks", href: "/visualizers/stack", icon: Layers },
  { title: "Queues", href: "/visualizers/queue", icon: Waypoints },
  { title: "Hash Maps", href: "/visualizers/hashing", icon: ChartNoAxesColumnIncreasing },
  { title: "Trees", href: "/visualizers/tree", icon: Network },
  { title: "Heaps", href: "/visualizers/heap", icon: Binary },
];

export default function DataStructuresPage() {
  return (
    <MainPage breadcrumb="Data Structures" title="Choose a data structure" cards={dataStructures} />
  );
}
