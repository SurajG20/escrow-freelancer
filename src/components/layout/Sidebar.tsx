"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    Layers,
    Shield,
    User,
    Settings,
    ChevronRight,
    Wallet
} from "lucide-react"; // Make sure to add Wallet if not present, or use CreditCard
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { name: "Overview", icon: Home, href: "/dashboard" },
    { name: "Projects", icon: Layers, href: "/dashboard/projects" },
    { name: "Escrow Vaults", icon: Wallet, href: "/dashboard/vaults" }, // Substituting Vault for Wallet
    { name: "Disputes", icon: Shield, href: "/dashboard/disputes" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();

    return (
        <motion.aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-glass-border bg-glass backdrop-blur-xl transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-16"
            )}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex h-16 items-center justify-center border-b border-glass-border">
                {/* Logo Placeholder */}
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    E
                </div>
                {isExpanded && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 font-semibold text-lg tracking-tight"
                    >
                        Escrow
                    </motion.span>
                )}
            </div>

            <nav className="flex flex-col gap-2 p-3 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 group relative",
                                isActive
                                    ? "bg-accent/10 text-accent font-medium"
                                    : "text-muted-foreground hover:bg-glass-hover hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 min-w-[1.25rem]", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />

                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-3 whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}

                            {!isExpanded && (
                                <div className="absolute left-full ml-4 hidden rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block glass z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </motion.aside>
    );
}
