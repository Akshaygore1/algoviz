/**
 * One composable state shape for interview-problem visualizations.
 *
 * Individual problems need different pictures (an array with pointers, a hash
 * map, a stack, a grid, two linked lists), but they all compose from the same
 * handful of primitives, so a single renderer can draw any of them.
 *
 * Generators stay pure: input -> ordered immutable snapshots.
 */

import type { AlgorithmStep, CellState, ComplexityInfo } from "./types";
import type { ChainNode } from "./state";

export interface VizRow {
  label?: string | undefined;
  values: (number | string)[];
  cells: CellState[];
  /** Named pointers rendered under the cells, e.g. { l: 0, r: 5 }. */
  pointers?: Record<string, number> | undefined;
  /** Bars scale by magnitude (histograms, rain water); cells are flat boxes. */
  mode?: "cells" | "bars" | undefined;
  /** Inclusive shaded range, used by sliding-window problems. */
  window?: { start: number; end: number; label?: string | undefined } | null | undefined;
  showIndex?: boolean | undefined;
  /** Fill overlay height per index (0..1) for trapping-rain-water style water. */
  fill?: (number | null)[] | undefined;
}

export interface VizPanel {
  label: string;
  entries: { key: string; value: string; state?: CellState | undefined }[];
  empty?: string | undefined;
}

export interface VizStackPanel {
  label: string;
  /** Bottom of the stack first. */
  items: { value: string | number; state: CellState }[];
  orientation?: "vertical" | "horizontal" | undefined;
}

export interface VizChain {
  label?: string | undefined;
  nodes: ChainNode[];
  pointers?: Record<string, string | null> | undefined;
  /** Extra dashed links, e.g. random pointers or a cycle back-edge. */
  extraLinks?: { from: string; to: string; label?: string | undefined }[] | undefined;
}

export interface VizGrid {
  label?: string | undefined;
  cells: { value: string | number; state: CellState }[][];
}

export interface VizGraph {
  label?: string | undefined;
  nodes: { id: string; label: string; state: CellState }[];
  edges: {
    from: string;
    to: string;
    directed?: boolean | undefined;
    state?: CellState | undefined;
  }[];
  queue?: string[] | undefined;
  stack?: string[] | undefined;
}

export interface ProblemVizState {
  rows?: VizRow[] | undefined;
  panels?: VizPanel[] | undefined;
  stacks?: VizStackPanel[] | undefined;
  chains?: VizChain[] | undefined;
  grid?: VizGrid | null | undefined;
  graph?: VizGraph | null | undefined;
  counters?: Record<string, number> | undefined;
  /** Short readouts under the picture, e.g. "best = 4". */
  notes?: string[] | undefined;
  output?: string | undefined;
}

export type ProblemStep = AlgorithmStep<ProblemVizState>;

/* ------------------------------------------------------------------ inputs */

export type FieldSpec =
  | {
      kind: "numbers";
      key: string;
      label: string;
      placeholder?: string;
      maxLength?: number;
      presets?: { label: string; value: string }[];
    }
  | {
      kind: "text";
      key: string;
      label: string;
      placeholder?: string;
      presets?: { label: string; value: string }[];
    }
  | { kind: "number"; key: string; label: string; min?: number; max?: number };

export type ProblemInput = Record<string, string>;

export interface ProblemDefinition {
  slug: string;
  title: string;
  tagline: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** Pattern this problem teaches, shown next to the picker. */
  pattern: string;
  code: string[];
  language: string;
  complexity: ComplexityInfo;
  fields: FieldSpec[];
  defaults: ProblemInput;
  /** Interview-facing takeaway for this specific problem. */
  insight: string;
  generate: (input: ProblemInput) => ProblemStep[];
}

/* ----------------------------------------------------------------- helpers */

export function toNums(raw: string | undefined, max = 24): number[] {
  return (raw ?? "")
    .split(/[\s,]+/)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n))
    .slice(0, max);
}

export function toNum(raw: string | undefined, fallback = 0): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function toWords(raw: string | undefined, max = 8): string[] {
  return (raw ?? "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, max);
}

export function fillCells(length: number, fill: CellState = "default"): CellState[] {
  return Array.from({ length }, () => fill);
}

export function row(
  values: (number | string)[],
  cells: CellState[],
  extra: Omit<VizRow, "values" | "cells"> = {},
): VizRow {
  return { values, cells, ...extra };
}

export function mapPanel(
  label: string,
  map: Map<string, string | number> | Record<string, string | number>,
  highlightKey?: string | undefined,
  empty = "empty",
): VizPanel {
  const pairs: [string, string | number][] =
    map instanceof Map ? [...map.entries()] : Object.entries(map);
  return {
    label,
    empty,
    entries: pairs.map(([key, value]) => ({
      key,
      value: String(value),
      state: key === highlightKey ? ("inspect" as CellState) : undefined,
    })),
  };
}
