import type { AlgorithmStep, StepType } from "./types";

/**
 * Tiny helper that collects immutable step snapshots.
 * Keeps generators readable without changing the step contract.
 */
export function createRecorder<TState>() {
  const steps: AlgorithmStep<TState>[] = [];
  return {
    steps,
    push(
      type: StepType,
      description: string,
      highlightedCodeLines: number[],
      variables: Record<string, string | number | boolean | null>,
      state: TState,
    ) {
      steps.push({
        id: steps.length,
        type,
        description,
        highlightedCodeLines,
        variables,
        state,
      });
    },
  };
}
