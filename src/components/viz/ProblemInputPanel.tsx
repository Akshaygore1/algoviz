"use client";

import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSpec, ProblemInput } from "@/lib/viz/problemState";

interface Props {
  fields: FieldSpec[];
  value: ProblemInput;
  onChange: (next: ProblemInput) => void;
  /** Prefix for ids when several data-driven panels share a page. */
  idPrefix?: string;
}

/** Data-driven input builder: each problem declares the fields it needs. */
export function ProblemInputPanel({ fields, value, onChange, idPrefix = "f" }: Props) {
  const set = (key: string, next: string) => onChange({ ...value, [key]: next });

  const randomize = (f: FieldSpec) => {
    if (f.kind === "numbers") {
      const len = 6 + Math.floor(Math.random() * 4);
      set(f.key, Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 30)).join(" "));
    } else if (f.kind === "number") {
      set(f.key, String(1 + Math.floor(Math.random() * 9)));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        {fields.map((f) => (
          <div
            key={f.key}
            className={f.kind === "number" ? "w-28 space-y-1.5" : "min-w-48 flex-1 space-y-1.5"}
          >
            <Label htmlFor={`${idPrefix}-${f.key}`} className="text-xs text-muted-foreground">
              {f.label}
            </Label>
            <div className="flex gap-2">
              <Input
                id={`${idPrefix}-${f.key}`}
                value={value[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.kind === "number" ? undefined : f.placeholder}
                inputMode={f.kind === "number" ? "numeric" : undefined}
                className="font-mono"
              />
              {f.kind === "numbers" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => randomize(f)}
                  className="shrink-0"
                >
                  <Dices className="h-4 w-4" aria-hidden />
                  Random
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {fields.some((f) => f.kind !== "number" && f.presets?.length) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Examples:</span>
          {fields.flatMap((f) =>
            f.kind === "number"
              ? []
              : (f.presets ?? []).map((p) => (
                  <Button
                    key={`${f.key}-${p.label}`}
                    variant="secondary"
                    size="sm"
                    className="h-7 font-mono text-xs"
                    onClick={() => set(f.key, p.value)}
                  >
                    {p.label}
                  </Button>
                )),
          )}
        </div>
      )}
    </div>
  );
}
