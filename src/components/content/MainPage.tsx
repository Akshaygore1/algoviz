import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

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

/** A consistent, navigable card grid for top-level app pages. */
export function MainPage({ title, cards, breadcrumb = title }: MainPageProps) {
  const isHome = breadcrumb === "Home";

  return (
    <AppShell breadcrumb={breadcrumb}>
      <header className="mx-auto flex w-full max-w-300 flex-col items-center px-5 py-10 sm:min-h-44 sm:px-8 lg:px-10">
        <h1 className="text-center text-xl font-medium tracking-tight text-foreground sm:text-[1.375rem]">
          {title}
        </h1>
        {!isHome && (
          <Link
            href="/home"
            aria-label="Back to home"
            className="mt-8 inline-flex size-8 self-start items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </Link>
        )}
      </header>

      <div className="mx-auto w-full max-w-300 px-4 pt-10 pb-16 sm:pt-12 sm:pb-20">
        <div className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex items-center justify-center gap-2.5 rounded-lg bg-card px-3.5 py-2.5 outline-none"
              >
                <Icon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                />
                <span className="text-lg font-medium tracking-tight text-foreground">
                  {card.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
