"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProjects } from "@/lib/hooks/useProjects";
import { useMemo } from "react";

export default function DashboardPage() {
    const { address } = useAuth();
    const { data: projects = [], isLoading } = useProjects(
        address ? { client_wallet: address.toLowerCase() } : undefined
    );

    const stats = useMemo(() => {
        const activeProjects = projects.filter(p => p.status === "active").length;
        const inDisputeProjects = projects.filter(p => p.status === "in_dispute").length;
        const draftProjects = projects.filter(p => p.status === "draft").length;
        const completedProjects = projects.filter(p => p.status === "completed").length;
        
        const totalProjects = projects.length;
        const pendingActions = inDisputeProjects + draftProjects;

        return {
            totalLocked: "$0.00",
            activeProjects: totalProjects,
            pendingActions,
            reputation: "N/A",
        };
    }, [projects]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-light tracking-tight text-foreground">Overview</h1>
                <div className="flex gap-2">
                    <Badge variant="outline" className="glass bg-white/50">Updated just now</Badge>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { title: "Total Locked", value: stats.totalLocked, change: "Across projects" },
                        { title: "Active Projects", value: stats.activeProjects.toString(), change: `${projects.filter(p => p.status === "active").length} active` },
                        { title: "Pending Actions", value: stats.pendingActions.toString(), change: "Requires attention" },
                        { title: "Reputation", value: stats.reputation, change: "Score" },
                    ].map((stat, i) => (
                        <Card key={i} className="glass-card hover:bg-white/60 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <ArrowUpRight className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1 text-emerald-600">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="h-96 rounded-2xl border border-glass-border bg-glass/30 flex items-center justify-center text-muted-foreground">
                Activity Chart Placeholder
            </div>
        </div>
    );
}
