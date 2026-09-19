import type { ReactNode } from "react";
import Link from "next/link";
import { CircleDot } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  children: ReactNode;
  breadcrumb?: string;
  actions?: ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-5 sm:px-8 lg:px-10">
          <Link
            href="/home"
            className="flex items-center gap-1.5 rounded-sm text-sm font-semibold tracking-[-0.02em] outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            aria-label="AlgoViz home"
          >
            <CircleDot aria-hidden="true" className="size-4 stroke-[1.8]" />
            <span>algoviz</span>
          </Link>

          <nav aria-label="Primary navigation" className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-4xl flex-1">{children}</main>
    </div>
  );
}
