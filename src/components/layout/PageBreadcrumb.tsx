import Link from "next/link";
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type PageBreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: PageBreadcrumbItem[];
  className?: string;
};

export function PageBreadcrumb({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <Breadcrumb className={className}>
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
  );
}
