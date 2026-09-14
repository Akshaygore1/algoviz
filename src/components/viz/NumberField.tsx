"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberField({ id, label, value, onChange, min, max, className = "w-24" }: Props) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
        className="font-mono"
      />
    </div>
  );
}
