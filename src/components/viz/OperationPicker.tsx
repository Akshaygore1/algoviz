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
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs text-muted-foreground">{label}</span>
      {operations.map((op) => (
        <Button
          key={op.slug}
          size="sm"
          variant="ghost"
          className={cn(
            "h-7 border-b border-transparent px-2 text-xs",
            op.slug === active &&
              "border-foreground bg-transparent text-foreground hover:bg-transparent",
          )}
          onClick={() => onSelect(op.slug)}
          aria-pressed={op.slug === active}
        >
          {op.title}
        </Button>
      ))}
    </div>
  );
}
