"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPEEDS, type Speed } from "@/hooks/use-step-player";
import { cn } from "@/lib/utils";
import { StepProgress } from "./StepProgress";

interface Props {
  index: number;
  total: number;
  playing: boolean;
  speed: Speed;
  atStart: boolean;
  atEnd: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  onLast: () => void;
  onRestart: () => void;
  onSpeed: (s: Speed) => void;
  onScrub: (i: number) => void;
}

export function ControlBar(p: Props) {
  return (
    <div className="flex flex-col gap-2 border-t border-border bg-card px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="viz-control"
          variant="outline"
          size="icon"
          onClick={p.onFirst}
          disabled={p.atStart}
          aria-label="Jump to first step"
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>
        <Button
          className="viz-control"
          variant="outline"
          size="icon"
          onClick={p.onPrev}
          disabled={p.atStart}
          aria-label="Previous step"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          className="viz-control"
          size="icon"
          onClick={p.onToggle}
          aria-label={p.playing ? "Pause" : "Play"}
        >
          {p.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          className="viz-control"
          variant="outline"
          size="icon"
          onClick={p.onNext}
          disabled={p.atEnd}
          aria-label="Next step"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          className="viz-control"
          variant="outline"
          size="icon"
          onClick={p.onLast}
          disabled={p.atEnd}
          aria-label="Jump to last step"
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
        <Button
          className="viz-control"
          variant="ghost"
          size="icon"
          onClick={p.onRestart}
          aria-label="Restart"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-1 border border-border bg-background p-0.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => p.onSpeed(s)}
              aria-pressed={p.speed === s}
              className={cn(
                "viz-control px-2 py-1 font-mono text-xs",
                p.speed === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StepProgress index={p.index} total={p.total} onScrub={p.onScrub} />
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          step {p.index + 1} / {p.total}
        </span>
      </div>
    </div>
  );
}
