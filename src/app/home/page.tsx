import { Braces, Layers, ListChecks, Puzzle } from "lucide-react";
import { MainPage, type MainPageCard } from "@/components/content/MainPage";

const TITLE = "Home: DSA Visualizer";
const DESCRIPTION =
  "Choose a section to learn algorithms, explore data structures, recognise interview patterns, or solve problems.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const sections: MainPageCard[] = [
  { title: "Algorithms", href: "/algorithms", icon: Braces },
  { title: "Data Structures", href: "/data-structures", icon: Layers },
  { title: "Patterns", href: "/patterns", icon: Puzzle },
  { title: "Problems", href: "/problems", icon: ListChecks },
];

export default function HomePage() {
  return <MainPage breadcrumb="Home" title="Choose where to start" cards={sections} />;
}
