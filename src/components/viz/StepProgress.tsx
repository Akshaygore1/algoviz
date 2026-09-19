"use client";

import { cn } from "@/lib/utils";

interface StepProgressProps {
  index: number;
  total: number;
  onScrub: (index: number) => void;
  className?: string;
}

export function StepProgress({ index, total, onScrub, className }: StepProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeIndex = Math.min(Math.max(index, 0), safeTotal - 1);
  const progress = (safeIndex + 1) / safeTotal;

  return (
    <div className={cn("relative flex h-5 min-w-0 flex-1 items-center", className)}>
      <div aria-hidden="true" className="relative h-2 w-full overflow-hidden bg-border/60">
        <span
          className="viz-progress-fill absolute inset-0 origin-left bg-foreground"
          style={{ transform: `scaleX(${progress})` }}
        />
        <span
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${safeTotal}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeTotal - 1 }, (_, stepIndex) => (
            <span key={stepIndex} className="border-r border-card/70" />
          ))}
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={safeTotal}
        step={1}
        value={safeIndex + 1}
        onChange={(event) => onScrub(Number(event.target.value) - 1)}
        aria-label="Step timeline"
        aria-valuetext={`Step ${safeIndex + 1} of ${total}`}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
