"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AlgorithmDefinition, AlgorithmStep, ComplexityInfo } from "@/lib/viz/types";
import { useStepPlayer } from "@/hooks/use-step-player";
import { CodePanel } from "./CodePanel";
import { ControlBar } from "./ControlBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ComplexityCard } from "./ComplexityCard";

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
    <>
      <section className="overflow-hidden border border-border bg-card">
        {inputPanel && <div className="bg-viz-surface px-4 py-3">{inputPanel}</div>}

        <div className="grid lg:grid-cols-[1.65fr_0.95fr]">
          <div className="min-h-[360px] bg-viz-surface lg:min-h-[440px]">
            {renderVisual(step.state)}
          </div>
          <div className="min-h-[360px] bg-card lg:min-h-[440px]">
            <Tabs defaultValue="explain" className="flex h-full flex-col">
              <TabsList className="h-auto justify-start rounded-none bg-transparent p-1.5">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="explain">Explanation</TabsTrigger>
              </TabsList>
              <TabsContent
                value="explain"
                className="m-0 min-h-0 flex-1 data-[state=inactive]:hidden"
              >
                <ExplanationPanel step={step} index={player.index} total={player.total} />
              </TabsContent>
              <TabsContent
                value="code"
                className="m-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
              >
                <CodePanel
                  code={definition.code}
                  language={definition.language}
                  highlighted={step.highlightedCodeLines}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {controls}
      </section>
      {complexity && (
        <ComplexityCard complexity={complexity} articleScale className="mt-9 max-w-3xl" />
      )}
    </>
  );
}
