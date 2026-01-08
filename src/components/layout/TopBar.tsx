"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WalletButton } from "@/components/wallet/WalletButton";

export function TopBar() {
    return (
        <header className="sticky top-0 z-30 flex h-14 w-full items-center gap-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm px-8">
            <div className="flex flex-1 items-center gap-4 md:max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="w-full h-9 bg-slate-50/50 border-slate-200/50 pl-9 text-sm focus:bg-white focus:border-slate-300"
                        aria-label="Search projects"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />
                </Button>

                <WalletButton />
            </div>
        </header>
    );
}
