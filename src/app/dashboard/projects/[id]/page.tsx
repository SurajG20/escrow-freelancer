"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle2, Clock, FileText, Send, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockStore } from "@/lib/store";
import { Project } from "@/types";

// Note: params is a Promise in newer Next.js versions (15+)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectDetailPage({ params }: { params: any }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [txPending, setTxPending] = useState(false);

    useEffect(() => {
        // Unwrap params if it's a promise, or use directly
        const loadData = async () => {
            let id;
            if (params instanceof Promise) {
                const resolved = await params;
                id = resolved.id;
            } else {
                // Fallback if not a promise (older Next.js or different runtime)
                id = params.id;
            }

            const data = mockStore.getProjectById(parseInt(id));
            setProject(data || null);
            setLoading(false);
        };
        loadData();
    }, [params]);

    const handleAction = async (action: string, milestoneId?: number) => {
        setTxPending(true);
        await mockStore.simulateTransaction(1500); // 1.5s delay

        if (action === "submit" && milestoneId && project) {
            mockStore.updateMilestoneStatus(project.id, milestoneId, "In Review");
        } else if (action === "approve" && milestoneId && project) {
            mockStore.updateMilestoneStatus(project.id, milestoneId, "Completed");
        } else if (action === "release_funds" && project) {
            // just mock visual effect
        }

        // Refresh data
        if (project) {
            setProject({ ...mockStore.getProjectById(project.id)! });
        }
        setTxPending(false);
    };

    if (loading) return <div className="p-10 text-center">Loading project details...</div>;
    if (!project) return <div className="p-10 text-center">Project not found</div>;

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link href="/dashboard/projects" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
            </Link>

            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-light tracking-tight">{project.title}</h1>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="glass bg-white/50">{project.client}</Badge>
                        <Badge variant={project.status === "Active" ? "success" : "default"} className="bg-emerald-500/10 text-emerald-600 border-none">{project.status}</Badge>
                        <span className="text-sm text-muted-foreground font-mono">Contract: {project.contractAddress || "Pending"}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="glass bg-white/40">View Contract</Button>
                    <Button disabled={txPending}>Deposit Funds</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content: Milestones & Description */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-lg">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Milestones</h2>
                        <div className="space-y-3">
                            {project.milestones.map((milestone) => (
                                <div key={milestone.id} className="group relative overflow-hidden rounded-xl border border-glass-border bg-glass p-5 hover:border-accent/30 transition-all duration-300">
                                    {/* Progress Line */}
                                    <div className={cn(
                                        "absolute left-0 top-0 h-full w-1",
                                        milestone.status === "Completed" ? "bg-emerald-500" :
                                            milestone.status === "In Progress" ? "bg-accent" :
                                                milestone.status === "In Review" ? "bg-orange-400" : "bg-muted"
                                    )} />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1 ml-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-foreground">{milestone.title}</h3>
                                                {milestone.status === "Completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                                {milestone.status === "In Review" && <Clock className="h-4 w-4 text-orange-400" />}
                                            </div>
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {milestone.deadline}</span>
                                                <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {milestone.amount}</span>
                                            </div>
                                        </div>
                                        <div className="ml-3 sm:ml-0 flex gap-2">
                                            {milestone.status === "In Progress" && (
                                                <Button size="sm" className="w-full sm:w-auto" onClick={() => handleAction("submit", milestone.id)} disabled={txPending}>
                                                    {txPending ? "Submitting..." : "Submit Work"}
                                                </Button>
                                            )}
                                            {milestone.status === "In Review" && (
                                                <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleAction("approve", milestone.id)} disabled={txPending}>
                                                    {txPending ? "Approving..." : "Approve & Pay"}
                                                </Button>
                                            )}
                                            {milestone.status === "Completed" && (
                                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Paid & Released</Badge>
                                            )}
                                            {milestone.status === "Locked" && (
                                                <Badge variant="secondary" className="bg-muted text-muted-foreground">Locked</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: State & Summary */}
                <div className="space-y-6">
                    {/* Contract State Visualizer */}
                    <Card className="glass-card bg-gradient-to-br from-glass to-accent/5 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Escrow State
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Simplified State Machine Viz */}
                            <div className="relative flex flex-col gap-6 py-2">
                                <div className="absolute left-[15px] top-2 h-full w-0.5 bg-border -z-10" />

                                {["Deposited", "Milestone Active", "In Review", "Completed"].map((step, i) => {
                                    // Crude logic to highlight step based on ANY active milestone status for demo
                                    const stepIndex = project.milestones.some(m => m.status === "In Review") ? 2 : project.milestones.some(m => m.status === "Completed") ? 3 : 1;
                                    const isActive = i <= stepIndex;

                                    return (
                                        <div key={step} className="flex items-center gap-3">
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors z-10 bg-background",
                                                isActive ? "border-accent bg-accent text-white" : "border-muted text-muted-foreground"
                                            )}>
                                                {i + 1}
                                            </div>
                                            <span className={cn(
                                                "text-sm font-medium",
                                                isActive ? "text-foreground" : "text-muted-foreground"
                                            )}>{step}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Stats */}
                    <Card className="glass-card">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Contract Value</span>
                                <span className="font-mono font-medium text-lg">{project.totalAmount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Released so far</span>
                                <span className="font-mono font-medium text-emerald-600">{project.releasedAmount}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-[40%] bg-emerald-500 rounded-full" />
                            </div>

                            <div className="pt-4 border-t border-glass-border">
                                <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <AlertTriangle className="h-4 w-4 mr-2" /> Raise Dispute
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat/Activity Placeholder */}
                    <Card className="glass-card h-64 flex flex-col">
                        <CardHeader className="pb-2 border-b border-glass-border">
                            <CardTitle className="text-sm">Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
                            <div className="text-xs text-muted-foreground text-center">Today</div>
                            <div className="flex gap-2">
                                <div className="h-6 w-6 rounded-full bg-blue-200" />
                                <div className="bg-white/50 p-2 rounded-r-lg rounded-bl-lg text-sm max-w-[80%]">
                                    Submitting the UI mocks for review.
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-3 border-t border-glass-border">
                            <div className="relative">
                                <input className="w-full bg-muted/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Type a message..." />
                                <Send className="absolute right-3 top-2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
