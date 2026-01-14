"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Home,
    Layers,
    Shield,
    User,
    Settings,
    Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Overview", icon: Home, href: "/dashboard" },
    { name: "Projects", icon: Layers, href: "/dashboard/projects" },
    { name: "Escrow Vaults", icon: Wallet, href: "/dashboard/vaults" },
    { name: "Disputes", icon: Shield, href: "/dashboard/disputes" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-slate-200/50 bg-white/80 backdrop-blur-sm transition-all duration-200 ease-in-out",
                isExpanded ? "w-64" : "w-16"
            )}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex h-14 items-center justify-center border-b border-slate-200/50">
                {isExpanded && (
                    <span className="text-sm font-semibold text-foreground tracking-tight">
                        Custodia
                    </span>
                )}
            </div>

            <nav className="flex flex-col gap-1 p-3 mt-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 group relative text-sm",
                                isActive
                                    ? "bg-accent text-white font-semibold"
                                    : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
                            )}
                            aria-label={item.name}
                        >
                            <item.icon className={cn("h-4 w-4 min-w-[1rem] flex-shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-accent")} />

                            {isExpanded && (
                                <span className="ml-3 whitespace-nowrap">
                                    {item.name}
                                </span>
                            )}

                            {!isExpanded && (
                                <div className="absolute left-full ml-3 hidden rounded-md bg-accent px-2 py-1.5 text-xs text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
