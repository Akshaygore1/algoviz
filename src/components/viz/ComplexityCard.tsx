import type { ComplexityInfo } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

function Metric({
  label,
  value,
  articleScale,
}: {
  label: string;
  value: string;
  articleScale: boolean;
}) {
  return (
    <div className="py-3">
      <dt
        className={cn(
          "text-[11px] tracking-wide text-muted-foreground",
          articleScale && "text-[15px] leading-6 tracking-normal",
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 font-mono text-sm font-medium tabular-nums",
          articleScale && "text-[17px] leading-[27px]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function ComplexityCard({
  complexity,
  articleScale = false,
  className,
}: {
  complexity: ComplexityInfo;
  articleScale?: boolean;
  className?: string;
}) {
  return (
    <section aria-labelledby="complexity-heading" className={cn("pt-2", className)}>
      <h2
        id="complexity-heading"
        className={cn(
          "text-sm font-medium",
          articleScale &&
            "text-xl leading-[26px] font-semibold tracking-[-0.02em] sm:text-2xl sm:leading-8 sm:tracking-[-0.04em]",
        )}
      >
        Complexity
      </h2>
      <p
        className={cn(
          "mt-1 text-xs leading-relaxed text-muted-foreground",
          articleScale && "mt-3 text-[17px] leading-[27px]",
        )}
      >
        These metrics show how the algorithm scales as input grows: time measures work; space
        measures extra memory.
      </p>

      <dl
        className={cn(
          "mt-3 grid grid-cols-2 gap-x-6 gap-y-0 sm:grid-cols-4",
          articleScale && "mt-6",
        )}
      >
        <Metric label="Time — best" value={complexity.timeBest} articleScale={articleScale} />
        <Metric label="Time — avg" value={complexity.timeAverage} articleScale={articleScale} />
        <Metric label="Time — worst" value={complexity.timeWorst} articleScale={articleScale} />
        <Metric label="Space" value={complexity.space} articleScale={articleScale} />
      </dl>

      <p
        className={cn(
          "mt-1 text-sm leading-relaxed text-muted-foreground",
          articleScale && "mt-3 text-[17px] leading-[27px]",
        )}
      >
        {complexity.plainEnglish}
      </p>
    </section>
  );
}
