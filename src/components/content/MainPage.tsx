import type { LucideIcon } from "lucide-react";
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
  return (
    <AppShell breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex min-h-16 items-center gap-3 overflow-hidden rounded-xl border border-black bg-card p-4 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Icon aria-hidden="true" className="h-6 w-6 shrink-0 stroke-[1.6]" />
                <h2 className="text-base font-semibold tracking-tight sm:text-lg">{card.title}</h2>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
