"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DpStage } from "@/lib/viz/algorithms/dp/shared";
import { DP_STAGES } from "@/lib/viz/algorithms/dp/shared";

interface Props {
  active: DpStage;
  onSelect: (stage: DpStage) => void;
}

/** The five-stage progression, with the current stage explained underneath. */
export function StagePicker({ active, onSelect }: Props) {
  const current = DP_STAGES.find((s) => s.slug === active);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-muted-foreground">Stage</span>
        {DP_STAGES.map((stage) => (
          <Button
            key={stage.slug}
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 border-b border-transparent px-2 text-xs",
              stage.slug === active &&
                "border-foreground bg-transparent text-foreground hover:bg-transparent",
            )}
            onClick={() => onSelect(stage.slug)}
            aria-pressed={stage.slug === active}
          >
            {stage.title}
          </Button>
        ))}
      </div>
      {current && <p className="text-xs text-muted-foreground">{current.blurb}</p>}
    </div>
  );
}
