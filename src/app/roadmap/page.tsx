import type { Metadata } from "next";
import RoadmapPage from "./_components/page-content";

const title = "Learning Roadmap: From Arrays to Dynamic Programming";
const description =
  "A structured DSA learning path in three tracks (beginner, intermediate and advanced) with visual progress for every topic.";
export const metadata: Metadata = { title, description, openGraph: { title, description } };

export default function Page() {
  return <RoadmapPage />;
}
