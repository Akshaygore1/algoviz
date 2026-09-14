"use client";

import type { ReactNode } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AlgorithmDefinition, AlgorithmStep } from "@/lib/viz/types";
import { useStepPlayer } from "@/lib/viz/useStepPlayer";
import { CodePanel } from "./CodePanel";
import { ControlBar } from "./ControlBar";
import { ExplanationPanel } from "./ExplanationPanel";

interface Props<TState, TInput> {
  definition: AlgorithmDefinition<TState, TInput>;
  steps: AlgorithmStep<TState>[];
  renderVisual: (state: TState) => ReactNode;
  /** Input builder (custom values, random, presets). */
  inputPanel?: ReactNode;
  /** Disable global shortcuts when several workspaces are rendered together. */
  keyboardShortcuts?: boolean;
}

export function VizWorkspace<TState, TInput>({
  definition,
  steps,
  renderVisual,
  inputPanel,
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
      showShortcuts={keyboardShortcuts}
    />
  );

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {inputPanel && (
        <div className="border-b border-border bg-viz-surface px-4 py-3">{inputPanel}</div>
      )}

      {/* Desktop: stacked visual + controls + resizable code/explanation */}
      <div className="hidden md:block">
        <div className="min-h-[320px] bg-viz-surface">{renderVisual(step.state)}</div>
        {controls}
        <ResizablePanelGroup className="min-h-[300px]">
          <ResizablePanel defaultSize="55%" minSize="30%">
            <CodePanel
              code={definition.code}
              language={definition.language}
              highlighted={step.highlightedCodeLines}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="45%" minSize="25%">
            <ExplanationPanel step={step} index={player.index} total={player.total} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: tabbed panels */}
      <div className="md:hidden">
        <Tabs defaultValue="visual">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-2">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="explain">Explanation</TabsTrigger>
          </TabsList>
          <TabsContent value="visual" className="m-0">
            <div className="min-h-[260px] bg-viz-surface">{renderVisual(step.state)}</div>
          </TabsContent>
          <TabsContent value="code" className="m-0 h-[320px]">
            <CodePanel
              code={definition.code}
              language={definition.language}
              highlighted={step.highlightedCodeLines}
            />
          </TabsContent>
          <TabsContent value="explain" className="m-0 h-[320px]">
            <ExplanationPanel step={step} index={player.index} total={player.total} />
          </TabsContent>
        </Tabs>
        {controls}
      </div>
    </section>
  );
}
