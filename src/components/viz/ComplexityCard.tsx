import type { ComplexityInfo } from "@/lib/viz/types";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3">
      <dt className="text-[11px] tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}

export function ComplexityCard({ complexity }: { complexity: ComplexityInfo }) {
  return (
    <section aria-labelledby="complexity-heading" className="pt-2">
      <h2 id="complexity-heading" className="text-sm font-medium">
        Complexity
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        These metrics show how the algorithm scales as input grows: time measures work; space
        measures extra memory.
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-0 sm:grid-cols-4">
        <Metric label="Time — best" value={complexity.timeBest} />
        <Metric label="Time — avg" value={complexity.timeAverage} />
        <Metric label="Time — worst" value={complexity.timeWorst} />
        <Metric label="Space" value={complexity.space} />
      </dl>

      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {complexity.plainEnglish}
      </p>
    </section>
  );
}
