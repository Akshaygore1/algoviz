"use client";

import { VisualizerPage } from "@/components/content/VisualizerPage";
import { LinkedListVisualizer } from "@/components/viz/LinkedListVisualizer";

export default function LinkedListPage() {
  return (
    <VisualizerPage
      breadcrumb="Data Structures / Linked Lists"
      title="Linked list operations"
      intro="A linked list trades random access for cheap insertion. Pick an operation and watch exactly which pointers change."
      note={{
        title: "Key idea",
        body: "Save the next pointer before overwriting it, and use a dummy head to remove special cases at the start of a list.",
      }}
    >
      <LinkedListVisualizer />
    </VisualizerPage>
  );
}
