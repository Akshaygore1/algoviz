import type { Metadata } from "next";
import RoadmapPage from "./_components/page-content";

const title = "Learning Roadmap: From Arrays to Dynamic Programming";
const description = "A structured DSA learning path from arrays to dynamic programming.";
export const metadata: Metadata = { title, description, openGraph: { title, description } };

export default function Page() {
  return <RoadmapPage />;
}
