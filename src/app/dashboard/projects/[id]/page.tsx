"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle2, Clock, FileText, Send, Shield, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProjectWithMilestones } from "@/lib/hooks/useProjects";
import { useUpdateMilestone } from "@/lib/hooks/useMilestones";
import { useCreateDispute } from "@/lib/hooks/useDisputes";
import { useAuth } from "@/lib/hooks/useAuth";
import { format } from "date-fns";

// Note: params is a Promise in newer Next.js versions (15+)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectDetailPage({ params }: { params: any }) {
    const [projectId, setProjectId] = useState<string | null>(null);
    const [txPending, setTxPending] = useState(false);
    const { address } = useAuth();
    const updateMilestoneMutation = useUpdateMilestone();
    const createDisputeMutation = useCreateDispute();

    useEffect(() => {
        const loadParams = async () => {
            let id;
            if (params instanceof Promise) {
                const resolved = await params;
                id = resolved.id;
            } else {
                id = params.id;
            }
            setProjectId(id);
        };
        loadParams();
    }, [params]);

    const { data: project, isLoading, refetch } = useProjectWithMilestones(projectId || "");

    const handleAction = async (action: string, milestoneId?: string) => {
        if (!milestoneId || !project) return;

        setTxPending(true);
        try {
            if (action === "submit") {
                await updateMilestoneMutation.mutateAsync({
                    id: milestoneId,
                    updates: { offchain_state: "submitted" },
                });
            } else if (action === "approve") {
                await updateMilestoneMutation.mutateAsync({
                    id: milestoneId,
                    updates: { offchain_state: "approved" },
                });
            }
            await refetch();
        } catch (error) {
            console.error("Failed to update milestone:", error);
        } finally {
            setTxPending(false);
        }
    };

    const handleCreateDispute = async (milestoneId?: string) => {
        if (!project || !address) return;

        setTxPending(true);
        try {
            await createDisputeMutation.mutateAsync({
                project_id: project.id,
                milestone_id: milestoneId,
                opened_by: address.toLowerCase(),
                status: "open",
            });
            await refetch();
        } catch (error) {
            console.error("Failed to create dispute:", error);
        } finally {
            setTxPending(false);
        }
    };

    if (isLoading || !projectId) {
        return (
            <div className="p-10 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p>Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-10 text-center">
                <p className="text-muted-foreground">Project not found</p>
                <Link href="/dashboard/projects" className="text-accent hover:underline mt-2 inline-block">
                    Back to Projects
                </Link>
            </div>
        );
    }

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
                        <Badge variant="outline" className="glass bg-white/50">
                            {project.client_wallet.substring(0, 6)}...{project.client_wallet.substring(38)}
                        </Badge>
                        <Badge variant={project.status === "active" ? "success" : "default"} className="bg-emerald-500/10 text-emerald-600 border-none">
                            {project.status.replace("_", " ")}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-mono">
                            Contract: {project.onchain_address || "Pending"}
                        </span>
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
                        {project.milestones && project.milestones.length > 0 ? (
                            <div className="space-y-3">
                                {project.milestones.map((milestone) => {
                                    const isClient = address?.toLowerCase() === project.client_wallet.toLowerCase();
                                    const canSubmit = !isClient && milestone.offchain_state === "awaiting_submission";
                                    const canApprove = isClient && milestone.offchain_state === "submitted";

                                    return (
                                        <div key={milestone.id} className="group relative overflow-hidden rounded-xl border border-glass-border bg-glass p-5 hover:border-accent/30 transition-all duration-300">
                                            <div className={cn(
                                                "absolute left-0 top-0 h-full w-1",
                                                milestone.offchain_state === "released" ? "bg-emerald-500" :
                                                    milestone.offchain_state === "approved" ? "bg-emerald-500" :
                                                        milestone.offchain_state === "submitted" ? "bg-orange-400" :
                                                            milestone.offchain_state === "disputed" ? "bg-red-500" : "bg-muted"
                                            )} />

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="space-y-1 ml-3">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium text-foreground">{milestone.title}</h3>
                                                        {milestone.offchain_state === "released" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                                        {milestone.offchain_state === "submitted" && <Clock className="h-4 w-4 text-orange-400" />}
                                                        {milestone.offchain_state === "disputed" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                                    </div>
                                                    {milestone.description && (
                                                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                                    )}
                                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {format(new Date(milestone.deadline), "MMM d, yyyy")}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" /> {milestone.amount} {milestone.currency}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3 sm:ml-0 flex gap-2">
                                                    {canSubmit && (
                                                        <Button size="sm" className="w-full sm:w-auto" onClick={() => handleAction("submit", milestone.id)} disabled={txPending}>
                                                            {txPending ? "Submitting..." : "Submit Work"}
                                                        </Button>
                                                    )}
                                                    {canApprove && (
                                                        <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleAction("approve", milestone.id)} disabled={txPending}>
                                                            {txPending ? "Approving..." : "Approve & Pay"}
                                                        </Button>
                                                    )}
                                                    {milestone.offchain_state === "released" && (
                                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Paid & Released</Badge>
                                                    )}
                                                    {milestone.offchain_state === "approved" && (
                                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Approved</Badge>
                                                    )}
                                                    {milestone.offchain_state === "awaiting_submission" && (
                                                        <Badge variant="secondary" className="bg-muted text-muted-foreground">Awaiting Submission</Badge>
                                                    )}
                                                    {milestone.offchain_state === "disputed" && (
                                                        <Badge variant="destructive">Disputed</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No milestones found for this project.
                            </div>
                        )}
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
                                    const milestones = project.milestones || [];
                                    const hasSubmitted = milestones.some(m => m.offchain_state === "submitted");
                                    const hasApproved = milestones.some(m => m.offchain_state === "approved" || m.offchain_state === "released");
                                    const stepIndex = hasApproved ? 3 : hasSubmitted ? 2 : project.status === "active" ? 1 : 0;
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
                                <span className="font-mono font-medium text-lg">
                                    {project.milestones?.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0).toFixed(3) || "0"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Released so far</span>
                                <span className="font-mono font-medium text-emerald-600">
                                    {project.milestones?.filter(m => m.offchain_state === "released").reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0).toFixed(3) || "0"}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                {project.milestones && project.milestones.length > 0 ? (
                                    <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{
                                            width: `${(project.milestones.filter(m => m.offchain_state === "released").length / project.milestones.length) * 100}%`
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-0 bg-emerald-500 rounded-full" />
                                )}
                            </div>

                            <div className="pt-4 border-t border-glass-border">
                                <Button 
                                    variant="ghost" 
                                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleCreateDispute()}
                                    disabled={txPending}
                                >
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
