"use client";

import { useMemo, useState } from "react";
import { STRING_OPS } from "@/lib/viz/algorithms/strings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CharRow } from "./CharRow";
import { OperationPicker } from "./OperationPicker";
import { VizWorkspace } from "./VizWorkspace";

const samples: Record<string, string[]> = {
  "char-frequency": ["letter", "anagram", "mississippi"],
  "palindrome-check": ["racecar", "abcba", "hello"],
  "longest-unique-substring": ["abcabcbb", "pwwkew", "bbbbb"],
  "reverse-string": ["hello", "visualizer"],
};

export function StringVisualizer({ operation }: { operation?: string }) {
  const [slug, setSlug] = useState(operation ?? STRING_OPS[0]!.slug);
  const [text, setText] = useState("letter");

  const definition = STRING_OPS.find((o) => o.slug === slug) ?? STRING_OPS[0]!;
  const steps = useMemo(() => definition.generate({ text }), [definition, text]);
  const presets = samples[slug] ?? [];

  return (
    <VizWorkspace
      definition={definition}
      steps={steps}
      complexity={definition.complexity}
      renderVisual={(state) => <CharRow state={state} />}
      inputPanel={
        <div className="space-y-3">
          <OperationPicker
            operations={STRING_OPS.map((o) => ({ slug: o.slug, title: o.title.split(" (")[0]! }))}
            active={slug}
            onSelect={(next) => {
              setSlug(next);
              const first = samples[next]?.[0];
              if (first) setText(first);
            }}
          />
          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="string-input" className="text-xs text-muted-foreground">
              Custom string
            </Label>
            <Input
              id="string-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-mono"
              maxLength={20}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setText(p)}
                  className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
