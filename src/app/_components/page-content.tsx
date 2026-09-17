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
          className="mt-12 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2"
        >
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="group py-5 outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span>
                <span className="block text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                  {destination.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {destination.description}
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </AppShell>
  );
}
