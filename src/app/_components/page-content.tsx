import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

const destinations = [
  {
    href: "/algorithms",
    title: "Algorithms",
    description: "Sort, search, divide problems, and step through every decision.",
  },
  {
    href: "/data-structures",
    title: "Data structures",
    description: "See how arrays, lists, stacks, queues, trees, heaps, and maps behave.",
  },
  {
    href: "/patterns",
    title: "Interview patterns",
    description: "Learn to recognize the shape of a problem before writing code.",
  },
  {
    href: "/problems",
    title: "Practice problems",
    description: "Follow a solved problem one operation at a time.",
  },
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto px-6 pt-16 pb-16 sm:px-8 sm:pt-24">
        <header className="max-w-3xl">
          <h1 className="text-3xl leading-10 font-semibold tracking-[-0.03em] text-balance sm:text-5xl sm:leading-[1.08]">
            Learn data structures by seeing them work.
          </h1>
          <p className="mt-5 max-w-[65ch] text-[17px] leading-[27px] text-muted-foreground">
            Step through algorithms, inspect the code beside each move, and understand the idea
            before you practice it.
          </p>
        </header>

        <nav
          aria-label="Learning areas"
          className="mt-12 max-w-3xl divide-y border-y border-border"
        >
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="group grid gap-2 py-5 outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <span>
                <span className="block text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                  {destination.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {destination.description}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </nav>

        <Link
          href="/roadmap"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          Follow the learning roadmap <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </AppShell>
  );
}
