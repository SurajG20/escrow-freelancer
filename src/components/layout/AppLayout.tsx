"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <Sidebar
        expanded={sidebarExpanded}
        onExpandedChange={setSidebarExpanded}
      />
      <div
        className={`flex flex-1 flex-col transition-all duration-200 ${sidebarExpanded ? "pl-64" : "pl-16"}`}
      >
        <TopBar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
