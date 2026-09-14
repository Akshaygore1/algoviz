import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/badge";
import { patterns } from "@/data/patterns";
import { problems } from "@/data/problems";

export default PatternsPage;

function PatternsPage() {
  return (
    <AppShell breadcrumb="Interview prep / Patterns">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-semibold tracking-tight">Choose an Pattern</h1>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 pt-8">
          {patterns.map((p) => {
            return (
              <Link
                key={p.id}
                href={`/patterns/${p.id}`}
                className="group relative flex flex-col rounded-lg border bg-card p-4 outline-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug">{p.name}</h3>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
