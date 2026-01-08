"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
            <Sidebar />
            <div className="flex flex-1 flex-col pl-16 transition-all duration-200">
                <TopBar />
                <main className="flex-1 p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
