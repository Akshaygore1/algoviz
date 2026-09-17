"use client";

import { cn } from "@/lib/utils";

interface Props {
  code: string[];
  language: string;
  highlighted: number[];
}

export function CodePanel({ code, language, highlighted }: Props) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-4 py-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Code
        </h3>
        <span className="font-mono text-[11px] text-muted-foreground">{language}</span>
      </header>
      <div className="min-h-0 flex-1 overflow-auto py-2">
        <pre className="font-mono text-xs leading-5">
          {code.map((line, i) => {
            const active = highlighted.includes(i + 1);
            return (
              <div
                key={i}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex gap-3 px-4 transition-colors",
                  active && "bg-primary/12 border-l-2 border-primary pl-3.5 font-medium",
                )}
              >
                <span className="w-5 shrink-0 text-right text-muted-foreground/60 select-none">
                  {i + 1}
                </span>
                <code className="whitespace-pre">{line || " "}</code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
