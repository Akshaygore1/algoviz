import {
  Binary,
  Braces,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  GitBranch,
  Layers,
  ListTree,
  Map,
  MoveHorizontal,
  Network,
  Search,
  Sigma,
  Waypoints,
} from "lucide-react";
import { MainPage, type MainPageCard } from "@/components/app/MainPage";
import { patterns, type PatternId } from "@/data/patterns";

const TITLE = "DSA Interview Patterns: Recognise Before You Code";
const DESCRIPTION =
  "The recurring patterns behind coding interviews: hash lookup, frequency maps, two pointers, sliding window, binary search, stacks, graphs and dynamic programming, with recognition cues, templates and pitfalls.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const patternIcons: Record<PatternId, MainPageCard["icon"]> = {
  "hash-lookup": Map,
  "frequency-map": ChartNoAxesColumnIncreasing,
  "two-pointers": MoveHorizontal,
  "sliding-window": Waypoints,
  "binary-search": Binary,
  "fast-slow": CircleDot,
  "prefix-sum": Sigma,
  "stack-matching": Layers,
  "auxiliary-stack": Layers,
  "monotonic-stack": ChartNoAxesColumnIncreasing,
  "pointer-rewiring": GitBranch,
  merge: MoveHorizontal,
  bfs: Network,
  "topological-sort": ListTree,
  dfs: GitBranch,
  "top-k": Search,
  dp: Braces,
};

const patternCards: MainPageCard[] = patterns.map((pattern) => ({
  href: `/patterns/${pattern.id}`,
  title: pattern.name,
  icon: patternIcons[pattern.id] ?? CircleDot,
}));

export default function Page() {
  return (
    <MainPage
      breadcrumb="Interview prep / Patterns"
      title="Choose a pattern"
      cards={patternCards}
    />
  );
}
