"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { ThemedToken } from "shiki";
import { cn } from "@/lib/utils";
import { highlightJavaScript } from "@/lib/shiki";
import { useVizMotion } from "./VizMotionContext";

interface Props {
  code: string[];
  language: string;
  highlighted: number[];
}

export function CodePanel({ code, language, highlighted }: Props) {
  const motionMode = useVizMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const source = useMemo(() => code.join("\n"), [code]);
  const [highlightedCode, setHighlightedCode] = useState<{
    source: string;
    lines: ThemedToken[][];
  } | null>(null);
  const tokenLines = highlightedCode?.source === source ? highlightedCode.lines : null;

  useEffect(() => {
    let cancelled = false;

    highlightJavaScript(source)
      .then((tokens) => {
        if (!cancelled) setHighlightedCode({ source, lines: tokens });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [source]);

  const firstHighlighted = highlighted.length > 0 ? Math.min(...highlighted) : null;
  const lastHighlighted = highlighted.length > 0 ? Math.max(...highlighted) : null;

  useEffect(() => {
    if (firstHighlighted === null) return;
    const container = scrollRef.current;
    const line = container?.querySelector<HTMLElement>(`[data-code-line="${firstHighlighted}"]`);
    if (!container || !line) return;

    const top = line.offsetTop - container.clientHeight / 2 + line.offsetHeight / 2;
    container.scrollTo({
      top: Math.max(0, top),
      behavior: motionMode === "full" ? "smooth" : "auto",
    });
  }, [firstHighlighted, motionMode]);

  return (
    <section aria-label={`${language} code`} className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Code</h3>
        <span className="font-mono text-[11px] text-muted-foreground">{language}</span>
      </header>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto py-3">
        <pre className="w-max min-w-full font-mono text-[11px] leading-[18px]">
          <code className="relative block">
            <span
              aria-hidden
              className="viz-code-highlight pointer-events-none absolute inset-x-0 top-0 z-0 h-[18px] bg-primary/10"
              style={{
                opacity: firstHighlighted === null ? 0 : 1,
                transform:
                  firstHighlighted === null
                    ? "translateY(0) scaleY(1)"
                    : `translateY(${(firstHighlighted - 1) * 18}px) scaleY(${lastHighlighted! - firstHighlighted + 1})`,
                transformOrigin: "top",
              }}
            />
            {code.map((line, i) => {
              const active = highlighted.includes(i + 1);
              const tokens = tokenLines?.[i];

              return (
                <span
                  key={i}
                  data-code-line={i + 1}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "relative z-10 flex min-w-max gap-3 px-4",
                    active && "font-medium text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "w-5 shrink-0 text-right text-muted-foreground/60 select-none",
                      active && "font-semibold text-primary",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">
                    {tokens
                      ? tokens.map((token) => (
                          <span
                            key={token.offset}
                            className="shiki-token"
                            style={token.htmlStyle as CSSProperties}
                          >
                            {token.content}
                          </span>
                        ))
                      : line || " "}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </section>
  );
}
