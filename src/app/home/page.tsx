import { Braces, Layers, LayoutDashboard, ListChecks, Map as MapIcon, Puzzle } from "lucide-react";
import { MainPage, type MainPageCard } from "@/components/content/MainPage";

const TITLE = "Home: DSA Visualizer";
const DESCRIPTION =
  "Choose a section to learn algorithms, recognise interview patterns, solve problems, follow the roadmap, or track your progress.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const sections: MainPageCard[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Algorithms", href: "/algorithms", icon: Braces },
  { title: "Data Structures", href: "/data-structures", icon: Layers },
  { title: "Patterns", href: "/patterns", icon: Puzzle },
  { title: "Problems", href: "/problems", icon: ListChecks },
  { title: "Roadmap", href: "/roadmap", icon: MapIcon },
];

export default function HomePage() {
  return <MainPage breadcrumb="Home" title="Choose where to start" cards={sections} />;
}
