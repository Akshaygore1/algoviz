import type { CellState } from "@/lib/viz/types";

/** Semantic visual state -> classes. Never hardcode colors elsewhere. */
export const CELL_CLASS: Record<CellState, string> = {
  default: "bg-viz-default text-viz-default-fg border-transparent",
  inspect: "bg-viz-inspect text-viz-inspect-fg border-viz-inspect shadow-sm",
  compare: "bg-viz-compare text-viz-compare-fg border-viz-compare shadow-sm",
  success: "bg-viz-success text-viz-success-fg border-viz-success shadow-sm",
  error: "bg-viz-error text-viz-error-fg border-viz-error shadow-sm",
  visited: "bg-viz-visited text-viz-visited-fg border-viz-visited",
  done: "bg-viz-done text-viz-done-fg border-viz-done",
  eliminated: "bg-transparent text-muted-foreground/50 border-dashed border-border line-through",
};

/** Non-color marker so every state is readable without relying on hue. */
export const CELL_MARK: Record<CellState, string> = {
  default: "",
  inspect: "◆",
  compare: "↔",
  success: "✓",
  error: "✕",
  visited: "•",
  done: "✓",
  eliminated: "—",
};

export const STATE_ORDER: CellState[] = [
  "default",
  "inspect",
  "compare",
  "success",
  "error",
  "visited",
  "done",
  "eliminated",
];
