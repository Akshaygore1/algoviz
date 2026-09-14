import type { Metadata } from "next";
import ProblemsPage from "./_components/page-content";

const title = "Interview Problems: Curated DSA Question Set";
const description =
  "A curated set of coding interview problems grouped by topic, pattern and difficulty, with company tags and completion tracking.";
export const metadata: Metadata = { title, description, openGraph: { title, description } };

export default function Page() {
  return <ProblemsPage />;
}
