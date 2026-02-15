"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Layers, Shield, User, Settings, Wallet, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", icon: Home, href: "/dashboard" },
  { name: "Projects", icon: Layers, href: "/dashboard/projects" },
  { name: "Escrow Vaults", icon: Wallet, href: "/dashboard/vaults" },
  { name: "Disputes", icon: Shield, href: "/dashboard/disputes" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface SidebarProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function Sidebar({ expanded, onExpandedChange, mobileOpen = false, onMobileOpenChange }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (mobileOpen && onMobileOpenChange) onMobileOpenChange(false);
  }, [pathname, onMobileOpenChange]);

  const closeMobile = () => onMobileOpenChange?.(false);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        aria-hidden="true"
        onClick={closeMobile}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-slate-200/50 bg-white/95 backdrop-blur-sm transition-all duration-200 ease-in-out",
          "lg:z-40 lg:bg-white/80",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0 w-[min(280px,85vw)]" : "-translate-x-full w-[min(280px,85vw)]",
          "lg:w-16 lg:translate-x-0",
          expanded && "lg:w-64"
        )}
      >
        <div className={cn(
          "flex h-14 items-center border-b border-slate-200/50 px-3 gap-2",
          expanded ? "justify-between" : "justify-center lg:justify-center"
        )}>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 min-w-0",
              !expanded && "lg:justify-center"
            )}
            aria-label="Custodia home"
            onClick={closeMobile}
          >
            <Image
              src="/android-chrome-192x192.png"
              alt=""
              width={expanded ? 32 : 28}
              height={expanded ? 32 : 28}
              className="flex-shrink-0 rounded-lg"
            />
            {(expanded || mobileOpen) && (
              <span className="text-sm font-semibold text-foreground tracking-tight truncate">
                Custodia
              </span>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={closeMobile}
              className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onExpandedChange(!expanded)}
              className="hidden lg:flex rounded-lg p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 mt-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 group relative text-sm",
                  isActive
                    ? "bg-accent text-white font-semibold"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-accent",
                )}
                aria-label={item.name}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 min-w-[1rem] flex-shrink-0",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground group-hover:text-accent",
                  )}
                />

                {(expanded || mobileOpen) && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}

                {!expanded && !mobileOpen && (
                  <div className="absolute left-full ml-3 hidden rounded-md bg-accent px-2 py-1.5 text-xs text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
