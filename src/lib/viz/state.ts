/**
 * Visualization state shapes shared by the renderers.
 *
 * Every algorithm generator returns a full immutable snapshot of one of these
 * per step, which is what makes stepping backward free.
 */

import type { CellState } from "./types";

type Counters = Record<string, number> | undefined;

/** A node in a linked list / chain renderer. */
export interface ChainNode {
  id: string;
  value: number;
  state: CellState;
}

export interface ListVizState {
  nodes: ChainNode[];
  variant: "singly" | "doubly" | "circular";
  /** Pointer name -> node id (or null for null pointers). */
  pointers?: Record<string, string | null> | undefined;
  counters?: Counters;
  /** Optional detached node shown above the chain (e.g. a node being inserted). */
  floating?: { value: number; label: string } | null | undefined;
}

export interface StackVizState {
  /** Bottom of the stack first. */
  items: { value: string | number; state: CellState }[];
  counters?: Counters;
  output?: string | undefined;
}

export interface QueueVizState {
  /** Fixed-length slots for circular queues; nulls are empty slots. */
  slots: ({ value: string | number; state: CellState } | null)[];
  front: number | null;
  rear: number | null;
  circular?: boolean | undefined;
  counters?: Counters;
  output?: string | undefined;
}

export interface HashVizState {
  buckets: {
    entries: { key: string; value: number; state: CellState }[];
    state: CellState;
  }[];
  counters?: Counters;
  probe?: { key: string; hash: number | null } | null | undefined;
  output?: string | undefined;
}

export interface TreeNodeViz {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  state: CellState;
}

export interface TreeVizState {
  nodes: Record<string, TreeNodeViz>;
  rootId: string | null;
  /** Array view kept in sync for heaps. */
  arrayView?: { values: number[]; states: CellState[] } | null | undefined;
  /** Traversal output collected so far. */
  output?: (number | string)[] | undefined;
  outputLabel?: string | undefined;
  counters?: Counters;
}

export interface GraphVizState {
  nodes: { id: string; x: number; y: number; state: CellState }[];
  edges: { from: string; to: string; weight?: number | undefined; state: CellState }[];
  directed: boolean;
  weighted?: boolean | undefined;
  /** Frontier contents (queue for BFS, stack for DFS, priority queue for Dijkstra). */
  frontier?: { label: string; items: string[] } | undefined;
  distances?: Record<string, number | null> | undefined;
  output?: string[] | undefined;
  outputLabel?: string | undefined;
  counters?: Counters;
}

/** One call in the recursion tree. Parent-child order is insertion order. */
export interface CallTreeNode {
  id: string;
  parentId: string | null;
  label: string;
  state: CellState;
  /** Return value, once the call has finished. */
  result?: string | undefined;
  /** Short marker: "repeat" for a duplicated call, "memo" for a cache hit. */
  note?: string | undefined;
}

export interface FrameVizState {
  /** Call stack, outermost call first. */
  frames: { id: number; label: string; state: CellState; result?: string | undefined }[];
  memo?: Record<string, string | number> | undefined;
  memoLabel?: string | undefined;
  output?: string | undefined;
  counters?: Counters;
  /** Recursion tree built alongside the stack. */
  treeNodes?: CallTreeNode[] | undefined;
  /** Ordered result list, e.g. Tower of Hanoi moves. */
  moves?: string[] | undefined;
  movesLabel?: string | undefined;
}

export interface GridVizState {
  cells: { value: string | number; state: CellState }[][];
  rowLabels?: string[] | undefined;
  colLabels?: string[] | undefined;
  counters?: Counters;
  output?: string | undefined;
}

export function chain(values: number[], state: CellState = "default"): ChainNode[] {
  return values.map((value, i) => ({ id: `n${i}`, value, state }));
}

export interface CharVizState {
  chars: { char: string; state: CellState }[];
  pointers?: Record<string, number> | undefined;
  counters?: Counters;
  /** Extra readout, e.g. the current window or frequency map. */
  table?: Record<string, number | string> | undefined;
  tableLabel?: string | undefined;
  output?: string | undefined;
}

/** One square of a board or one chip in a row of choices. */
export interface BoardCell {
  label: string;
  state: CellState;
}

export interface BacktrackVizState {
  /** Board problems: n-queens, maze, word search. */
  board?:
    | {
        cells: BoardCell[][];
        label?: string | undefined;
        rowLabels?: string[] | undefined;
        colLabels?: string[] | undefined;
      }
    | undefined;
  /** Choice problems: the pool of items, with the chosen ones highlighted. */
  items?: BoardCell[] | undefined;
  itemsLabel?: string | undefined;
  /** Call stack, outermost call first. */
  frames: { id: number; label: string; state: CellState; result?: string | undefined }[];
  treeNodes?: CallTreeNode[] | undefined;
  /** The partial candidate being built. */
  partial?: string | undefined;
  partialLabel?: string | undefined;
  solutions?: string[] | undefined;
  solutionsLabel?: string | undefined;
  counters?: Counters;
  output?: string | undefined;
}

/** One cell of a dynamic-programming table. null means "not computed / impossible". */
export interface DpCell {
  value: number | null;
  state: CellState;
}

export interface DpTableViz {
  label?: string | undefined;
  cells: DpCell[][];
  rowLabels?: string[] | undefined;
  colLabels?: string[] | undefined;
  /** Cells the current cell is reading from, drawn with a link marker. */
  reads?: { row: number; col: number }[] | undefined;
  current?: { row: number; col: number } | null | undefined;
  /** Single-row tables (1-D dp) hide the row header. */
  oneRow?: boolean | undefined;
}

/**
 * Dynamic programming shares one state shape across all five stages: the
 * recursive stages fill frames/treeNodes, the table stages fill `table`.
 */
export interface DpVizState {
  table?: DpTableViz | undefined;
  frames?: FrameVizState["frames"] | undefined;
  treeNodes?: CallTreeNode[] | undefined;
  memo?: Record<string, string | number> | undefined;
  memoLabel?: string | undefined;
  /** The recurrence, shown next to the visual so the state definition stays visible. */
  formula?: string | undefined;
  counters?: Counters;
  output?: string | undefined;
}
