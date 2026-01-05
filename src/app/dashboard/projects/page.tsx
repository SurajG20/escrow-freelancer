"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LayoutGrid, List, Plus, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockStore } from "@/lib/store";
import { Project } from "@/types";

export default function ProjectsPage() {
    const [view, setView] = useState<"list" | "board">("list");
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        // Simulate fetch from our mock store
        setProjects(mockStore.getProjects());
    }, []);

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
                                    <td className="px-6 py-4 font-mono">{project.totalAmount}</td>
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
                                    {/* Mock Deadline logic or fetch from first milestone */}
                                    <td className="px-6 py-4 text-right text-muted-foreground">
                                        {project.milestones?.[0]?.deadline || "No deadline"}
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No projects found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {["Pending", "Active", "In Review", "Disputed"].map((col) => {
                        const colProjects = projects.filter(p => p.status === col);
                        return (
                            <div key={col} className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="font-medium text-sm text-muted-foreground">{col}</h3>
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{colProjects.length}</span>
                                </div>
                                <div className="space-y-3">
                                    {colProjects.map(project => (
                                        <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                                            <Card key={project.id} className="glass-card hover:border-accent/50 cursor-pointer transition-all p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className="text-[10px] h-5">{project.client}</Badge>
                                                    <span className="text-xs text-muted-foreground">{project.milestones?.[0]?.deadline || "N/A"}</span>
                                                </div>
                                                <h4 className="font-semibold mb-2">{project.title}</h4>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="font-mono text-sm">{project.totalAmount}</div>
                                                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400" />
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                    {colProjects.length === 0 && (
                                        <div className="h-24 rounded-xl border border-dashed border-glass-border flex items-center justify-center text-xs text-muted-foreground">
                                            Empty
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
