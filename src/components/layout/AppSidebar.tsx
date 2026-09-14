"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, LayoutDashboard, ListChecks, Map as MapIcon, Puzzle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Item = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
};

const study: Item[] = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { title: "Algorithms", icon: Braces, to: "/algorithms" },
  { title: "Patterns", icon: Puzzle, to: "/patterns" },
  { title: "Problems", icon: ListChecks, to: "/problems" },
  { title: "Roadmap", icon: MapIcon, to: "/roadmap" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-1 py-1.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground">
            DS
          </span>
          <span className={cn("text-sm font-semibold tracking-tight", collapsed && "hidden")}>
            DSA Visualizer
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Study</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {study.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                    <Link href={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
