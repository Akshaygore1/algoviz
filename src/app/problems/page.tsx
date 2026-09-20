import type { Metadata } from "next";
import ProblemsPage from "./_components/page-content";
import { ClientOnly } from "@/components/ClientOnly";

const title = "Interview Problems: Curated DSA Question Set";
const description =
  "Understand coding interview problems through concise, step-by-step visualizations.";
export const metadata: Metadata = { title, description };

export default function Page() {
  return (
    <ClientOnly>
      <ProblemsPage />
    </ClientOnly>
  );
}
