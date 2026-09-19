"use client";

import type { ReactNode } from "react";
import type { AlgorithmDefinition, AlgorithmStep, ComplexityInfo } from "@/lib/viz/types";
import { useStepPlayer } from "@/hooks/use-step-player";
import { CodePanel } from "./CodePanel";
import { ControlBar } from "./ControlBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ComplexityCard } from "./ComplexityCard";
import { VizMotionProvider } from "./VizMotionContext";

interface Props<TState, TInput> {
  definition: AlgorithmDefinition<TState, TInput>;
  steps: AlgorithmStep<TState>[];
  renderVisual: (state: TState) => ReactNode;
  /** Input builder (custom values, random, presets). */
  inputPanel?: ReactNode;
  complexity?: ComplexityInfo;
  /** Disable global shortcuts when several workspaces are rendered together. */
  keyboardShortcuts?: boolean;
}

export function VizWorkspace<TState, TInput>({
  definition,
  steps,
  renderVisual,
  inputPanel,
  complexity,
  keyboardShortcuts = true,
}: Props<TState, TInput>) {
  const player = useStepPlayer<TState>(steps, 1, keyboardShortcuts);
  const step = player.step;

  if (!step) return null;

  const controls = (
    <ControlBar
      index={player.index}
      total={player.total}
      playing={player.playing}
      speed={player.speed}
      atStart={player.atStart}
      atEnd={player.atEnd}
      onToggle={player.toggle}
      onNext={player.next}
      onPrev={player.prev}
      onFirst={player.first}
      onLast={player.lastStep}
      onRestart={player.restart}
      onSpeed={player.setSpeed}
      onScrub={player.setIndex}
    />
  );

  return (
    <VizMotionProvider mode={player.motionMode}>
      <section
        className="viz-workspace overflow-hidden border border-border bg-card"
        data-motion={player.motionMode}
      >
        {inputPanel && (
          <div className="border-b border-border bg-viz-surface px-4 py-3">{inputPanel}</div>
        )}

        <div className="grid lg:h-[560px] lg:grid-cols-[minmax(0,1.35fr)_minmax(24rem,1fr)] lg:divide-x lg:divide-border">
          <div className="min-h-[360px] min-w-0 bg-viz-surface lg:min-h-0">
            {renderVisual(step.state)}
          </div>
          <div className="flex min-w-0 flex-col border-t border-border bg-card lg:min-h-0 lg:border-t-0">
            <div className="h-[420px] min-h-0 overflow-hidden lg:h-auto lg:flex-[4]">
              <CodePanel
                code={definition.code}
                language={definition.language}
                highlighted={step.highlightedCodeLines}
              />
            </div>
            <div className="min-h-[180px] border-t border-border lg:min-h-[140px] lg:flex-[1]">
              <ExplanationPanel step={step} index={player.index} total={player.total} />
            </div>
          </div>
        </div>
        {controls}
      </section>
      {complexity && (
        <ComplexityCard complexity={complexity} articleScale className="mt-9 max-w-3xl" />
      )}
    </VizMotionProvider>
  );
}
