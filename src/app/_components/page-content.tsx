import Link from "next/link";
import { ArrowRight, Braces, Puzzle, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { HeroDemo } from "./HeroDemo";
import { roadmap } from "@/data/roadmap";

export default Home;

const steps = [
  {
    icon: StepForward,
    title: "Step through it",
    body: "Move one decision at a time, forward or back, at the speed you want.",
  },
  {
    icon: Braces,
    title: "Keep code in sync",
    body: "The active line and live variables show exactly what the algorithm is doing.",
  },
  {
    icon: Puzzle,
    title: "Recognise the pattern",
    body: "Connect the concept to the interview pattern and problems behind it.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground">
              DS
            </span>
            <span className="text-sm font-semibold tracking-tight">DSA Visualizer</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/visualizers">Visualizers</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patterns">Patterns</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/roadmap">Roadmap</Link>
            </Button>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-12 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Don&apos;t memorize algorithms. See how they work.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Step through algorithms, connect them to interview patterns, and build confidence one
              decision at a time.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/learn/arrays">
                  Start learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/visualizers">Explore visualizers</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <HeroDemo />
          </div>
        </section>

        <Band title="How it works">
          <ol className="grid gap-8 border-y border-border py-7 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.title} className="flex gap-3">
                <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Band>

        <Band
          title="Start with a visualizer"
          subtitle="Every algorithm uses the same step engine, so the controls stay familiar."
        >
          <div className="divide-y border-b border-border">
            <VizCard
              to="/visualizers/bubble-sort"
              title="Bubble Sort"
              body="Watch neighbouring values compare, swap, and lock into place from the right."
              meta="O(n²) · sorting"
            />
            <VizCard
              to="/visualizers/binary-search"
              title="Binary Search"
              body="See left, mid, and right move while each comparison cuts the search space in half."
              meta="O(log n) · searching"
            />
          </div>
        </Band>

        <Band title="Interview patterns">
          <div className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Two pointers, sliding window, binary search, stacks, graphs, and dynamic programming
              become easier when you can recognise their shape.
            </p>
            <Button variant="outline" className="shrink-0" asChild>
              <Link href="/patterns">
                Browse patterns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Band>

        <Band title="Learning roadmap" subtitle="A route from arrays to dynamic programming.">
          <div className="divide-y border-b border-border">
            {roadmap.map((track) => (
              <div key={track.id} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <h3 className="text-sm font-semibold tracking-tight">{track.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{track.description}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-5" asChild>
            <Link href="/roadmap">
              View roadmap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Band>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 text-xs text-muted-foreground sm:px-6">
          <span>DSA Visualizer</span>
          <span className="ml-auto">Concept clarity first. Interview readiness second.</span>
        </div>
      </footer>
    </div>
  );
}

function Band({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="mt-2 mb-7 text-sm text-muted-foreground">{subtitle}</p>
        ) : (
          <div className="mb-7" />
        )}
        {children}
      </div>
    </section>
  );
}

function VizCard({
  to,
  title,
  body,
  meta,
}: {
  to: "/visualizers/bubble-sort" | "/visualizers/binary-search";
  title: string;
  body: string;
  meta: string;
}) {
  return (
    <Link
      href={to}
      className="group flex flex-col gap-2 py-5 transition-colors hover:bg-accent/40 sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      <span className="font-mono text-[11px] text-muted-foreground sm:pt-1">{meta}</span>
    </Link>
  );
}
