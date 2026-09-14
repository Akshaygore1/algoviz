import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComplexityInfo } from "@/lib/viz/types";

const GROWTH: Record<string, number> = {
  "O(1)": 4,
  "O(log n)": 14,
  "O(n)": 40,
  "O(n log n)": 62,
  "O(n²)": 85,
  "O(2ⁿ)": 100,
};

function Bar({ label, value }: { label: string; value: string }) {
  const pct = GROWTH[value] ?? 50;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ComplexityCard({ complexity }: { complexity: ComplexityInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Complexity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Bar label="Time (best)" value={complexity.timeBest} />
          <Bar label="Time (average)" value={complexity.timeAverage} />
          <Bar label="Time (worst)" value={complexity.timeWorst} />
          <Bar label="Space" value={complexity.space} />
        </div>
        <p className="border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
          {complexity.plainEnglish}
        </p>
      </CardContent>
    </Card>
  );
}
