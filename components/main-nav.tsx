"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RouteItem {
  href: string;
  label: string;
  active: boolean;
}

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const params = useParams();
  const storeIdParam = params?.storeId;

  const storeId = Array.isArray(storeIdParam)
    ? storeIdParam[0]
    : typeof storeIdParam === "string"
    ? storeIdParam
    : undefined;

  const routes = useMemo<RouteItem[]>(() => {
    if (!storeId) {
      return [];
    }

    const basePath = `/${storeId}`;

    return [
      {
        href: basePath,
        label: "Overview",
        active: pathname === basePath,
      },
      {
        href: `${basePath}/billboards`,
        label: "Billboards",
        active: pathname === `${basePath}/billboards`,
      },
      {
        href: `${basePath}/categories`,
        label: "Categories",
        active: pathname === `${basePath}/categories`,
      },
      {
        href: `${basePath}/sizes`,
        label: "Sizes",
        active: pathname === `${basePath}/sizes`,
      },
      {
        href: `${basePath}/colors`,
        label: "Colors",
        active: pathname === `${basePath}/colors`,
      },
      {
        href: `${basePath}/products`,
        label: "Products",
        active: pathname === `${basePath}/products`,
      },
      {
        href: `${basePath}/orders`,
        label: "Orders",
        active: pathname === `${basePath}/orders`,
      },
      {
        href: `${basePath}/settings`,
        label: "Settings",
        active: pathname === `${basePath}/settings`,
      },
    ];
  }, [pathname, storeId]);

  if (!routes.length) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2 lg:gap-4", className)} {...props}>
      <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>

      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {routes.map((route) => (
              <DropdownMenuItem
                key={route.href}
                asChild
                className={cn(
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Link className="flex w-full items-center justify-between" href={route.href}>
                  <span>{route.label}</span>
                  {route.active && (
                    <span
                      aria-hidden="true"
                      className="ml-2 inline-flex size-2 rounded-full bg-primary"
                    />
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
