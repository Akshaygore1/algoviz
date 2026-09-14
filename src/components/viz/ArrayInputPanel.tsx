"use client";

import { useState } from "react";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Preset {
  label: string;
  values: number[];
}

interface Props {
  values: number[];
  onChange: (values: number[]) => void;
  presets?: Preset[];
  /** Optional extra field, e.g. binary search target. */
  extra?: React.ReactNode;
  maxLength?: number;
}

function parse(raw: string, maxLength: number) {
  return raw
    .split(/[\s,]+/)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n))
    .slice(0, maxLength);
}

export function ArrayInputPanel({ values, onChange, presets, extra, maxLength = 16 }: Props) {
  const [raw, setRaw] = useState(values.join(" "));
  const [error, setError] = useState<string | null>(null);

  const apply = (text: string) => {
    const parsed = parse(text, maxLength);
    if (parsed.length < 2) {
      setError(`Enter at least 2 numbers, separated by spaces (max ${maxLength}).`);
      return;
    }
    setError(null);
    onChange(parsed);
  };

  const randomize = () => {
    const len = 6 + Math.floor(Math.random() * 5);
    const next = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99));
    setRaw(next.join(" "));
    setError(null);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-52 flex-1 space-y-1.5">
          <Label htmlFor="viz-input" className="text-xs text-muted-foreground">
            Custom input
          </Label>
          <Input
            id="viz-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply(raw)}
            placeholder="8 3 5 1 9 6 2"
            className="font-mono"
            aria-invalid={!!error}
          />
        </div>
        {extra}
        <Button onClick={randomize} size="sm" variant="outline">
          <Dices className="h-4 w-4" aria-hidden />
          Random
        </Button>
      </div>

      {error && <p className="text-xs text-viz-error">{error}</p>}

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Presets:</span>
          {presets.map((p) => {
            const isRandomPreset = p.label.trim().toLowerCase() === "random";

            return (
              <Button
                key={p.label}
                variant={isRandomPreset ? "outline" : "secondary"}
                size="sm"
                className={isRandomPreset ? "shrink-0" : "h-7 text-xs"}
                onClick={() => {
                  setRaw(p.values.join(" "));
                  setError(null);
                  onChange(p.values);
                }}
              >
                {isRandomPreset && <Dices className="h-4 w-4" aria-hidden />}
                {p.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
