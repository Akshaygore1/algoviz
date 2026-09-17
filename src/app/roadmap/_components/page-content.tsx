import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { roadmap } from "@/data/roadmap";

export default function RoadmapPage() {
  return (
    <AppShell>
      <div className="mx-auto px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb items={[{ label: "Roadmap" }]} />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] sm:text-4xl sm:leading-10">
            Learning roadmap
          </h1>
          <p className="mt-5 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
            Work from top to bottom, then use the visualizers to make each idea concrete.
          </p>
        </header>

        <div className="mt-10 max-w-3xl divide-y border-y border-border">
          {roadmap.map((track) => (
            <section key={track.id} className="py-7">
              <h2 className="text-xl font-semibold tracking-[-0.02em]">{track.title}</h2>
              <p className="mt-3 max-w-[70ch] text-[17px] leading-[27px] text-muted-foreground">
                {track.description}
              </p>
              <ul className="mt-5 divide-y border-y border-border">
                {track.topics.map((topic) => (
                  <li key={topic.id}>
                    {topic.href ? (
                      <Link
                        href={topic.href}
                        className="group flex items-center justify-between gap-4 py-3 text-sm font-medium outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {topic.title}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    ) : (
                      <span className="block py-3 text-sm text-muted-foreground">
                        {topic.title}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
