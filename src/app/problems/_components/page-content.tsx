import { Binary, Braces, GitBranch, Layers, MoveHorizontal, Waypoints } from "lucide-react";
import { MainPage, type MainPageCard } from "@/components/content/MainPage";

export default ProblemsPage;

const problemCategories: MainPageCard[] = [
  { title: "Arrays & Hashing", href: "/problems/arrays-hashing", icon: Braces },
  { title: "Two Pointers", href: "/problems/two-pointers", icon: MoveHorizontal },
  { title: "Sliding Window", href: "/problems/sliding-window", icon: Waypoints },
  { title: "Stack", href: "/problems/stack", icon: Layers },
  { title: "Binary Search", href: "/problems/binary-search", icon: Binary },
  { title: "Linked List", href: "/problems/linked-list", icon: GitBranch },
];

function ProblemsPage() {
  return (
    <MainPage
      breadcrumb="Interview prep / Problems"
      title="Choose a problem category"
      cards={problemCategories}
    />
  );
}
