import Link from "next/link";
import * as React from "react";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type PageBreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: PageBreadcrumbItem[];
  className?: string;
  backHref?: string;
  backLabel?: string;
};

export function PageBreadcrumb({ items, className, backHref, backLabel = "Home" }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {backHref && (
        <Link
          href={backHref}
          aria-label={`Back to ${backLabel}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back
        </Link>
      )}

      <Breadcrumb>
        <BreadcrumbList className="text-xs text-muted-foreground sm:gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            // Last item is always rendered as page (current), even if href provided
            const isLink = !!item.href && !isLast;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {isLink ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href!}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : isLast ? (
                    <BreadcrumbPage className="text-xs">{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-xs">{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator className="[&>svg]:size-3" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
