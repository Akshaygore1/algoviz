/**
 * Core visualization engine types.
 *
 * Algorithms are pure functions: input -> ordered list of immutable steps.
 * They know nothing about timing, animation or React. The player owns time,
 * the renderers own pixels. This is what makes stepping backward free.
 */

export type StepType =
  | "compare"
  | "swap"
  | "visit"
  | "insert"
  | "delete"
  | "highlight"
  | "update"
  | "eliminate"
  | "complete";

export interface AlgorithmStep<TState> {
  id: number;
  type: StepType;
  /** Plain-language answer to: what happened and why. */
  description: string;
  highlightedCodeLines: number[];
  variables: Record<string, string | number | boolean | null>;
  state: TState;
}

export interface ComplexityInfo {
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  space: string;
  /** Beginner-friendly sentence explaining the dominant term. */
  plainEnglish: string;
}

export interface AlgorithmDefinition<TState, TInput> {
  slug: string;
  title: string;
  tagline: string;
  /** Source lines; index + 1 is the line number shown in the UI. */
  code: string[];
  language: string;
  complexity: ComplexityInfo;
  generate: (input: TInput) => AlgorithmStep<TState>[];
}

/** Visual state of a single array cell. Colour is never the only signal. */
export type CellState =
  "default" | "inspect" | "compare" | "success" | "error" | "visited" | "done" | "eliminated";

export interface ArrayAuxRow {
  label: string;
  /** null renders as an empty slot, keeping indexes aligned with the main row. */
  values: (number | null)[];
  cells: CellState[];
}

export interface ArrayVizState {
  values: number[];
  cells: CellState[];
  /** Named pointers rendered under the cells, e.g. { left: 0, mid: 3 }. */
  pointers?: Record<string, number> | undefined;
  /** Small counters rendered above the array, e.g. comparisons / swaps. */
  counters?: Record<string, number> | undefined;
  /** Optional second row: merge buffer, count array, bucket row. */
  auxiliary?: ArrayAuxRow | undefined;
}

export const CELL_LABEL: Record<CellState, string> = {
  default: "unvisited",
  inspect: "being inspected",
  compare: "being compared",
  success: "successful operation",
  error: "mismatch",
  visited: "visited",
  done: "in final position",
  eliminated: "eliminated from the search space",
};

export function makeCells(length: number, fill: CellState = "default"): CellState[] {
  return Array.from({ length }, () => fill);
}
