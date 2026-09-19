import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export type MainPageCard = {
  href: string;
  title: string;
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
          <PageBreadcrumb items={[{ label: breadcrumb }]} backHref="/home" />
          <h1 className="mt-6 text-xl leading-8 font-semibold tracking-[-0.03em] sm:text-4xl sm:leading-10">
            {title}
          </h1>
        </header>

        <div className="mt-10 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((card, index) => {
            return (
              <Link
                key={card.href}
                href={card.href}
                className="main-page-card-reveal group flex min-h-14 items-center py-3 outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                style={{ animationDelay: `${Math.min(index, 7) * 30}ms` }}
              >
                <span className="relative inline-block text-[17px] font-semibold tracking-[-0.02em] text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
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
