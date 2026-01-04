"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function TopBar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b border-glass-border bg-glass/50 px-6 backdrop-blur-md">
            {/* Search - simplified for now */}
            <div className="flex flex-1 items-center gap-2 md:max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="w-full bg-white/40 pl-9 focus:bg-white/80"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5 stroke-[1.5px]" />
                </Button>

                {/* Placeholder Network Indicator */}
                <div className="hidden items-center gap-2 rounded-full border border-glass-border bg-glass/50 px-3 py-1 text-xs font-medium sm:flex">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Mainnet
                </div>

                {/* User Profile Placeholder */}
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-purple-400 ring-2 ring-white/20" />
            </div>
        </header>
    );
}
