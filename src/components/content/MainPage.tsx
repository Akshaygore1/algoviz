import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export type MainPageCard = {
  href: string;
  title: string;
  icon: LucideIcon;
};

type MainPageProps = {
  title: string;
  cards: readonly MainPageCard[];
  breadcrumb?: string;
};

/** A consistent, text-first index for top-level learning paths. */
export function MainPage({ title, cards, breadcrumb = title }: MainPageProps) {
  return (
    <AppShell>
      <div className="mx-auto w-full px-6 pt-6 pb-16 sm:px-8">
        <header className="max-w-3xl">
          <PageBreadcrumb items={[{ label: breadcrumb }]} />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] sm:text-4xl sm:leading-10">
            {title}
          </h1>
        </header>

        <div className="mt-10 max-w-3xl divide-y border-y border-border">
          {cards.map((card) => {
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group grid gap-2 py-5 outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                  {card.title}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
