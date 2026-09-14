"use client";

export function VizCounters({ counters }: { counters?: Record<string, number> | undefined }) {
  if (!counters || Object.keys(counters).length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Object.entries(counters).map(([label, value]) => (
        <span
          key={label}
          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
        >
          {label}: <span className="font-mono text-foreground">{value}</span>
        </span>
      ))}
    </div>
  );
}
