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
import { Slider } from "@/components/ui/slider";
import { SPEEDS, type Speed } from "@/lib/viz/useStepPlayer";
import { cn } from "@/lib/utils";

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
  showShortcuts?: boolean;
}

export function ControlBar(p: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={p.onFirst}
          disabled={p.atStart}
          aria-label="Jump to first step"
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={p.onPrev}
          disabled={p.atStart}
          aria-label="Previous step"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={p.onToggle}
          className="min-w-24"
          aria-label={p.playing ? "Pause" : "Play"}
        >
          {p.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {p.playing ? "Pause" : "Play"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={p.onNext}
          disabled={p.atEnd}
          aria-label="Next step"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={p.onLast}
          disabled={p.atEnd}
          aria-label="Jump to last step"
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={p.onRestart} aria-label="Restart">
          <RotateCcw className="h-4 w-4" />
          Restart
        </Button>

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => p.onSpeed(s)}
              aria-pressed={p.speed === s}
              className={cn(
                "rounded-md px-2 py-1 font-mono text-xs transition-colors",
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
        <Slider
          value={[p.index]}
          min={0}
          max={Math.max(0, p.total - 1)}
          step={1}
          onValueChange={(vals) => p.onScrub(vals[0] ?? 0)}
          aria-label="Step timeline"
        />
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          step {p.index + 1} / {p.total}
        </span>
      </div>

      {p.showShortcuts !== false && (
        <p className="text-[11px] text-muted-foreground">
          Shortcuts: <kbd className="font-mono">Space</kbd> play/pause ·{" "}
          <kbd className="font-mono">←</kbd> <kbd className="font-mono">→</kbd> step ·{" "}
          <kbd className="font-mono">R</kbd> restart · <kbd className="font-mono">+</kbd>/
          <kbd className="font-mono">−</kbd> speed
        </p>
      )}
    </div>
  );
}
