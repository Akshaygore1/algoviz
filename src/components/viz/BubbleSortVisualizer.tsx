"use client";

import { bubbleSort } from "@/lib/viz/algorithms/bubbleSort";
import { SortVisualizer } from "./SortVisualizer";

export function BubbleSortVisualizer({ initial = [8, 3, 5, 1, 9, 6, 2] }: { initial?: number[] }) {
  return <SortVisualizer definition={bubbleSort} initial={initial} maxLength={14} />;
}
