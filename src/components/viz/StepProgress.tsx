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

  return (
    <div className={cn("relative flex h-5 min-w-0 flex-1 items-center", className)}>
      <div
        aria-hidden="true"
        className="grid w-full items-center"
        style={{
          gridTemplateColumns: `repeat(${safeTotal}, minmax(0, 1fr))`,
          gap: safeTotal > 64 ? "1px" : "2px",
        }}
      >
        {Array.from({ length: safeTotal }, (_, stepIndex) => (
          <span
            key={stepIndex}
            className={cn(
              "mx-auto aspect-square w-full max-w-2 border transition-colors duration-150",
              stepIndex <= safeIndex
                ? "border-foreground bg-foreground"
                : "border-border bg-transparent",
            )}
          />
        ))}
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
