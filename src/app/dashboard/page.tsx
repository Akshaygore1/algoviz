import type { Metadata } from "next";
import Dashboard from "./_components/page-content";

export const metadata: Metadata = {
  title: "Dashboard: Track Your Interview Readiness",
  description:
    "Your DSA preparation at a glance: learning streak, concepts completed, problems solved by difficulty, per-topic readiness score and the topic to study next.",
  openGraph: {
    title: "Dashboard: Track Your Interview Readiness",
    description:
      "Your DSA preparation at a glance: learning streak, concepts completed, problems solved by difficulty, per-topic readiness score and the topic to study next.",
  },
};

export default function Page() {
  return <Dashboard />;
}
