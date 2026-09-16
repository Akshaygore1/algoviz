"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPEEDS, type Speed } from "@/hooks/use-step-player";
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
  onRestart: () => void;
  onSpeed: (s: Speed) => void;
  onScrub: (i: number) => void;
}

export function SortControlBar(p: Props) {
  const setSpeed = (value: string) => {
    const speed = SPEEDS.find((option) => String(option) === value);
    if (speed) p.onSpeed(speed);
  };

  return (
    <div className="border-t border-border bg-card px-3 py-2.5 sm:px-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5 sm:flex-nowrap sm:gap-x-3">
        <div className="order-2 flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={p.onRestart}
            disabled={p.atStart}
            aria-label="Restart"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={p.onPrev}
            disabled={p.atStart}
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={p.onToggle}
            size="icon"
            className="h-9 w-9"
            aria-label={p.playing ? "Pause" : "Play"}
          >
            {p.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={p.onNext}
            disabled={p.atEnd}
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <StepProgress
          index={p.index}
          total={p.total}
          onScrub={p.onScrub}
          className="order-1 w-full sm:order-2"
        />

        <div className="order-3 ml-auto flex items-center gap-1.5 font-mono text-xs tabular-nums">
          <span
            className="flex items-center gap-1.5"
            aria-label={`Step ${p.index + 1} of ${p.total}`}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground font-medium text-background"
              aria-hidden="true"
            >
              {String(p.index + 1).padStart(2, "0")}
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground"
              aria-hidden="true"
            >
              {String(p.total).padStart(2, "0")}
            </span>
          </span>
          <Select value={String(p.speed)} onValueChange={setSpeed}>
            <SelectTrigger
              className="h-8 w-[62px] border-0 bg-transparent px-2 font-mono text-xs text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
              aria-label="Playback speed"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-20">
              {SPEEDS.map((speed) => (
                <SelectItem key={speed} value={String(speed)} className="font-mono text-xs">
                  {speed}×
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
