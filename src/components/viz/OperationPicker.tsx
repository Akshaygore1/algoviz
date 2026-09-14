"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  operations: { slug: string; title: string }[];
  active: string;
  onSelect: (slug: string) => void;
  label?: string;
}

/** Operation switcher shown above a structure's visualizer. */
export function OperationPicker({ operations, active, onSelect, label = "Operation" }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}:</span>
      {operations.map((op) => (
        <Button
          key={op.slug}
          size="sm"
          variant={op.slug === active ? "default" : "secondary"}
          className={cn("h-7 text-xs", op.slug === active && "shadow-sm")}
          onClick={() => onSelect(op.slug)}
          aria-pressed={op.slug === active}
        >
          {op.title}
        </Button>
      ))}
    </div>
  );
}
