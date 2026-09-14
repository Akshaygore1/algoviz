import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  children: ReactNode;
  breadcrumb?: string;
  actions?: ReactNode;
}

export function AppShell({ children, breadcrumb, actions }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-border bg-background/85 px-2 backdrop-blur">
            <SidebarTrigger />
            {breadcrumb && (
              <span className="truncate text-sm text-muted-foreground">{breadcrumb}</span>
            )}
            <div className="ml-auto flex items-center gap-1">
              {actions}
              <ThemeToggle />
            </div>
          </header>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
