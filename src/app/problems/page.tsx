import type { Metadata } from "next";
import ProblemsPage from "./_components/page-content";

const title = "Interview Problems: Curated DSA Question Set";
const description =
  "Understand coding interview problems through concise, step-by-step visualizations.";
export const metadata: Metadata = { title, description, openGraph: { title, description } };

export default function Page() {
  return <ProblemsPage />;
}
