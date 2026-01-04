"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-1 flex-col pl-16 transition-all duration-300">
                <TopBar />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
