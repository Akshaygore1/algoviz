"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { StackVisualizer } from "@/components/viz/StackVisualizer";

export default function StackPage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Stacks"
      title="Stack operations"
      intro="A stack lets you touch only the most recent unfinished thing. That is why it explains bracket matching, undo history, recursion, and monotonic-stack problems."
      note={{
        title: "Key idea",
        body: "Use a stack when the question depends on the most recent unfinished item or the nearest value that beats the current one.",
      }}
    >
      <StackVisualizer />
    </VisualizerPage>
  );
}
