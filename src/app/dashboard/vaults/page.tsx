"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, ArrowDownLeft, Lock, History, Wallet, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProjects } from "@/lib/hooks/useProjects";
import { useProjectWithMilestones } from "@/lib/hooks/useProjects";
import { useMemo } from "react";
import { format } from "date-fns";

export default function VaultsPage() {
    const { address } = useAuth();
    const { data: projects = [], isLoading: projectsLoading } = useProjects(
        address ? { client_wallet: address.toLowerCase() } : undefined
    );

    const activeProjects = projects.filter(p => p.status === "active" || p.status === "in_dispute");
    
    const stats = useMemo(() => {
        const totalLocked = "$0.00";
        const pendingRelease = "$0.00";
        const availableToWithdraw = "$0.00";
        
        return {
            totalLocked,
            pendingRelease,
            availableToWithdraw,
            activeProjectsCount: activeProjects.length,
        };
    }, [activeProjects]);

    if (projectsLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-light tracking-tight">Escrow Vaults</h1>
                    <p className="text-muted-foreground">Manage your locked funds and view transaction history.</p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-light tracking-tight">Escrow Vaults</h1>
                <p className="text-muted-foreground">Manage your locked funds and view transaction history.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card bg-gradient-to-br from-accent/10 to-glass">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Value Locked</CardTitle>
                        <Lock className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalLocked}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across {stats.activeProjectsCount} active projects</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Release</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingRelease}</div>
                        <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available to Withdraw</CardTitle>
                        <Wallet className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.availableToWithdraw}</div>
                        {!address && (
                            <Button variant="ghost" size="sm" className="mt-1 h-6 px-2 -ml-2 text-accent">Connect Wallet to view</Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" /> Recent Projects
                    </CardTitle>
                    <CardDescription>Your active escrow projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    {activeProjects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No active projects found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeProjects.slice(0, 5).map((project) => (
                                <div key={project.id} className="flex items-center justify-between p-4 rounded-xl border border-glass-border bg-white/40 hover:bg-white/60 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{project.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(project.created_at), "MMM d, yyyy")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-xs text-muted-foreground border-transparent bg-muted/50">
                                            {project.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
