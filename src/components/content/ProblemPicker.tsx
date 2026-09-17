"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  problems: { slug: string; title: string }[];
  active: string;
  onSelect: (slug: string) => void;
}

/** Browsable problem directory used on category pages. */
export function ProblemPicker({ problems, active, onSelect }: Props) {
  const activeIndex = Math.max(
    problems.findIndex((problem) => problem.slug === active),
    0,
  );

  return (
    <nav aria-label="Choose a problem">
      <div className="mb-2 flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>Problems</span>
        <p className="shrink-0 tabular-nums">
          {activeIndex + 1} of {problems.length}
        </p>
      </div>

      <div className="sm:hidden">
        <Select value={active} onValueChange={onSelect}>
          <SelectTrigger
            className="h-11 rounded-none border-x-0 border-t-0 px-0 shadow-none"
            aria-label="Choose a problem"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {problems.map((problem) => (
              <SelectItem key={problem.slug} value={problem.slug}>
                {problem.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden gap-x-8 sm:grid sm:grid-cols-2 md:grid-cols-3">
        {problems.map((problem) => {
          const isActive = problem.slug === active;

          return (
            <button
              key={problem.slug}
              type="button"
              onClick={() => onSelect(problem.slug)}
              aria-pressed={isActive}
              className={cn(
                "flex min-h-14 w-full cursor-pointer items-center py-3 text-left text-[15px] tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                isActive
                  ? "font-semibold text-foreground underline decoration-1 underline-offset-8"
                  : "font-medium text-foreground hover:text-muted-foreground",
              )}
            >
              <span className="leading-5">{problem.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
