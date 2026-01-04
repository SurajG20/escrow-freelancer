"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LayoutGrid, List, Plus, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data
const projects = [
    { id: 1, title: "DeFi Dashboard Implementation", client: "Alpha Labs", status: "Active", amount: "2.5 ETH", deadline: "2 days left" },
    { id: 2, title: "NFT Marketplace Audit", client: "OpenSea Clone", status: "In Review", amount: "4.0 ETH", deadline: "5 days left" },
    { id: 3, title: "Solana Smart Contract", client: "SolDevs", status: "Pending", amount: "15 SOL", deadline: "1 week left" },
    { id: 4, title: "Marketing Website Redesign", client: "Creative Agency", status: "Disputed", amount: "1.2 ETH", deadline: "Overdue" },
];

export default function ProjectsPage() {
    const [view, setView] = useState<"list" | "board">("list");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-light tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your active contracts and bids.</p>
                </div>
                <Link href="/dashboard/projects/new">
                    <Button className="gap-2 shadow-lg shadow-accent/20">
                        <Plus className="h-4 w-4" /> New Project
                    </Button>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-glass/30 p-2 rounded-xl border border-glass-border">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search projects..." className="pl-9 bg-white/50 border-transparent shadow-none" />
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-white/50">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex bg-muted/20 p-1 rounded-lg border border-glass-border/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-8 px-3", view === "list" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
                        onClick={() => setView("list")}
                    >
                        <List className="h-4 w-4 mr-2" /> List
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-8 px-3", view === "board" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground")}
                        onClick={() => setView("board")}
                    >
                        <LayoutGrid className="h-4 w-4 mr-2" /> Board
                    </Button>
                </div>
            </div>

            {/* Content */}
            {view === "list" ? (
                <div className="rounded-xl border border-glass-border bg-glass/50 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/30 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-4 font-normal">Project Name</th>
                                <th className="px-6 py-4 font-normal">Client</th>
                                <th className="px-6 py-4 font-normal">Locked Value</th>
                                <th className="px-6 py-4 font-normal">Status</th>
                                <th className="px-6 py-4 font-normal text-right">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border/50">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-white/40 transition-colors group cursor-pointer" onClick={() => window.location.href = `/dashboard/projects/${project.id}`}>
                                    <td className="px-6 py-4 font-medium text-foreground">{project.title}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{project.client}</td>
                                    <td className="px-6 py-4 font-mono">{project.amount}</td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                project.status === "Active" ? "success" :
                                                    project.status === "Disputed" ? "destructive" :
                                                        project.status === "Pending" ? "warning" : "default"
                                            }
                                            className="bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm"
                                        >
                                            {project.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right text-muted-foreground">{project.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {["Pending", "Active", "In Review", "Disputed"].map((col) => (
                        <div key={col} className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="font-medium text-sm text-muted-foreground">{col}</h3>
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{projects.filter(p => p.status === col).length}</span>
                            </div>
                            <div className="space-y-3">
                                {projects.filter(p => p.status === col).map(project => (
                                    <Card key={project.id} className="glass-card hover:border-accent/50 cursor-pointer transition-all p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="text-[10px] h-5">{project.client}</Badge>
                                            <span className="text-xs text-muted-foreground">{project.deadline}</span>
                                        </div>
                                        <h4 className="font-semibold mb-2">{project.title}</h4>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="font-mono text-sm">{project.amount}</div>
                                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400" />
                                        </div>
                                    </Card>
                                ))}
                                {projects.filter(p => p.status === col).length === 0 && (
                                    <div className="h-24 rounded-xl border border-dashed border-glass-border flex items-center justify-center text-xs text-muted-foreground">
                                        Empty
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
