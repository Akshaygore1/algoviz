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
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Stage:</span>
        {DP_STAGES.map((stage) => (
          <Button
            key={stage.slug}
            size="sm"
            variant={stage.slug === active ? "default" : "secondary"}
            className={cn("h-7 text-xs", stage.slug === active && "shadow-sm")}
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
